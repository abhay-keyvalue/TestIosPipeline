import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {apiMethods, endPoints} from 'shared';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import {routes} from '@constants/labels';
import {fontWeights, genderList, mediaTypes} from '@constants/general';
import {getCurrentLocation} from '@utils/common';
import {showToast} from '@components/customToast';
import CustomLoader from '@components/customLoader';
import useUploadMedia from '@utils/useUploadMedia';
import useApi from '@api/useApi';
import CriminalCodeSelector from '@components/criminalCodeSelector';
import CustomSelector from '@components/customSelector';
import CustomCamera from '@components/customCamera';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomDatePicker from '@components/datePicker';
import CustomPopup from '@components/customPopup';
import Progress from '@components/progress';
import CircleTick from '@assets/svg/circleTick.svg';
import CircleWarning from '@assets/svg/circleWarning.svg';
import Clock from '@assets/svg/clock.svg';
import Map from '@assets/svg/map.svg';
import styles from './styles';

const documentName = 'idCard.jpg';

type MandatoryInformationProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

type SubmitDatType = {
  arrestId?: string;
  suspect?: {
    name?: string;
    gender?: string;
    dob?: string;
  };
  proofDocument?: {
    documentKey?: string;
    documentName?: string;
  };
  arrestData?: {
    offenceDetails?: string;
    offenceIds?: string[];
    locationName?: string;
    circumstance?: string;
  };
};

function MandatoryInformation(props: MandatoryInformationProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const {callApi, loading} = useApi();
  const {uploadMedia, loading: imageUploading} = useUploadMedia();
  const dispatch = useDispatch();
  const getArrestApi = useApi();

  const routeParams = props?.route?.params;

  const [name, setName] = useState('');
  const [dob, setDob] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [gender, setGender] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [idProofUrl, setIdProofUrl] = useState(null);
  const [offenceDetails, setOffenceDetails] = useState('');
  const [circumstance, setCircumstance] = useState('');
  const [selectedCriminalCodeList, setSelectedCriminalCodeList] = useState([]);
  const [mediaData, setMediaData] = useState(null);
  const [arrestId, setArrestId] = useState(routeParams?.arrestId);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(routeParams?.isEditAndSubmit);

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

        setLocationName(location);
      })();

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (routeParams?.arrestId?.length > 0) setArrestId(routeParams?.arrestId);
    if (routeParams?.isEditAndSubmit) setIsEditAndSubmit(routeParams?.isEditAndSubmit);
  }, [routeParams]);

  useEffect(() => {
    if (arrestId?.length > 0) getArrestDetails();
  }, [arrestId]);

  useEffect(() => {
    if (arrestDraft?.caseNumber) {
      const {suspect} = arrestDraft || {};
      const genderData = genderList.find((item) => item.value === suspect?.gender);

      if (arrestDraft?.locationName)
        (async () => {
          const location = await getCurrentLocation();

          setLocationName(location);
        })();
      else setLocationName(arrestDraft?.locationName);

      setName(suspect?.name);
      if (suspect?.dob?.length > 0) setDob(new Date(suspect?.dob));
      setGender(genderData);
      setCircumstance(arrestDraft?.circumstance);
      setOffenceDetails(arrestDraft?.criminalOffence);
      setIdProofUrl(suspect?.proofDocument?.documentKey);
      setSelectedCriminalCodeList(arrestDraft?.offences);
    }
  }, [arrestDraft]);

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
    return (
      <CustomCamera
        type={type}
        uri={idProofUrl}
        uploading={imageUploading}
        onResponse={onGetImage}
      />
    );
  };

  const resetToHome = () => {
    navigateTo(routes.HOME_TABS);
  };

  const onPressCancel = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const mandatoryValidation =
    name?.length > 0 && offenceDetails?.length > 0 && selectedCriminalCodeList?.length > 0;

  const getDraftData = async () => {
    if (!mandatoryValidation) {
      showToast(t('fill_all_mandatory_fields'), {type: 'error'});

      return null;
    }

    const offenceIds = selectedCriminalCodeList.map((item) => item.id);

    const data: SubmitDatType = {
      suspect: {
        name,
        gender: gender?.value,
        dob: dateFormat(dob, 'yyyy-mm-dd')
      },
      arrestData: {
        offenceDetails,
        offenceIds,
        locationName,
        circumstance
      }
    };

    if (mediaData?.key)
      data.proofDocument = {
        documentKey: mediaData?.key,
        documentName
      };

    if (arrestDraft?.caseNumber?.length > 0) data.arrestId = arrestId;

    return data;
  };

  const saveDraft = async (nextScreen?: boolean) => {
    const data = await getDraftData();

    if (!data) return null;

    const isArrestUpdate = arrestDraft?.caseNumber?.length > 0;

    const options = {
      method: isArrestUpdate ? apiMethods.put : apiMethods.post,
      endpoint: isArrestUpdate ? endPoints.editArrest : endPoints.draft,
      data
    };

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200)
        if (isEditAndSubmit) goBack();
        else if (nextScreen)
          navigateTo(routes.PERSONAL_DETAILS, {arrestId: response?.data?.data?.id});
        else setShowSuccessPopup(true);

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_draft'), {type: 'error'});
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          textStyle={styles.buttonText}
          style={styles.nextButton}
          onPress={() => saveDraft(true)}
          title={isEditAndSubmit ? t('save') : t('next')}
        />
        {!isEditAndSubmit && (
          <CustomButton
            textStyle={[styles.timeLocationText, themeStyle.primary]}
            style={styles.draftButton}
            onPress={() => saveDraft(false)}
            title={t('save_draft')}
          />
        )}
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
              {dateFormat(new Date(), 'hh:MM, dd/mm/yy')}
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

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderTitle(t('id_proof_user_details'))}
        {takePictureButton('id_proof_user_details')}
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
        {renderTitle(t('article_of_criminal_code'), true)}
        <CriminalCodeSelector
          selectedList={selectedCriminalCodeList}
          onSelectItems={setSelectedCriminalCodeList}
        />
        {renderTitle(t('circumstances'))}
        <CustomTextInput
          placeholder={t('enter_circumstances')}
          multiline
          containerStyle={styles.circumstances}
          value={circumstance}
          onChangeText={setCircumstance}
        />
      </View>
    );
  };

  const renderPopups = () => {
    return (
      <>
        <CustomPopup
          title={t('arrest_logged_in')}
          description={t('you_have_10_hours')}
          buttonProps={{primaryButtonTitle: t('ok'), primaryButtonAction: resetToHome}}
          icon={<CircleTick />}
          visible={showSuccessPopup}
          setVisible={setShowSuccessPopup}
        />
        <CustomPopup
          title={t('save_your_progress')}
          description={t('you_havent_completed')}
          buttonProps={{
            primaryButtonTitle: t('discard'),
            secondaryButtonTitle: t('close'),
            secondaryButtonAction: () => setShowClosePopup(false),
            primaryButtonAction: onPressCancel
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
        mainTitle={t('mandatory_information')}
      />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={1} />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {renderTimeLocationInfo()}
        {renderForm()}
      </KeyboardAwareScrollView>
      {renderFooter()}
      {renderPopups()}
      {loading && <CustomLoader />}
    </View>
  );
}

export default MandatoryInformation;
