import React, {useMemo} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {RootState} from '@src/store';
import {navigateAndReset} from '@navigation/navigationUtils';
import {apiMethods, endPoints} from 'shared';
import {routes} from '@constants/labels';
import {showToast} from '@components/customToast';
import {fontWeights} from '@constants/general';
import CustomImage from '@components/customImage';
import useApi from '@api/useApi';
import CustomHeader from '@components/customHeader';
import CustomLoader from '@components/customLoader';
import CustomText from '@components/customText';
import RightArrow from '@assets/svg/rightArrow.svg';
import Exit from '@assets/svg/exit.svg';

function Profile(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {profileData} = useSelector((state: RootState) => state.home);
  const {loading, callApi} = useApi();
  const {t} = useTranslation();

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    red: {
      color: colors?.RED
    }
  };

  const {name, id, role, email, phoneNumber, policeStation, location, avatar, badgeNumber} =
    profileData;

  const onPressSettingsAndPrivacy = () => {
    // TO DO
  };

  const onPressHelpAndSupport = () => {
    // TO DO
  };

  const onPressLogout = async () => {
    try {
      const options = {
        method: apiMethods.post,
        endpoint: endPoints.logout,
        params: {userId: id}
      };

      const response = await callApi(options);

      if (response) {
        await AsyncStorage.clear();
        navigateAndReset(routes.LOGIN);
      } else {
        showToast(response?.error?.errors?.[0] || response?.error?.error || response?.error || '', {
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const onPressBottomCard = (id) => {
    switch (id) {
      case 1:
        onPressSettingsAndPrivacy();
        break;
      case 2:
        onPressHelpAndSupport();
        break;
      case 3:
        onPressLogout();
        break;
      default:
        break;
    }
  };

  const renderInspectorCard = () => {
    return (
      <View style={[styles.inspectorCard, themeStyle.cardBackground]}>
        <CustomImage
          style={styles.profileImage}
          source={
            avatar?.length > 0
              ? {uri: avatar}
              : require('../../assets/png/defaultOfficerAvatar.png')
          }
        />
        <View>
          <CustomText style={[styles.title, themeStyle.text]}>{name}</CustomText>
          <View style={styles.row}>
            {role?.length > 0 && (
              <CustomText style={[styles.description, themeStyle.text]}>{role}</CustomText>
            )}
            {badgeNumber?.length > 0 && <View style={styles.dot} />}
            {badgeNumber?.length > 0 && (
              <CustomText style={[styles.description, themeStyle.text]}>{badgeNumber}</CustomText>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderSubTitle = (title) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.subtle, themeStyle.text]}>
        {title}
      </CustomText>
    );
  };

  const renderProfileCard = () => {
    return (
      <View style={[styles.profileCard, themeStyle.cardBackground]}>
        <View style={styles.row}>
          <CustomText style={[styles.title, themeStyle.text]}>{t('profile')}</CustomText>
        </View>
        {email?.length > 0 && (
          <>
            {renderSubTitle(t('email_id'))}
            <CustomText style={[styles.description, themeStyle.text]}>{email}</CustomText>
          </>
        )}
        {phoneNumber?.length > 0 && (
          <>
            {renderSubTitle(t('contact_number'))}
            <CustomText style={[styles.description, themeStyle.text]}>{phoneNumber}</CustomText>
          </>
        )}
        {policeStation?.length > 0 && (
          <>
            {renderSubTitle(t('current_station'))}
            <CustomText style={[styles.description, themeStyle.text]}>{policeStation}</CustomText>
          </>
        )}
        {location?.length > 0 && (
          <>
            {renderSubTitle(t('location'))}
            <CustomText style={[styles.description, themeStyle.text]}>{location}</CustomText>
          </>
        )}
      </View>
    );
  };

  const renderProfileBottomCard = (item) => {
    const logout = item.id === 3;

    return (
      <TouchableOpacity
        onPress={() => onPressBottomCard(item.id)}
        key={item.id}
        style={[styles.BottomCard, themeStyle.cardBackground]}
      >
        <CustomText
          fontWeight={fontWeights.MEDIUM}
          style={[styles.title, logout ? themeStyle.red : themeStyle.text]}
        >
          {item.title}
        </CustomText>
        {logout ? <Exit /> : <RightArrow color={colors.PRIMARY_TEXT} />}
      </TouchableOpacity>
    );
  };

  const bottomCardItems = useMemo(
    () => [
      {id: 1, title: t('settings_privacy'), onPress: onPressSettingsAndPrivacy},
      {id: 2, title: t('help_support'), onPress: onPressHelpAndSupport},
      {id: 3, title: t('logout'), onPress: onPressLogout}
    ],
    [t]
  );

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomHeader title={t('my_profile')} />
      {loading && <CustomLoader />}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {renderInspectorCard()}
        {renderProfileCard()}
        {bottomCardItems?.map((item) => renderProfileBottomCard(item))}
      </ScrollView>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '4@vs'
  },
  inspectorCard: {
    padding: '12@s',
    borderRadius: '10@s',
    marginBottom: '12@vs',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    width: '60@s',
    height: '60@s',
    borderRadius: '30@s',
    overflow: 'hidden',
    marginRight: '10@s'
  },
  title: {
    fontSize: '18@ms0.3',
    fontWeight: '600',
    marginBottom: '4@vs'
  },
  subtle: {
    fontSize: '14@ms0.3',
    fontWeight: '500',
    marginBottom: '4@vs',
    paddingTop: '10@vs'
  },
  description: {
    fontSize: '15@ms0.3',
    fontWeight: '400'
  },
  profileCard: {
    padding: '12@s',
    borderRadius: '10@s',
    marginBottom: '12@vs'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  BottomCard: {
    padding: '12@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '10@s',
    marginBottom: '12@vs'
  },
  dot: {
    width: '4@s',
    height: '4@s',
    borderRadius: '2@s',
    backgroundColor: '#A4A4A4',
    marginHorizontal: '4@s'
  }
});

export default Profile;
