import {request, PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';

const usePermission = () => {
  const checkRequestLocationPermission = async () => {
    let response = {status: ''};

    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    response = {status: result};

    if (result === RESULTS.UNAVAILABLE) {
      await requestMultiple([
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      ]);

      response = {status: RESULTS.GRANTED};
    }

    return response;
  };

  return {checkRequestLocationPermission, RESULTS};
};

export default usePermission;
