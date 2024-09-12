import React, {useEffect, useMemo, useState} from 'react';
import {View, BackHandler, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {navigateTo} from '@navigation/navigationUtils';
import {arrestStagesLabels, fontWeights, lawyerTypes} from '@constants/general';
import {routes} from '@constants/labels';
import {apiMethods, endPoints} from 'shared';
import {showToast} from '@components/customToast';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import CustomHeader from '@components/customHeader';
import ArrestStatusCard from '@components/arrestStatusCard';
import ActivityTimeline from '@components/activityTimeline';
import LawyerDetailsCard from '@components/lawyerDetailsCard';
import ArrestDetailsCard from '@components/arrestDetailsCard';
import CustomImage from '@components/customImage';
import CustomText from '@components/customText';
import styles from './styles';

function ArrestDetails(params): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();
  const {callApi, loading} = useApi();
  const routeParams = params?.route?.params;

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    statusContainer: {
      backgroundColor: colors?.BORDER_COLOR
    }
  };

  const [arrestId, setArrestId] = useState(routeParams?.arrestId);
  const [arrestDetailsData, setArrestDetailsData] = useState(null);

  const {suspect, caseNumber, stage, defenseDetails, prosecutorDetails, officerDetails, createdAt} =
    arrestDetailsData || {};

  const {name, avatarThumbnail, avatar} = suspect || {};

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (routeParams?.arrestId?.length > 0) setArrestId(routeParams?.arrestId);
  }, [routeParams]);

  useEffect(() => {
    if (arrestId) {
      getArrestDetails();
      getActivityTimeline();
    }
  }, [arrestId]);

  const handleBackButton = () => {
    navigateToHome();

    return true;
  };

  const navigateToHome = () => {
    navigateTo(routes.HOME_TABS);
  };

  const getActivityTimeline = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: `${endPoints.arrests}/${arrestId}/timeline`
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200) setTimeline(response?.data?.data);

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const getArrestDetails = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: `${endPoints.arrests}/${arrestId}`
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200) setArrestDetailsData(response?.data?.data);

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const openImageViewer = (url: string) => {
    navigateTo(routes.IMAGE_VIEWER, {imageUrl: url});
  };

  const arrestStatus = useMemo(() => {
    const date = new Date(createdAt);

    date.setHours(date.getHours() + 48); // Add 48 hours
    const updatedTimestamp = date.getTime();

    return `${t('court_will_hear_the_case_by')} ${dateFormat(updatedTimestamp, 'hh:MM TT, dd mmmm yyyy')}`;
  }, []);

  const renderSuspectImage = useMemo(
    () => avatarThumbnail?.length > 0 && <CustomImage source={{uri: avatarThumbnail}} />,
    [avatarThumbnail]
  );

  const renderSuspectInfo = () => {
    return (
      <View style={[styles.suspectInfo, themeStyle.cardBackground]}>
        <TouchableOpacity
          disabled={!(avatar?.length > 0)}
          onPress={() => openImageViewer(avatar)}
          style={styles.suspectImage}
        >
          {renderSuspectImage}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <CustomText
            numberOfLines={2}
            fontWeight={fontWeights.MEDIUM}
            style={[themeStyle.text, styles.title]}
          >
            {name || '-'}
          </CustomText>
          <CustomText numberOfLines={1} style={[themeStyle.text, styles.text]}>
            {caseNumber || '-'}
          </CustomText>
          {stage?.length > 0 && (
            <View style={[styles.statusContainer, themeStyle.statusContainer]}>
              <CustomText style={styles.statusText}>{arrestStagesLabels[stage]}</CustomText>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderHalfBox = (title: string, value: string) => {
    return (
      <View style={styles.half}>
        <CustomText
          numberOfLines={2}
          fontWeight={fontWeights.MEDIUM}
          style={[themeStyle.text, styles.text]}
        >
          {title}
        </CustomText>
        <CustomText numberOfLines={2} style={[themeStyle.text, styles.text]}>
          {value || '-'}
        </CustomText>
      </View>
    );
  };

  const renderOfficerDetails = () => {
    return (
      <View style={[styles.cardContainer, themeStyle.cardBackground]}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.header]}>
          {t('officer_details')}
        </CustomText>
        <View style={styles.row}>
          {renderHalfBox(t('officer_name'), officerDetails?.name)}
          {renderHalfBox(t('location'), officerDetails?.locationName)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('badge_number'), officerDetails?.badgeNumber)}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader
        showBackButton
        mainTitle={t('Arrest Details')}
        showLanguageSelector
        onBackPress={navigateToHome}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ArrestStatusCard status={arrestStatus} type={'court'} />
        {renderSuspectInfo()}
        {timeline?.length > 0 && <ActivityTimeline timeline={timeline} />}
        <ArrestDetailsCard arrestDetails={arrestDetailsData} />
        <LawyerDetailsCard
          type={lawyerTypes.PROSECUTOR}
          lawyerName={prosecutorDetails?.name}
          assignedTime={prosecutorDetails?.assignedAt}
          supervisor={prosecutorDetails?.supervisor}
          editable={false}
        />
        <LawyerDetailsCard
          type={lawyerTypes.DEFENSE}
          lawyerName={defenseDetails?.lawyerName}
          telephoneNumber={defenseDetails?.lawyerTelephone}
          assignedTime={defenseDetails?.assignedAt}
          supervisor={defenseDetails?.supervisor}
          editable={false}
        />
        {renderOfficerDetails()}
      </KeyboardAwareScrollView>
      {loading && <CustomLoader />}
    </View>
  );
}

export default ArrestDetails;
