import axios from 'axios';
import {endPoints, apiMethods} from '../constants/endPoints';

type CallApiOptions = {
  params?: {[key: string]: string | number} | null;
  data?: {[key: string]: string | number} | null;
  endpoint: string;
  method: string;
};

const axiosApiInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: {resolve: (value: unknown) => void; reject: (reason?: unknown) => void}[] = [];
let refreshTimer: NodeJS.Timeout | null = null;

const debounceRefreshToken = () => {
  if (!refreshTimer)
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      isRefreshing = false;
    }, 3000);
};

const processQueue = (error: string | null, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

axiosApiInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = error?.response?.request?.responseURL;

    if (
      !requestUrl?.endsWith(endPoints.login) &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing)
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return axiosApiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });

      originalRequest._retry = true;
      isRefreshing = true;
      debounceRefreshToken();
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        const options = {
          method: apiMethods.post,
          endpoint: endPoints.refreshToken,
          data: {refreshToken}
        };

        try {
          const response = await apiRequest(options);
          const data = response?.data?.data;

          if (data) {
            localStorage.setItem('token', data?.accessToken);
            localStorage.setItem('refreshToken', data?.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            processQueue(null, data?.accessToken);
          }

          if (response?.data?.statusCode !== 200) localStorage.clear();

          return axiosApiInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as string, null);

          return Promise.reject(refreshError);
        } finally {
          debounceRefreshToken();
        }
      }

      return Promise.reject(error);
    }
  }
);

export const setupBaseUrl = (url: string) => {
  axiosApiInstance.defaults.baseURL = url;
};

export const apiRequest = async ({endpoint, method, data, params}: CallApiOptions) => {
  const options = {
    method,
    url: endpoint,
    ...(params ? {params} : {}),
    ...(data ? {data} : {})
  };

  try {
    const response = await axiosApiInstance(options);

    return {success: true, data: response.data};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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

export {axiosApiInstance};
