import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import i18n, {t} from 'i18next';

import {TOKEN, REFRESH_TOKEN, routes} from '@constants/labels';
import {BASE_URL} from '@env';
import {getLocation} from '@utils/common';
import {showToast} from '@components/customToast';
import {endPoints} from 'shared';
import {navigateAndReset} from '@navigation/navigationUtils';

type CallApiOptions = {
  params?: {[key: string]: string | number | object} | null;
  data?: {[key: string]: string | number | object} | null;
  endpoint: string;
  method: string;
};

// Create an instance of axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];
let refreshTimer = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

const debounceRefreshToken = () => {
  if (!refreshTimer)
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      isRefreshing = false;
    }, 3000);
};

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    const deviceId = await DeviceInfo.getUniqueId();
    const deviceModel = DeviceInfo.getModel();
    const userIp = await DeviceInfo.getIpAddress();
    let location: {latitude?: number; longitude?: number} = {};

    try {
      location = await getLocation();
    } catch (error) {
      showToast(t('error_location_permission_denied'), {type: 'error'});
    }

    const token = await AsyncStorage.getItem(TOKEN);

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (location?.latitude) config.headers['x-user-latitude'] = location?.latitude;
    if (location?.longitude) config.headers['x-user-longitude'] = location?.longitude;
    if (deviceId) config.headers['x-device-id'] = deviceId;
    if (deviceModel) config.headers['x-device-model'] = deviceModel;
    if (userIp && userIp !== 'unknown') config.headers['x-user-ip'] = userIp;
    config.headers['x-user-locale'] = i18n.language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const logOut = async () => {
  await AsyncStorage.clear();
  navigateAndReset(routes.LOGIN);
};

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const requestUrl = error?.response?.request?.responseURL;

    if (
      !requestUrl?.endsWith(endPoints.login) &&
      error?.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      if (isRefreshing)
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });

      originalRequest._retry = true;
      isRefreshing = true;
      debounceRefreshToken();

      try {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
        const response = await axios.post(`${BASE_URL}${endPoints.refreshToken}`, {
          refreshToken
        });
        const data = response?.data?.data;

        if (data) {
          await AsyncStorage.setItem(TOKEN, data?.accessToken);
          await AsyncStorage.setItem(REFRESH_TOKEN, data?.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;
          processQueue(null, data?.accessToken);
        }

        if (response?.data?.statusCode !== 200) {
          await AsyncStorage.clear();
          navigateAndReset(routes.LOGIN);
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logOut();

        return Promise.reject(refreshError);
      } finally {
        debounceRefreshToken();
      }
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async ({endpoint, method, data, params}: CallApiOptions) => {
  const options = {
    method,
    url: endpoint,
    ...(params ? {params} : {}),
    ...(data ? {data} : {})
  };

  try {
    const response = await api(options);

    return {success: true, data: response.data};
  } catch (error) {
    if (error.response)
      // Server responded with a status other than 200 range
      return {success: false, error: error.response.data, status: error.response.status};
    else if (error.request)
      // Request was made but no response was received
      return {success: false, error: 'No response received', status: null};
    // Something happened in setting up the request
    else return {success: false, error: error.message, status: null};
  }
};

export default api;
