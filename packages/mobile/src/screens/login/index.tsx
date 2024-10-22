import React, {useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import type {RootState} from '@src/store';
import {navigateAndReset} from '@navigation/navigationUtils';
import {REFRESH_TOKEN, TOKEN, routes} from '@constants/labels';
import {showToast} from '@components/customToast';
import {apiMethods, endPoints} from 'shared';
import {isAndroid} from '@constants/general';
import useApi from '@api/useApi';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomLoader from '@components/customLoader';
import CourtAppLogo from '@assets/svg/courtAppLogo.svg';
import ShowPassword from '@assets/svg/showPassword.svg';
import styles from './style';

const gmailLink = 'https://gmail.app.goo.gl';

function Login(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);

  const {t} = useTranslation();
  const {loading, callApi} = useApi();

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    logoContainer: {
      backgroundColor: colors?.SECONDARY_BACKGROUND
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecuredTextEntry] = useState(true);

  const onSubmit = async () => {
    if (isAndroid) await messaging().registerDeviceForRemoteMessages();
    const pushToken = await messaging().getToken();
    const deviceName = DeviceInfo.getModel();
    const options = {
      method: apiMethods.post,
      endpoint: endPoints.login,
      data: {email: email?.trim(), password, deviceName, pushToken}
    };

    const response = await callApi(options);

    const data = response?.data?.data;

    if (data) {
      await AsyncStorage.setItem(TOKEN, data?.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN, data?.refreshToken);
      navigateAndReset(routes.HOME_TABS);
    } else {
      const errorMessage =
        response?.error?.errors?.[0] ||
        response?.error?.error ||
        response?.error ||
        t('error_login_failed');

      showToast(errorMessage, {type: 'error'});
    }
  };

  const resetPassword = async () => {
    const options = {
      method: apiMethods.post,
      endpoint: endPoints.initiateResetPassword,
      params: {username: email}
    };
    const response = await callApi(options);

    if (response.data) Linking.openURL(gmailLink);
    else showToast(t('reset_password_failed'), {type: 'error'});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <CourtAppLogo />
        </View>
        <CustomText style={[styles.appLabel, themeStyle.text]}>{t('courtApp')}</CustomText>
        <CustomText style={[styles.subTitle, themeStyle.text]}>{t('court_access_org')}</CustomText>
      </View>
    );
  };

  const renderLoginContainer = () => {
    return (
      <View style={styles.loginContainer}>
        <CustomText style={[styles.signIn, themeStyle.text]}>{t('sign_in')}</CustomText>
        <CustomText style={[styles.inputLabel, themeStyle.text]}>{t('email')}</CustomText>
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          inputMode='email'
          placeholder='Enter your mail'
        />
        <CustomText style={[styles.inputLabel, themeStyle.text]}>{t('password')}</CustomText>
        <View>
          <CustomTextInput
            value={password}
            secureTextEntry={secureTextEntry}
            onChangeText={setPassword}
            placeholder='Enter your password'
          />
          <TouchableOpacity
            onPress={() => setSecuredTextEntry(!secureTextEntry)}
            style={styles.showContainer}
          >
            <ShowPassword />
          </TouchableOpacity>
        </View>

        <CustomButton onPress={onSubmit} style={styles.button} title={t('sign_in')} />
        <CustomText onPress={resetPassword} style={[styles.forgotPasswordLabel, themeStyle.text]}>
          {t('forgot_my_password')}
        </CustomText>
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      {loading && <CustomLoader />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {renderHeader()}
        {renderLoginContainer()}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Login;
