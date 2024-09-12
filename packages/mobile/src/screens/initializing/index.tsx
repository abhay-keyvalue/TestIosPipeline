import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import {TOKEN, routes} from '@constants/labels';
import {navigateAndReset, navigateToNestedScreen} from '@navigation/navigationUtils';

const Initializing = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      // Tdo: Handle foreground message
    });

    messaging().onNotificationOpenedApp(async () => {
      const token = await AsyncStorage.getItem(TOKEN);

      const isAuthenticated = token?.length > 0;

      if (isAuthenticated) navigateToNestedScreen(routes.HOME_TABS, routes.NOTIFICATIONS);
    });
    messaging().setBackgroundMessageHandler(async () => {
      // Tdo: Handle background message
    });
    initialNavigation();

    return unsubscribe;
  }, []);

  const initialNavigation = async () => {
    const token = await AsyncStorage.getItem(TOKEN);

    if (token?.length > 0) navigateAndReset(routes.HOME_TABS);
    else navigateAndReset(routes.LOGIN);
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Initializing;
