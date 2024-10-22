import React, {useEffect} from 'react';
import {StyleSheet, View, SafeAreaView, Linking} from 'react-native';
import {navigateTo} from '@navigation/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {Theme} from '@interface/common';
import {setThemeData} from '@utils/themeSlice';
import {routes} from '@constants/labels';
import {
  checkRequestLocationPermission,
  checkRequestPushNotificationPermission
} from '@utils/permission';
import Root from '@navigation/root';
import NetworkLogs from '@components/networkLogs';

function Init(): React.JSX.Element {
  //const theme = useColorScheme();
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const {selectedTheme, colors} = useSelector((state: RootState) => state.theme);
  const {selectedLocalCode} = useSelector((state: RootState) => state.localization);

  const requestPermissions = async () => {
    checkRequestPushNotificationPermission();
    checkRequestLocationPermission();
  };

  const manageTheme = () => {
    //const isDarkMode = theme === 'dark'; // This is the original line
    const isDarkMode = false; // This is the modified line for disable dark mode

    if (
      (isDarkMode && selectedTheme === Theme.LIGHT) ||
      (!isDarkMode && selectedTheme === Theme.DARK)
    )
      dispatch(setThemeData(isDarkMode ? Theme.DARK : Theme.LIGHT));
  };

  const manageAppLanguage = () => {
    if (selectedLocalCode !== i18n.language) i18n.changeLanguage(selectedLocalCode);
  };

  const manageLinks = async (url) => {
    if (!url) return null;

    // TO DO: Logic should be changed based on the requirement
    if (url.includes('reset-password')) {
      const token = url?.split('?token=')?.[1];

      navigateTo(routes.RESET_PASSWORD, {token});
    }
  };

  useEffect(() => {
    requestPermissions();
    manageAppLanguage();
    manageTheme();

    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      manageLinks(initialUrl);
    };

    const handleLinkingEvent = (event) => {
      const url = event.url;

      manageLinks(url);
    };

    handleInitialUrl();

    const linkingListener = Linking.addEventListener('url', handleLinkingEvent);

    return () => {
      linkingListener.remove();
    };
  }, []);

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    }
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <SafeAreaView style={styles.container}>
        <Root />
        <NetworkLogs />
      </SafeAreaView>
      <SafeAreaView style={[styles.bottom, themeStyle.cardBackground]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottom: {
    flex: 0
  }
});

export default Init;
