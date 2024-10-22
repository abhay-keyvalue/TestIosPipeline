import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {
  convictedList,
  fontWeights,
  documentList,
  maritalStatusList,
  mediaTypes
} from '@constants/general';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import useUploadMedia from '@utils/useUploadMedia';
import CustomLoader from '@components/customLoader';
import CustomCamera from '@components/customCamera';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import Progress from '@components/progress';
import CustomSelector from '@components/customSelector';
import CustomRadioSelector from '@components/customRadioSelector';
import Search from '@assets/svg/search.svg';
import styles from './styles';

type PersonalDetailsProps = {
  route: {
    params: {
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
  const dispatch = useDispatch();

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
  const [convictedData, setConvictedData] = useState(null);
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
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (arrestDraft) {
      const maritalStatusData = maritalStatusList.find(
        (item) => item.value === arrestDraft?.maritalStatus?.toUpperCase()
      );

      const documentTypeData = documentList.find(
        (item) => item.value === arrestDraft?.proofDocument?.documentType
      );

      setPlaceOfBirth(arrestDraft?.placeOfBirth);
      setFatherName(arrestDraft?.fatherName);
      setNationality(arrestDraft?.nationality);
      setCitizenship(arrestDraft?.citizenship);
      setEducation(arrestDraft?.education);
      setProfession(arrestDraft?.profession);
      setMaritalStatus(maritalStatusData);
      setDocumentType(documentTypeData);
      setImageUrl(arrestDraft?.avatar);
      setDocumentNumber(arrestDraft?.proofDocument?.documentNumber);
      setConvictedData(arrestDraft?.isConvicted ? convictedList[0] : convictedList[1]);
    }
  }, [arrestDraft]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const getPersonalDetailsData = async () => {
    return {
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

  const onPressNext = async () => {
    const data = await getPersonalDetailsData();

    dispatch(setArrestDraft(data));
    if (isEditAndSubmit) goBack();
    else navigateTo(routes.RESIDENTIAL_DETAILS);
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
        {renderTitle(t('photo_of_suspect'))}
        <CustomCamera
          type={'suspect_image'}
          uri={imageUrl}
          uploading={imageUploading}
          onResponse={onGetImage}
        />
        {renderTitle(t('place_of_birth'))}
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

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader showBackButton mainTitle={t('personal_details')} showLanguageSelector />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={2} />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderFooter()}
      {imageUploading && <CustomLoader />}
    </View>
  );
}

export default PersonalDetails;
