import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
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
import {arrestStages, isIOS} from '@constants/general';
import {setSelectedLocalCode} from '@src/localization/localizationSlice';
import {resetArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import {setSelectedFilterData} from '@screens/filter-screen/filterSlice';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import CustomText from '@components/customText';
import CustomHeader from '@components/customHeader';
import EmptyScreen from '@components/emptyScreen';
import NewArrestButton from '@components/newArrestButton';
import ArrestCardMin from '@components/arrestCardMin';
import FeedCard from '@components/feedCard';
import ProsecutionIcon from '@assets/svg/prosecutionIcon.svg';
import CourtHammer from '@assets/svg/courtHammer.svg';
import Shield from '@assets/svg/shield.svg';
import RightArrow from '@assets/svg/rightArrow.svg';
import NotificationsIcon from '@assets/svg/notificationIcon.svg';
import EmptyArrests from '@assets/svg/emptyArrests.svg';

function Home(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {hideArrestTab} = useSelector((state: RootState) => state.feature);
  const {profileData} = useSelector((state: RootState) => state.home);
  const {selectedFilterData} = useSelector((state: RootState) => state.filter);

  const {t, i18n} = useTranslation();
  const arrestSummaryApi = useApi();
  const profileApi = useApi();
  const arrestsApi = useApi();
  const dispatch = useDispatch();

  const [summeryData, setSummeryData] = useState(null);
  const [arrestList, setArrestList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchArrestList();
    }, [])
  );

  useEffect(() => {
    getData();
  }, []);

  const fetchArrestList = async (cursor?: string) => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.arrests,
      params: {
        pageSize: 10,
        cursor
      }
    };

    const response = await arrestsApi.callApi(options);
    const newArrestList = response?.data?.data?.contents;

    if (newArrestList) setArrestList(cursor ? [...arrestList, ...newArrestList] : newArrestList);
  };

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
    const {arrestStageSummary} = summeryData || {};
    const {DRAFT, COURT_REVIEW, PROSECUTION_REVIEW} = arrestStageSummary || {};
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
    },
    arrestCount: {
      backgroundColor: colors?.PRIMARY_TEXT,
      color: colors?.CARD_BACKGROUND
    }
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

  const renderFeedCard = ({item}) => {
    return (
      <FeedCard
        key={item.id}
        icon={item.icon}
        title={item.title}
        subTitle={item.subTitle}
        subTitleIcon={item.subTitleIcon}
        onPress={() => onCardPress(item)}
      />
    );
  };

  const onEndReached = () => {
    const hasNextPage = arrestsApi?.data?.data?.hasNextPage;

    if (arrestList?.length > 0 && hasNextPage && !arrestsApi?.loading) {
      const cursor = arrestList?.length > 0 && arrestList[arrestList.length - 1]?.arrestId;

      fetchArrestList(cursor);
    }
  };

  const navigateToMandatoryInformation = () => {
    dispatch(resetArrestDraft());
    navigateTo(routes.MANDATORY_INFORMATION);
  };

  const navigateArrestDetails = (id) => {
    navigateTo(routes.ARREST_DETAILS_V2, {arrestId: id});
  };

  const onRefresh = () => {
    dispatch(setSelectedFilterData({}));
    fetchArrestList(null);
  };

  const renderEmpty = () => {
    if (arrestsApi.loading) return null;

    return (
      <EmptyScreen
        containerStyle={styles.emptyContainerStyle}
        icon={<EmptyArrests />}
        description={t('no_arrests_to_be_assigned')}
      />
    );
  };

  const renderFooter = () => {
    return (
      arrestsApi?.loading &&
      arrestList?.length > 0 && <ActivityIndicator color={colors.PRIMARY_COLOR} />
    );
  };

  const renderArrestCard = ({item}) => {
    return (
      <ArrestCardMin onPress={() => navigateArrestDetails(item?.arrestId)} arrestData={item} />
    );
  };

  const renderListHeader = () => {
    const arrests =
      arrestSummaryApi?.data?.data?.arrestStageSummary?.OFFICER_ASSIGNMENT_PENDING?.count || 0;

    return (
      <>
        <NewArrestButton onPress={() => navigateToMandatoryInformation()} />
        {hideArrestTab && (
          <View style={styles.rowTitle}>
            <CustomText style={styles.arrestText}>{t('arrests')}</CustomText>
            {arrests > 0 && (
              <CustomText style={[styles.arrestCount, themeStyle.arrestCount]}>
                {arrests || 0}
              </CustomText>
            )}
          </View>
        )}
      </>
    );
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
        <FlatList
          data={hideArrestTab ? arrestList : homeData}
          ListHeaderComponent={renderListHeader}
          renderItem={hideArrestTab ? renderArrestCard : renderFeedCard}
          keyExtractor={(item) => item.arrestId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListFooterComponent={hideArrestTab && renderFooter}
          ListEmptyComponent={hideArrestTab && renderEmpty}
          onRefresh={hideArrestTab && onRefresh}
          onEndReached={hideArrestTab && onEndReached}
          refreshing={false}
        />
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
  },
  arrestText: {
    fontWeight: '700',
    fontSize: '18@ms0.3'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '15@vs'
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10@vs',
    marginBottom: isIOS ? '2@vs' : '10@vs'
  },
  arrestCount: {
    fontSize: '11@ms0.3',
    fontWeight: '600',
    marginLeft: '7@s',
    paddingVertical: '4@s',
    paddingHorizontal: '6@s',
    borderRadius: '10@s',
    overflow: 'hidden'
  },
  emptyContainerStyle: {
    justifyContent: 'flex-start'
  }
});

export default Home;
