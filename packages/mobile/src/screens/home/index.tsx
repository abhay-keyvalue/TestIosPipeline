import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import crashlytics from '@react-native-firebase/crashlytics';
import {useFocusEffect} from '@react-navigation/native';

import type {RootState} from '@src/store';
import {routes} from '@constants/labels';
import {navigateTo} from '@navigation/navigationUtils';
import {setProfileData} from './homeSlice';
import {showToast} from '@components/customToast';
import {apiMethods, endPoints} from 'shared';
import {arrestStages} from '@constants/general';
import {setSelectedLocalCode} from '@src/localization/localizationSlice';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import {setSelectedFilterData} from '@screens/filter-screen/filterSlice';
import CustomLoader from '@components/customLoader';
import useApi from '@api/useApi';
import CustomHeader from '@components/customHeader';
import NewArrestButton from '@components/newArrestButton';
import FeedCard from '@components/feedCard';
import ProsecutionIcon from '@assets/svg/prosecutionIcon.svg';
import CourtHammer from '@assets/svg/courtHammer.svg';
import Shield from '@assets/svg/shield.svg';
import RightArrow from '@assets/svg/rightArrow.svg';
import NotificationsIcon from '@assets/svg/notificationIcon.svg';

function Home(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {profileData} = useSelector((state: RootState) => state.home);
  const {selectedFilterData} = useSelector((state: RootState) => state.filter);

  const {t, i18n} = useTranslation();
  const arrestSummaryApi = useApi();
  const profileApi = useApi();
  const dispatch = useDispatch();

  const [summeryData, setSummeryData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    const data = arrestSummaryApi?.data?.data;

    if (data) setSummeryData(data);
  }, [arrestSummaryApi.data]);

  useEffect(() => {
    const data = profileApi?.data?.data || {};

    if (data) {
      const language = data.userLanguage;

      i18n.changeLanguage(language);
      if (language) dispatch(setSelectedLocalCode(language));
      if (data?.id) dispatch(setProfileData(data));
    }
  }, [profileApi.data]);

  useEffect(() => {
    if (profileApi?.error) showToast(profileApi?.error, {type: 'error'});

    if (arrestSummaryApi?.error) showToast(arrestSummaryApi?.error, {type: 'error'});
  }, [profileApi.error, arrestSummaryApi.error]);

  const getData = async () => {
    const homeOptions = {
      method: apiMethods.get,
      endpoint: endPoints.summary
    };

    const profileOptions = {
      method: apiMethods.get,
      endpoint: endPoints.profile
    };

    arrestSummaryApi.callApi(homeOptions);
    profileApi.callApi(profileOptions);
  };

  useEffect(() => {
    if (profileData?.id) onSignIn();
  }, [profileData]);

  const onSignIn = async () => {
    crashlytics().log('User signed in.');
    await Promise.all([
      crashlytics().setUserId(profileData?.id),
      crashlytics().setAttributes({
        role: profileData?.role,
        email: profileData?.email,
        phoneNumber: profileData?.phoneNumber,
        badgeNumber: profileData?.badgeNumber
      })
    ]);
  };

  const homeData = useMemo(() => {
    const {DRAFT, COURT_REVIEW, PROSECUTION_REVIEW} = summeryData || {};
    const prosecutionReviewCount = PROSECUTION_REVIEW?.count || 0;
    const courtReviewCount = COURT_REVIEW?.count || 0;
    const arrestDraftCount = DRAFT?.count || 0;
    const data = [
      {
        id: 1,
        title: t('prosecution_review'),
        subTitle:
          prosecutionReviewCount > 0
            ? `${prosecutionReviewCount} ${t('arrests')}`
            : `${t('no_items_found')}`,
        icon: <ProsecutionIcon color={colors.PRIMARY_TEXT} />,
        subTitleIcon: null
      },
      {
        id: 2,
        title: t('court_review'),
        subTitle: courtReviewCount
          ? `${courtReviewCount} ${t('arrests')}`
          : `${t('no_items_found')}`,
        icon: <CourtHammer color={colors.PRIMARY_TEXT} />,
        subTitleIcon: null
      },
      {
        id: 3,
        title: '',
        subTitle: t('recent_updates'),
        icon: <NotificationsIcon color={colors.PRIMARY_TEXT} />,
        subTitleIcon: <RightArrow color={colors.PRIMARY_TEXT} />
      }
    ];

    if (arrestDraftCount > 0)
      data.unshift({
        id: 4,
        title: t('missing_arrest_details'),
        subTitle:
          arrestDraftCount > 0 ? `${arrestDraftCount} ${t('arrests')}` : `${t('no_items_found')}`,
        icon: <Shield color={colors.PRIMARY_TEXT} />,
        subTitleIcon: null
      });

    return data;
  }, [summeryData, t]);

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    }
  };

  const navigateToMandatoryInformation = () => {
    dispatch(setArrestDraft({}));
    navigateTo(routes.MANDATORY_INFORMATION);
  };

  const onCardPress = (item) => {
    switch (item.id) {
      case 1:
        dispatch(
          setSelectedFilterData({...selectedFilterData, stage: arrestStages.PROSECUTION_REVIEW})
        );
        navigateTo(routes.ARRESTS);
        break;
      case 2:
        dispatch(setSelectedFilterData({...selectedFilterData, stage: arrestStages.COURT_REVIEW}));
        navigateTo(routes.ARRESTS);
        break;
      case 3:
        navigateTo(routes.NOTIFICATIONS);
        break;
      case 4:
        dispatch(setSelectedFilterData({...selectedFilterData, stage: arrestStages.DRAFT}));
        navigateTo(routes.ARRESTS);
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomHeader
        showAvatar
        mainTitle={t('CourtApp')}
        showLanguageSelector
        mainTitleStyle={styles.mainTitle}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <NewArrestButton onPress={navigateToMandatoryInformation} />
          {homeData?.map((item) => (
            <FeedCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              subTitle={item.subTitle}
              subTitleIcon={item.subTitleIcon}
              onPress={() => onCardPress(item)}
            />
          ))}
        </ScrollView>
      </View>
      {!summeryData && arrestSummaryApi.loading && <CustomLoader />}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: '12@s',
    paddingTop: '6@vs',
    flex: 1
  },
  list: {
    paddingBottom: '40@vs'
  },
  mainTitle: {
    fontSize: '22@ms0.3',
    fontWeight: '600'
  }
});

export default Home;
