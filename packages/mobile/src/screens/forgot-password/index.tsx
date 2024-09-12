import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import type {RouteProp} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '@navigation/root';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomLoader from '@components/customLoader';
import {showToast} from '@components/customToast';
import CourtAppLogo from '@assets/svg/courtAppLogo.svg';
import useApi from '@api/useApi';
import styles from './style';

function ForgotPassword(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);

  const {params} = useRoute<RouteProp<RootStackParamList, 'ForgotPassword'>>();
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

  const [newPassword, setNewPassword] = useState('new123');
  const [reEnterPassword, setReEnterPassword] = useState('new12');

  useEffect(() => {
    sentResetCode();
  }, []);

  const sentResetCode = async () => {
    const options = {
      method: 'POST',
      endpoint: '/forgot-password',
      data: {email: params?.email}
    };

    await callApi(options);
  };

  const resetPassword = async () => {
    if (newPassword !== reEnterPassword) {
      showToast('password mismatch', {type: 'error'});

      return;
    }

    const options = {
      method: 'POST',
      endpoint: '/reset',
      data: {email: params?.email, password: newPassword}
    };

    const response = await callApi(options);

    if (response.data) navigateTo(routes.HOME_TABS);
    else showToast('reset password failed', {type: 'error'});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={[styles.logoContainer, themeStyle.logoContainer]}>
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
        <CustomText style={[styles.signIn, themeStyle.text]}>{t('reset_password')}</CustomText>
        <CustomText style={[styles.inputLabel, themeStyle.text]}>{t('new_password')}</CustomText>
        <CustomTextInput
          value={newPassword}
          secureTextEntry
          onChangeText={setNewPassword}
          placeholder='Enter your password'
        />
        <CustomText style={[styles.inputLabel, themeStyle.text]}>
          {t('re_enter_password')}
        </CustomText>
        <CustomTextInput
          value={reEnterPassword}
          secureTextEntry
          onChangeText={setReEnterPassword}
          placeholder='ReEnter your password'
        />
        <CustomButton onPress={resetPassword} style={styles.button} title={t('reset')} />
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

export default ForgotPassword;
