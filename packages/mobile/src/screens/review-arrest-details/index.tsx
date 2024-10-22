import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {apiMethods, endPoints} from 'shared';
import {showToast} from '@components/customToast';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import ArrestInformationCard from '@components/arrestInformationCard';
import CustomHeader from '@components/customHeader';
import CustomPopup from '@components/customPopup';
import CustomButton from '@components/customButton';
import CircleWarning from '@assets/svg/circleWarning.svg';
import CircleTick from '@assets/svg/circleTick.svg';
import styles from './styles';

function ReviewArrestDetails(params): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const {callApi, loading} = useApi();

  const routeParams = params?.route?.params;

  const [showClosePopup, setShowClosePopup] = useState(false);
  const [arrestId, setArrestId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (routeParams?.arrestId?.length > 0) setArrestId(routeParams?.arrestId);
  }, [routeParams]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onPressDiscard = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const getSubmitArrestData = () => {
    const {
      name,
      dob,
      gender,
      proofDocument = {},
      locationName,
      circumstance,
      criminalOffence,
      documents = [],
      circumstanceRecording = {},
      userImage = {},
      isIdRefused,
      defenceLawyer,
      defenceAssignment,
      locationData
    } = arrestDraft;

    const {locCity, locCounty, locStateDistrict, locState, locPostcode, locRoad, locSuburb} =
      locationData || {};

    const arrestDocuments = [
      ...documents.map(({mediaType, mediaKey, mediaName}) => ({
        mediaType,
        mediaKey,
        mediaName
      })),
      ...(circumstanceRecording.mediaKey
        ? [
          {
            mediaType: circumstanceRecording.mediaType,
            mediaKey: circumstanceRecording.mediaKey,
            mediaName: circumstanceRecording.mediaName
          }
        ]
        : [])
    ];

    let updatedProofDocument = null;

    if (arrestDraft?.proofDocument?.documentKey && !isIdRefused)
      updatedProofDocument = {
        documentKey: proofDocument?.documentKey,
        documentType: proofDocument?.documentType,
        documentName: proofDocument?.documentName
      };

    return {
      suspect: {
        name,
        dob,
        gender,
        avatar: userImage.mediaKey
      },
      proofDocument: updatedProofDocument,
      arrestData: {
        offenceDetails: criminalOffence,
        locationName,
        locRoad,
        locSuburb,
        locCity,
        locCounty,
        locStateDistrict,
        locState,
        locPostcode,
        circumstance,
        arrestDocuments,
        isIdRefused,
        defenceAssignment,
        defenceLawyer: {
          defenceLawyerName: defenceLawyer?.name,
          defenceLawyerContact: defenceLawyer?.phoneNumber,
          defenceLawyerEmail: defenceLawyer?.email
        }
      }
    };
  };

  const onSubmit = async () => {
    const data = getSubmitArrestData();
    const options = {
      method: apiMethods.post,
      endpoint: endPoints.draft,
      data
    };

    const response = await callApi(options);

    if (response?.data?.statusCode === 200) {
      setShowSuccessPopup(true);
      setArrestId(response?.data?.data?.id);
    } else {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const onSuccessPopupClick = () => {
    setShowSuccessPopup(false);
    navigateTo(routes.ARREST_DETAILS_V2, {arrestId, fromReview: true});
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          textStyle={styles.buttonText}
          style={styles.nextButton}
          onPress={onSubmit}
          title={t('submit')}
        />
      </View>
    );
  };

  const renderPopups = () => {
    return (
      <>
        <CustomPopup
          title={t('discard_your_progress')}
          description={t('you_havent_completed')}
          buttonProps={{
            primaryButtonTitle: t('close'),
            secondaryButtonTitle: t('discard'),
            primaryButtonAction: () => setShowClosePopup(false),
            secondaryButtonAction: onPressDiscard
          }}
          icon={<CircleWarning />}
          visible={showClosePopup}
          setVisible={setShowClosePopup}
        />
        <CustomPopup
          title={t('arrest_submitted')}
          buttonProps={{primaryButtonTitle: t('ok'), primaryButtonAction: onSuccessPopupClick}}
          icon={<CircleTick />}
          visible={showSuccessPopup}
          setVisible={setShowSuccessPopup}
          onClose={onSuccessPopupClick}
        />
      </>
    );
  };

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader
        showBackButton
        onClosePress={() => setShowClosePopup(true)}
        showCloseButton
        mainTitle={t('review_arrest_details')}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ArrestInformationCard arrestDraft={arrestDraft} />
      </KeyboardAwareScrollView>
      {renderPopups()}
      {renderFooter()}
      {loading && <CustomLoader />}
    </View>
  );
}

export default ReviewArrestDetails;
