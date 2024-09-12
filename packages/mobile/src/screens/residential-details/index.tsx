import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {showToast} from '@components/customToast';
import {fontWeights} from '@constants/general';
import {apiMethods, endPoints} from 'shared';
import {routes} from '@constants/labels';
import useApi from '@api/useApi';
import CustomPhoneInput from '@components/customPhoneInput';
import CustomLoader from '@components/customLoader';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import Progress from '@components/progress';
import CircleWarning from '@assets/svg/circleWarning.svg';
import CustomPopup from '@components/customPopup';
import styles from './styles';

type ResidentialDetailsProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

function ResidentialDetails(props: ResidentialDetailsProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const {callApi, loading} = useApi();
  const routeParams = props?.route?.params;

  const [district, setDistrict] = useState('');
  const [cityMunicipality, setCityMunicipality] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [privateHousePalaceNumber, setPrivateHousePalaceNumber] = useState('');
  const [staircaseNumber, setStaircaseNumber] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [arrestId, setArrestId] = useState(routeParams?.arrestId);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(false);

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    line: {
      backgroundColor: colors?.BORDER_COLOR
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    },
    red: {
      color: colors?.RED
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
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    if (arrestId) {
      const address = arrestDraft?.suspect?.address;

      setDistrict(address?.district);
      setCityMunicipality(address?.city);
      setNeighborhood(address?.neighborhood);
      setStreet(address?.street);
      setPrivateHousePalaceNumber(address?.palaceNumber);
      setStaircaseNumber(address?.staircaseNumber);
      setTelephoneNumber(arrestDraft?.suspect?.phoneNumber);
    }
  }, [arrestId]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onPressDiscard = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const getPersonalDetailsData = () => {
    return {
      arrestId,
      suspect: {
        district,
        city: cityMunicipality,
        neighborhood,
        street,
        palaceNumber: privateHousePalaceNumber,
        staircaseNumber,
        phoneNumber: telephoneNumber
      }
    };
  };

  const onPressNext = async (navigationScreen?: string) => {
    const data = getPersonalDetailsData();

    if (!data) return null;
    const options = {
      method: apiMethods.put,
      endpoint: endPoints.editArrest,
      data
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200)
        if (navigationScreen?.length > 0) navigateTo(routes.HOME_TABS);
        else if (isEditAndSubmit) goBack();
        else navigateTo(routes.ADDITIONAL_INFO, {arrestId});
      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_fetch_data'), {type: 'error'});
    }
  };

  const primaryButtonAction = () => {
    setShowClosePopup(false);
    onPressNext(routes.HOME_TABS);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          textStyle={styles.buttonText}
          style={styles.nextButton}
          onPress={onPressNext}
          title={isEditAndSubmit ? t('save') : t('save_next')}
        />
      </View>
    );
  };

  const mandatory = <CustomText style={themeStyle.red}>*</CustomText>;

  const renderTitle = (title: string, isMandatory?: boolean) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.inputTitle]}>
        {title} {isMandatory && mandatory}
      </CustomText>
    );
  };

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderTitle(t('district'))}
        <CustomTextInput
          value={district}
          onChangeText={setDistrict}
          placeholder={t('district_placeholder')}
        />
        {renderTitle(t('city_municipality'))}
        <CustomTextInput
          value={cityMunicipality}
          onChangeText={setCityMunicipality}
          placeholder={t('city_municipality_placeholder')}
        />
        {renderTitle(t('neighborhood'))}
        <CustomTextInput
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder={t('neighborhood_placeholder')}
        />
        {renderTitle(t('street'))}
        <CustomTextInput
          value={street}
          onChangeText={setStreet}
          placeholder={t('street_placeholder')}
        />
        {renderTitle(t('private_house_palace_number'))}
        <CustomTextInput
          value={privateHousePalaceNumber}
          onChangeText={setPrivateHousePalaceNumber}
          placeholder={t('private_house_palace_number_placeholder')}
        />
        {renderTitle(t('staircase_number'))}
        <CustomTextInput
          value={staircaseNumber}
          onChangeText={setStaircaseNumber}
          placeholder={t('staircase_number_placeholder')}
        />
        {renderTitle(t('telephone_number'))}
        <CustomPhoneInput
          value={telephoneNumber}
          onChangePhoneNumber={setTelephoneNumber}
          placeholder={t('telephone_number_placeholder')}
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
            primaryButtonTitle: t('save'),
            secondaryButtonTitle: t('discard'),
            secondaryButtonAction: onPressDiscard,
            primaryButtonAction: primaryButtonAction
          }}
          icon={<CircleWarning />}
          visible={showClosePopup}
          setVisible={setShowClosePopup}
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
        mainTitle={t('residential_details')}
      />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={3} />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderPopups()}
      {renderFooter()}
      {loading && <CustomLoader />}
    </View>
  );
}

export default ResidentialDetails;
