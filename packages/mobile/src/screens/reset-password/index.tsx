import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import type {RouteProp} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '@navigation/root';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {navigateAndReset} from '@navigation/navigationUtils';
import {endPoints} from 'shared';
import {showToast} from '@components/customToast';
import {routes} from '@constants/labels';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomLoader from '@components/customLoader';
import CustomHeader from '@components/customHeader';
import TickBullet from '@assets/svg/tickBullet.svg';
import useApi from '@api/useApi';
import styles from './style';

function ResetPassword(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);

  const {params} = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
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
    },
    borderBg: {
      backgroundColor: colors.BORDER_COLOR
    }
  };

  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  const passwordCriteria = [
    t('minimum_8_characters'),
    t('one_uppercase_and_lowercase_character'),
    t('one_number'),
    t('one_special_character'),
    t('confirm_new_passwords_match')
  ];

  const resetPassword = async () => {
    if (newPassword !== reEnterPassword) {
      showToast(t('password_mismatch'), {type: 'error'});

      return;
    }

    const options = {
      method: 'POST',
      endpoint: endPoints.resetPassword,
      params: {token: params.token},
      data: {newPassword}
    };

    const response = await callApi(options);

    if (response.data) navigateAndReset(routes.LOGIN);
    else showToast(t('reset_password_failed'), {type: 'error'});
  };

  const renderPasswordCriteria = () => {
    return (
      <View style={[styles.passwordCriteriaContainer, themeStyle.borderBg]}>
        <CustomText style={[styles.passwordCriteria, themeStyle.text]}>
          {t('password_criteria')}
        </CustomText>
        {passwordCriteria.map((criteria, index) => (
          <View style={styles.criteriaContainer} key={index}>
            <TickBullet />
            <CustomText style={[styles.criteriaText, themeStyle.text]}>{criteria}</CustomText>
          </View>
        ))}
      </View>
    );
  };

  const renderLoginContainer = () => {
    return (
      <View style={styles.loginContainer}>
        <View>
          <CustomHeader title={t('reset_password')} showBackButton />
          <CustomText style={[styles.inputLabel, themeStyle.text]}>{t('new_password')}</CustomText>
          <CustomTextInput
            value={newPassword}
            secureTextEntry
            onChangeText={setNewPassword}
            placeholder={t('enter_your_password')}
          />
          <CustomText style={[styles.inputLabel, themeStyle.text]}>
            {t('re_enter_password')}
          </CustomText>
          <CustomTextInput
            value={reEnterPassword}
            secureTextEntry
            onChangeText={setReEnterPassword}
            placeholder={t('re_enter_your_password')}
          />
          {renderPasswordCriteria()}
        </View>

        <CustomButton onPress={resetPassword} style={styles.button} title={t('change_password')} />
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
        {renderLoginContainer()}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ResetPassword;
