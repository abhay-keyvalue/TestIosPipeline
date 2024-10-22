import React, {useEffect, useState} from 'react';
import {View, BackHandler, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import {routes} from '@constants/labels';
import {documentTypes, fontWeights, genderList, isIOS, mediaTypes} from '@constants/general';
import {getCurrentLocation} from '@utils/common';
import {showToast} from '@components/customToast';
import useUploadMedia from '@utils/useUploadMedia';
// import CriminalCodeSelector from '@components/criminalCodeSelector';
import CustomSelector from '@components/customSelector';
import VoiceRecorder from '@components/voiceRecorder';
import VoicePlayer from '@components/voicePlayer';
import CustomCamera from '@components/customCamera';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomDatePicker from '@components/datePicker';
import Progress from '@components/progress';
import Clock from '@assets/svg/clock.svg';
import Map from '@assets/svg/map.svg';
import Check from '@assets/svg/check.svg';
import Uncheck from '@assets/svg/uncheck.svg';
import styles from './styles';

const documentName = 'idCard.jpg';
const recordingName = isIOS ? 'recording.m4a' : 'recording.mp3';

type MandatoryInformationProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

type SubmitDataType = {
  name?: string;
  gender?: string;
  dob?: string;
  isIdRefused?: boolean;
  proofDocument?: {
    documentLocalUrl?: string;
    documentType?: string;
    documentKey?: string;
    documentName?: string;
  };
  criminalOffence?: string;
  offences?: Array<{
    id?: string;
    article?: string;
    description?: string;
  }>;
  locationName?: string;
  circumstance?: string;
  locationData?: {
    locRoad?: string;
    locSuburb?: string;
    locCity?: string;
    locCounty?: string;
    locStateDistrict?: string;
    locState?: string;
    locPostcode?: string;
  };
  circumstanceRecording?: {
    mediaType?: string;
    mediaKey?: string;
    mediaName?: string;
    mediaLocalUrl?: string;
  }[];
};

function MandatoryInformation(props: MandatoryInformationProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {collectMinimumDetails} = useSelector((state: RootState) => state.feature);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {uploadMedia, loading: imageUploading} = useUploadMedia();
  const recodingUpload = useUploadMedia();

  const totalSteps = collectMinimumDetails ? 2 : 4;
  const currentStep = 1;
  const routeParams = props?.route?.params;

  const [name, setName] = useState('');
  const [dob, setDob] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [gender, setGender] = useState(null);
  const [idProofUrl, setIdProofUrl] = useState(null);
  const [offenceDetails, setOffenceDetails] = useState('');
  const [circumstance, setCircumstance] = useState('');
  const [isIdRefused, setIsIdRefused] = useState(false);
  // const [selectedCriminalCodeList, setSelectedCriminalCodeList] = useState([]);
  const [mediaData, setMediaData] = useState(null);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(routeParams?.isEditAndSubmit);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingData, setRecordingData] = useState(null);

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    line: {
      backgroundColor: colors?.BORDER_COLOR
    },
    lineColor: {
      color: `${colors?.PRIMARY_TEXT}99`
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    },
    red: {
      color: colors?.RED
    },
    activeBackground: {
      backgroundColor: `${colors?.PRIMARY_COLOR}1A`
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    !routeParams?.isEditAndSubmit &&
      (async () => {
        const location = await getCurrentLocation();

        setLocationName(location?.locationName);
        setLocationData(location?.locationData);
      })();

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    const genderData = genderList.find((item) => item.value === arrestDraft?.gender);

    if (arrestDraft?.locationName)
      (async () => {
        const location = await getCurrentLocation();

        setLocationName(location?.locationName);
      })();
    else setLocationName(arrestDraft?.locationName);

    setName(arrestDraft?.name);
    if (arrestDraft?.dob?.length > 0) setDob(new Date(arrestDraft?.dob));
    setGender(genderData);
    setCircumstance(arrestDraft?.circumstance);
    setOffenceDetails(arrestDraft?.criminalOffence);
    setIdProofUrl(arrestDraft?.proofDocument?.documentLocalUrl);
    setIsIdRefused(arrestDraft?.isIdRefused);
    // setSelectedCriminalCodeList(arrestDraft?.offences);
    setRecordingUrl(arrestDraft?.circumstanceRecording?.mediaLocalUrl);
    setRecordingData(arrestDraft?.circumstanceRecording);
  }, [arrestDraft]);

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onGetImage = async (response: string) => {
    setIdProofUrl(response);
    const media = await uploadMedia({
      mediaName: documentName,
      mediaUrl: response,
      mediaType: mediaTypes.PROOF_DOCUMENT
    });

    setMediaData(media);
  };

  const takePictureButton = (type: string) => {
    if (isIdRefused) return <CustomText>{'_'}</CustomText>;

    return (
      <CustomCamera
        type={type}
        uri={idProofUrl}
        uploading={imageUploading}
        disabled={isIdRefused}
        onResponse={onGetImage}
        renderPreview={renderPreview}
      />
    );
  };

  const renderPreview = (setVisible: (show: boolean) => void) => {
    return (
      <View style={[styles.previewContainer, themeStyle.line]}>
        <CustomText style={[styles.documentName, themeStyle.text]}>{documentName}</CustomText>
        {idProofUrl?.length > 0 && <Image source={{uri: idProofUrl}} style={styles.previewImage} />}
        <TouchableOpacity style={styles.reTakeButton} onPress={() => setVisible(true)}>
          <CustomText style={themeStyle.primary}>{t('retake')}</CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const mandatoryValidation = name?.length > 0 && offenceDetails?.length > 0;

  const getDraftData = async () => {
    if (!mandatoryValidation) {
      showToast(t('fill_all_mandatory_fields'), {type: 'error'});

      return null;
    }

    const data: SubmitDataType = {
      name,
      gender: gender?.value,
      criminalOffence: offenceDetails,
      // offences: selectedCriminalCodeList,
      isIdRefused,
      locationName,
      circumstance,
      circumstanceRecording: recordingData,
      locationData
    };

    if (dob != null) data.dob = dateFormat(dob, 'yyyy-mm-dd');

    if (mediaData?.key)
      data.proofDocument = {
        documentLocalUrl: idProofUrl,
        documentType: documentTypes.NATIONAL_ID,
        documentKey: mediaData?.key,
        documentName
      };

    return data;
  };

  const onPressNext = async () => {
    const data = await getDraftData();

    if (!data) return null;

    dispatch(setArrestDraft(data));

    navigateTo(collectMinimumDetails ? routes.ADDITIONAL_INFO : routes.PERSONAL_DETAILS);
  };

  const onRecordingEnd = async (url: string) => {
    await uploadAudioRecording(url);
    setRecordingUrl(url);
  };

  const onPressClosePLayer = () => {
    setRecordingUrl(null);
    setRecordingData(null);
  };

  const uploadAudioRecording = async (url: string) => {
    const data = await recodingUpload.uploadMedia({
      mediaName: recordingName,
      mediaUrl: url,
      mediaType: mediaTypes.CIRCUMSTANCE_RECORDING
    });

    setRecordingData({
      mediaType: mediaTypes.CIRCUMSTANCE_RECORDING,
      mediaKey: data?.key,
      mediaName: recordingName,
      mediaLocalUrl: url
    });
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          disabled={recodingUpload?.loading || imageUploading} // Disabled while uploading recording and image uploading
          textStyle={styles.buttonText}
          style={styles.nextButton}
          onPress={() => onPressNext()}
          loading={recodingUpload?.loading || imageUploading}
          title={isEditAndSubmit ? t('save') : t('next')}
        />
      </View>
    );
  };

  const mandatory = <CustomText style={themeStyle.red}>*</CustomText>;

  const renderTimeLocationInfo = () => {
    return (
      <View style={[styles.timeLocationContainer, themeStyle.activeBackground]}>
        <View style={styles.timeLocationRow}>
          <Clock />
          <CustomText fontWeight={fontWeights.MEDIUM} style={styles.timeLocationText}>
            {`${t('time_of_arrest')}:  `}
            <CustomText style={themeStyle.lineColor}>
              {dateFormat(new Date(), 'dd/mm/yy')}
            </CustomText>
          </CustomText>
        </View>
        <View style={styles.timeLocationRow}>
          <Map />
          <CustomText
            numberOfLines={1}
            fontWeight={fontWeights.MEDIUM}
            style={styles.timeLocationText}
          >
            {`${t('location_of_arrest')}:  `}
            <CustomText style={themeStyle.lineColor}>{locationName || '_'}</CustomText>
          </CustomText>
        </View>
      </View>
    );
  };

  const renderTitle = (title: string, isMandatory?: boolean) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.inputTitle]}>
        {title} {isMandatory && mandatory}
      </CustomText>
    );
  };

  const renderIdRefusedCheckbox = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={idProofUrl?.length > 0}
        onPress={() => setIsIdRefused(!isIdRefused)}
        style={[styles.idRefusedRow, idProofUrl?.length > 0 && styles.disabled]}
      >
        <View style={styles.checkbox}>
          {isIdRefused ? <Check width={15} height={15} /> : <Uncheck width={15} height={15} />}
        </View>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.inputTitle]}>
          {t('refused_to_provide_id')}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderTitle(t('id_proof_user_details'))}
        {takePictureButton('id_proof_user_details')}
        {renderIdRefusedCheckbox()}
        {renderTitle(t('name'), true)}
        <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder={t('enter_the_suspect_name')}
        />
        <View style={styles.row}>
          <View style={styles.half}>
            {renderTitle(t('date_of_birth'))}
            <CustomDatePicker date={dob} onSelectDate={(date) => setDob(date)} />
          </View>
          <View style={styles.half}>
            {renderTitle(t('gender'))}
            <CustomSelector
              title={t('gender')}
              placeHolder={t('select_gender')}
              item={gender}
              list={genderList}
              onSelectItem={(item) => setGender(item)}
            />
          </View>
        </View>
        {renderTitle(t('criminal_offence'), true)}
        <CustomTextInput
          value={offenceDetails}
          onChangeText={setOffenceDetails}
          placeholder={t('enter_criminal_offense')}
        />
        {renderTitle(t('circumstances'))}
        <VoicePlayer
          loading={recodingUpload?.loading}
          audioUrl={recordingUrl}
          style={styles.voicePlayer}
          onPressClose={onPressClosePLayer}
        />
        <View style={styles.row}>
          <CustomTextInput
            placeholder={t('enter_circumstances')}
            multiline
            containerStyle={styles.circumstances}
            value={circumstance}
            onChangeText={setCircumstance}
          />
          {!recordingUrl && (
            <VoiceRecorder customStyle={styles.voiceRecorder} onRecordingEnd={onRecordingEnd} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader
        showBackButton
        mainTitle={collectMinimumDetails ? t('arrest_information') : t('mandatory_information')}
        showLanguageSelector
      />
      {!isEditAndSubmit && (
        <Progress style={styles.progress} totalStep={totalSteps} step={currentStep} />
      )}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderTimeLocationInfo()}
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderFooter()}
    </View>
  );
}

export default MandatoryInformation;
