import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {apiMethods, endPoints} from 'shared';
import {showToast} from '@components/customToast';
import {mediaTypes} from '@constants/general';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import CustomHeader from '@components/customHeader';
import ArrestStatusCard from '@components/arrestStatusCard';
import ArrestInformationCard from '@components/arrestInformationCard';

function ArrestDetailsV2(params): React.JSX.Element {
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
  const [fromReview, setFromReview] = useState(routeParams?.fromReview);
  const [arrestDetailsData, setArrestDetailsData] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (routeParams?.arrestId?.length > 0) setArrestId(routeParams?.arrestId);
    setFromReview(routeParams?.fromReview);
  }, [routeParams]);

  useEffect(() => {
    if (arrestId) getArrestDetails();
  }, [arrestId]);

  const handleBackButton = () => {
    navigateToHome();

    return true;
  };

  const navigateToHome = () => {
    navigateTo(routes.HOME_TABS);
  };

  const createArrestDetailsData = (data) => {
    const updatedData = {
      createdAt: data.createdAt || '',
      caseNumber: data.caseNumber || '',
      name: data.suspect?.name || '',
      gender: data.suspect?.gender || '',
      dob: data.suspect?.dob || '',
      avatar: data.suspect?.avatarThumbnail || data.suspect?.avatar || '',
      criminalOffence: data.offenceDetails?.criminalOffence || '',
      isIdRefused: data?.isIdRefused,
      locationName: data.locationName || '',
      circumstance: data.offenceDetails?.circumstance || '',
      circumstanceRecording: data.offenceDetails?.circumstanceRecordings[0] || null,
      proofDocument: data.suspect?.proofDocument || null,
      defenceAssignment: data.defenseDetails?.detaineeDeclaration,
      defenceLawyer: {
        name: data.defenseDetails?.name,
        phoneNumber: data.defenseDetails?.phoneNumber
      },
      documents: data.documents?.filter((doc) => doc.mediaType === mediaTypes.PROOF_DOCUMENT) || [],
      userImage: data.documents?.find((doc) => doc.mediaType === mediaTypes.USER_AVTAR) || null
    };

    setArrestDetailsData(updatedData);
  };

  const getArrestDetails = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: `${endPoints.arrests}/${arrestId}`
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200) createArrestDetailsData(response?.data?.data);

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
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
        {fromReview && (
          <View style={styles.arrestStatus}>
            <ArrestStatusCard status={t('case_successfully_logged_in')} />
          </View>
        )}
        <ArrestInformationCard arrestDraft={arrestDetailsData} hideEdit />
      </KeyboardAwareScrollView>
      {loading && <CustomLoader />}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '2@s'
  },
  arrestStatus: {
    marginBottom: '16@vs'
  }
});

export default ArrestDetailsV2;
