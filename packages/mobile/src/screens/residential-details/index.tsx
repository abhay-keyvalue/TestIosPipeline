import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {fontWeights} from '@constants/general';
import {routes} from '@constants/labels';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import CustomPhoneInput from '@components/customPhoneInput';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import Progress from '@components/progress';
import styles from './styles';

type ResidentialDetailsProps = {
  route: {
    params: {
      isEditAndSubmit?: boolean;
    };
  };
};

function ResidentialDetails(props: ResidentialDetailsProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const routeParams = props?.route?.params;

  const [district, setDistrict] = useState('');
  const [cityMunicipality, setCityMunicipality] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [privateHousePalaceNumber, setPrivateHousePalaceNumber] = useState('');
  const [staircaseNumber, setStaircaseNumber] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
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
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    if (arrestDraft) {
      setDistrict(arrestDraft?.district);
      setCityMunicipality(arrestDraft?.city);
      setNeighborhood(arrestDraft?.neighborhood);
      setStreet(arrestDraft?.street);
      setPrivateHousePalaceNumber(arrestDraft?.palaceNumber);
      setStaircaseNumber(arrestDraft?.staircaseNumber);
      setTelephoneNumber(arrestDraft?.phoneNumber);
    }
  }, [arrestDraft]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const getPersonalDetailsData = () => {
    return {
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

  const onPressNext = async () => {
    const data = getPersonalDetailsData();

    if (!data) return null;
    dispatch(setArrestDraft(data));

    if (isEditAndSubmit) goBack();
    else navigateTo(routes.ADDITIONAL_INFO);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          textStyle={styles.buttonText}
          style={styles.nextButton}
          onPress={onPressNext}
          title={isEditAndSubmit ? t('save') : t('next')}
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

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader showBackButton mainTitle={t('residential_details')} showLanguageSelector />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={3} />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderFooter()}
    </View>
  );
}

export default ResidentialDetails;
