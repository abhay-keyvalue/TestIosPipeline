import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {showToast} from '@components/customToast';
import {
  convictedList,
  fontWeights,
  documentList,
  maritalStatusList,
  mediaTypes
} from '@constants/general';
import {apiMethods, endPoints} from 'shared';
import useUploadMedia from '@utils/useUploadMedia';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import CustomCamera from '@components/customCamera';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import Progress from '@components/progress';
import CustomSelector from '@components/customSelector';
import CustomRadioSelector from '@components/customRadioSelector';
import CircleWarning from '@assets/svg/circleWarning.svg';
import CustomPopup from '@components/customPopup';
import Search from '@assets/svg/search.svg';
import styles from './styles';

type PersonalDetailsProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

const documentName = 'suspectImage.jpg';

function PersonalDetails(props: PersonalDetailsProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const {uploadMedia, loading: imageUploading} = useUploadMedia();
  const getArrestApi = useApi();
  const {callApi, loading} = useApi();

  const routeParams = props?.route?.params;

  const [imageUrl, setImageUrl] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [nationality, setNationality] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [convictedData, setConvictedData] = useState(null);
  const [arrestId, setArrestId] = useState(routeParams?.arrestId);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(routeParams?.isEditAndSubmit);
  const [mediaData, setMediaData] = useState(null);

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
    if (routeParams?.arrestId?.length > 0) setArrestId(routeParams?.arrestId);
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (arrestId) {
      const {suspect} = arrestDraft || {};

      const maritalStatusData = maritalStatusList.find(
        (item) => item.value === suspect?.maritalStatus?.toUpperCase()
      );

      const documentTypeData = documentList.find(
        (item) => item.value === suspect?.proofDocument?.documentType
      );

      setPlaceOfBirth(suspect?.placeOfBirth);
      setFatherName(suspect?.fatherName);
      setNationality(suspect?.nationality);
      setCitizenship(suspect?.citizenship);
      setEducation(suspect?.education);
      setProfession(suspect?.profession);
      setMaritalStatus(maritalStatusData);
      setDocumentType(documentTypeData);
      setImageUrl(suspect?.avatar);
      setDocumentNumber(suspect?.proofDocument?.documentNumber);
      setConvictedData(suspect?.isConvicted ? convictedList[0] : convictedList[1]);
    }
  }, [arrestDraft]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onPressDiscard = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const getPersonalDetailsData = async () => {
    return {
      arrestId,
      suspect: {
        fatherName,
        nationality,
        citizenship,
        education,
        placeOfBirth,
        maritalStatus: maritalStatus?.value,
        profession,
        isConvicted: convictedData?.value,
        documentNumber,
        documentType: documentType?.value,
        avatar: mediaData?.key
      }
    };
  };

  const onPressNext = async (navigationScreen?: string) => {
    const data = await getPersonalDetailsData();

    const isMandatoryFieldsFilled =
      (mediaData?.key?.length > 0 || imageUrl?.length > 0) && placeOfBirth?.length > 0;

    if (!data || !isMandatoryFieldsFilled) {
      showToast(t('fill_mandatory_fields'), {type: 'error'});

      return null;
    }

    const options = {
      method: apiMethods.put,
      endpoint: endPoints.editArrest,
      data
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200)
        if (navigationScreen?.length > 0) navigateTo(navigationScreen);
        else if (isEditAndSubmit) goBack();
        else navigateTo(routes.RESIDENTIAL_DETAILS, {arrestId});

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const onGetImage = async (image) => {
    setImageUrl(image);
    const mediaData = await uploadMedia({
      mediaName: documentName,
      mediaUrl: image,
      mediaType: mediaTypes.PROOF_DOCUMENT
    });

    setMediaData(mediaData);
  };

  const primaryButtonAction = () => {
    setShowClosePopup(false);
    onPressNext(routes.HOME_TABS);
  };

  const onSelectedConvicted = (item) => {
    setConvictedData(item);
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
        {renderTitle(t('photo_of_suspect'), true)}
        <CustomCamera
          type={'suspect_image'}
          uri={imageUrl}
          uploading={imageUploading}
          onResponse={onGetImage}
        />
        {renderTitle(t('place_of_birth'), true)}
        <CustomTextInput
          icon={<Search />}
          value={placeOfBirth}
          onChangeText={setPlaceOfBirth}
          placeholder={t('Search_place_birth')}
        />
        {renderTitle(t('father_name'))}
        <CustomTextInput
          value={fatherName}
          onChangeText={setFatherName}
          placeholder={t('enter_father_name')}
        />
        {renderTitle(t('nationality'))}
        <CustomTextInput
          icon={<Search />}
          value={nationality}
          onChangeText={setNationality}
          placeholder={t('search_nationality')}
        />
        {renderTitle(t('citizenship'))}
        <CustomTextInput
          value={citizenship}
          onChangeText={setCitizenship}
          placeholder={t('enter_citizenship')}
        />
        {renderTitle(t('education'))}
        <CustomTextInput
          value={education}
          onChangeText={setEducation}
          placeholder={t('enter_education')}
        />
        {renderTitle(t('profession'))}
        <CustomTextInput
          value={profession}
          onChangeText={setProfession}
          placeholder={t('enter_profession')}
        />
        {renderTitle(t('marital_status'))}
        <CustomSelector
          title={t('marital_status')}
          placeHolder={t('select_option')}
          list={maritalStatusList}
          item={maritalStatus}
          onSelectItem={(item) => setMaritalStatus(item)}
        />
        {renderTitle(t('convicted'))}
        <CustomRadioSelector
          onSelectItem={onSelectedConvicted}
          list={convictedList}
          item={convictedData}
          wrap
        />
        {renderTitle(t('identification_document_type'))}
        <CustomSelector
          title={t('identification_document_type')}
          placeHolder={t('select_id')}
          list={documentList}
          item={documentType}
          onSelectItem={(item) => setDocumentType(item)}
        />
        {renderTitle(t('identification_document_number'))}
        <CustomTextInput
          value={documentNumber}
          onChangeText={setDocumentNumber}
          placeholder={t('enter_identification_document_number')}
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
        mainTitle={t('personal_details')}
      />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={2} />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderPopups()}
      {renderFooter()}
      {(loading || getArrestApi?.loading) && <CustomLoader />}
    </View>
  );
}

export default PersonalDetails;
