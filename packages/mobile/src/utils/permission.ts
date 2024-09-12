import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {request, PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';

import {isIOS} from '@constants/general';

const checkRequestLocationPermission = async () => {
  let response = {status: ''};

  let permission;

  if (Platform.OS === 'ios') permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  else if (Platform.OS === 'android') permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const result = await request(permission);

  response = {status: result};

  if (result === RESULTS.UNAVAILABLE) {
    await requestMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]);

    response = {status: RESULTS.GRANTED};
  }

  return response;
};

const checkRequestPushNotificationPermission = async () => {
  let response = {status: ''};

  if (isIOS) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) response = {status: RESULTS.GRANTED};
  } else {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

    response = {status: result};
  }

  return response;
};

export {RESULTS, checkRequestLocationPermission, checkRequestPushNotificationPermission};
