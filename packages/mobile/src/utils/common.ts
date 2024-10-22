import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {t} from 'i18next';
import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

import {checkRequestLocationPermission, RESULTS} from '@utils/permission';
import {apiRequest} from '@api/index';
import {apiMethods, endPoints} from 'shared';
import {showToast} from '@components/customToast';

export const getLocation = async (): Promise<{latitude?: number; longitude?: number}> => {
  const permissionData = await checkRequestLocationPermission();

  return new Promise((resolve, reject) => {
    if (permissionData.status === RESULTS.GRANTED)
      Geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;

          resolve({latitude, longitude});
        },
        (error) => {
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );
    else reject('Location Permission Denied');
  });
};

export const getMediaPreSignedUrl = async ({key, mediaType}) => {
  const options = {
    endpoint: endPoints.media,
    method: apiMethods.post,
    data: {key, httpMethod: apiMethods.put, mediaType}
  };

  try {
    const response = await apiRequest(options);

    return response?.data?.data;
  } catch (error) {
    showToast(t('failed_to_get_presigned_url'), {type: 'error'});

    return null;
  }
};

export const getCityName = async (lat, long) => {
  try {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse`;
    const apiParams = {
      lat,
      lon: long,
      format: 'json'
    };

    const response = await axios.get(apiUrl, {params: apiParams});

    return response?.data;
  } catch (error) {
    showToast(t('unable_to_get_location'), {type: 'error'});

    return null;
  }
};

export const getCurrentLocation = async () => {
  const location = await getLocation();
  const data = await getCityName(location.latitude, location.longitude);

  let locationName: string = '';
  const address = data?.address;

  const {town, village, suburb, state_district, state, road, city, country, postcode} =
    address || {};

  const cityParts = [town, village, suburb, state_district, state].filter(Boolean);

  locationName = cityParts.splice(0, 2).join(', ');

  const locationData = {
    locRoad: road,
    locSuburb: suburb,
    locCity: city,
    locCount: country,
    locStateDistrict: state_district,
    locState: state,
    locPostcode: postcode
  };

  if (locationName.length === 0) showToast(t('Unable to get location'), {type: 'error'});

  return {locationName, locationData};
};

export const debounce = (func, wait) => {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  try {
    const parsedNumber = phoneUtil.parse(phoneNumber, null);
    const isValid = phoneUtil.isValidNumber(parsedNumber);

    return isValid;
  } catch (error) {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return emailRegex.test(email);
};
