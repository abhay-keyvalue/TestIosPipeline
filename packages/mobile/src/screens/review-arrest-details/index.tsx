import React, {useCallback, useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {goBack, navigateAndPush, navigateTo} from '@navigation/navigationUtils';
import {defenceAssignmentList} from '@constants/general';
import {routes} from '@constants/labels';
import {apiMethods, endPoints} from 'shared';
import {showToast} from '@components/customToast';
import {setArrestDraft} from './arrestDraftSlice';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import SuspectInfoCard from '@components/suspectInfoCard';
import ResidentialDetailsCard from '@components/residentialDetailsCard';
import OffenseDetailsCard from '@components/offenseDetailsCard';
import AdditionalInfoCard from '@components/additionalInfoCard';
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
  const getArrestApi = useApi();
  const dispatch = useDispatch();

  const routeParams = params?.route?.params;

  const {
    suspect,
    caseNumber,
    createdAt,
    locationName,
    criminalOffence,
    offences,
    circumstance,
    additionalInfo,
    defenseDetails
  } = arrestDraft;

  const {name, avatarThumbnail, dob, gender, phoneNumber, proofDocument, address} = suspect || {};

  const {district, city, neighborhood, street, staircaseNumber, palaceNumber} = address || {};

  const detaineeDeclaration = defenceAssignmentList.find(
    (item) => item.value === arrestDraft?.detaineeDeclaration
  );

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

  useFocusEffect(
    useCallback(() => {
      if (arrestId) getArrestDetails();
    }, [arrestId])
  );

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onPressDiscard = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const getSubmitArrestData = () => {
    return {
      arrestId
    };
  };

  const getArrestDetails = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: `${endPoints.arrests}/${arrestId}`
    };

    try {
      const response = await getArrestApi.callApi(options);

      if (response?.data?.statusCode === 200) dispatch(setArrestDraft(response?.data?.data));
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const onSubmit = async () => {
    const options = {
      method: apiMethods.put,
      endpoint: endPoints.submitArrest,
      data: getSubmitArrestData()
    };

    const response = await callApi(options);

    if (response?.data?.statusCode === 200) setShowSuccessPopup(true);
    else showToast(t('failed_to_save_data'), {type: 'error'});
  };

  const editResidentialDetails = () => {
    navigateAndPush(routes.RESIDENTIAL_DETAILS, {arrestId, isEditAndSubmit: true});
  };

  const editAdditionalInfo = () => {
    navigateAndPush(routes.ADDITIONAL_INFO, {arrestId, isEditAndSubmit: true});
  };

  const onSuccessPopupClick = () => {
    setShowSuccessPopup(false);
    navigateTo(routes.ARREST_DETAILS, {arrestId});
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
          title={t('save_your_progress')}
          description={t('you_havent_completed')}
          buttonProps={{
            primaryButtonTitle: t('save_for_later'),
            secondaryButtonTitle: t('discard'),
            secondaryButtonAction: onPressDiscard
          }}
          icon={<CircleWarning />}
          visible={showClosePopup}
          setVisible={setShowClosePopup}
        />
        <CustomPopup
          title={t('arrest_submitted')}
          description={`${t('Court_hearing_by')} ${dateFormat(new Date().getTime(), 'MM:hh, dd/mm/yyyy')}`}
          buttonProps={{primaryButtonTitle: t('ok'), primaryButtonAction: onSuccessPopupClick}}
          icon={<CircleTick />}
          visible={showSuccessPopup}
          setVisible={setShowSuccessPopup}
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
        <SuspectInfoCard
          arrestId={arrestId}
          name={name}
          imageUrl={avatarThumbnail}
          documentUrl={proofDocument?.documentKey}
          criminalCode={caseNumber}
          arrestTime={createdAt}
          arrestLocation={locationName}
          gender={gender}
          dob={dob}
          idFileName={proofDocument?.documentName}
        />
        <ResidentialDetailsCard
          onPressEdit={editResidentialDetails}
          district={district}
          city={city}
          neighborhood={neighborhood}
          street={street}
          staircase_number={staircaseNumber}
          telephone_number={phoneNumber}
          private_house_palace_number={palaceNumber}
        />
        <OffenseDetailsCard
          arrestId={arrestId}
          criminalOffense={criminalOffence}
          articleOfCriminalCodes={offences}
          circumstances={circumstance}
        />
        <AdditionalInfoCard
          onPressEdit={editAdditionalInfo}
          detaineeDeclaration={detaineeDeclaration}
          additionalInfo={additionalInfo}
          lawyerName={defenseDetails?.name}
          telephoneNumber={defenseDetails?.phoneNumber}
        />
      </KeyboardAwareScrollView>
      {renderPopups()}
      {renderFooter()}
      {loading && <CustomLoader />}
    </View>
  );
}

export default ReviewArrestDetails;
