import React, {useEffect, useState} from 'react';
import {View, BackHandler, ScrollView, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {showToast} from '@components/customToast';

import {apiMethods, endPoints} from 'shared';
import {defenceAssignmentList, fontWeights, mediaTypes} from '@constants/general';
import useUploadMedia from '@utils/useUploadMedia';
import useApi from '@api/useApi';
import FilePicker from '@components/filePicker';
import CustomLoader from '@components/customLoader';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomTextInput from '@components/customTextInput';
import CustomButton from '@components/customButton';
import CustomDetaineeDeclaration from '@components/customDetaineeDeclaration';
import CustomCamera from '@components/customCamera';
import Progress from '@components/progress';
import CircleWarning from '@assets/svg/circleWarning.svg';
import CustomPopup from '@components/customPopup';
import Close from '@assets/svg/close.svg';
import styles from './styles';

type AdditionalInfoProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

function AdditionalInfo(props: AdditionalInfoProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const {callApi, loading} = useApi();
  const {uploadMedia, loading: imageUploading} = useUploadMedia();
  const routeParams = props?.route?.params;

  const [showClosePopup, setShowClosePopup] = useState(false);
  const [detaineeDeclarationData, setDetaineeDeclarationData] = useState(null);
  const [arrestId, setArrestId] = useState(routeParams?.arrestId);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(routeParams?.isEditAndSubmit);
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [arrestDocuments, setArrestDocuments] = useState([]);
  const [defenceLawyerName, setDefenceLawyerName] = useState('');
  const [defenceLawyerContact, setDefenceLawyerContact] = useState('');

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
      const {detaineeDeclaration, additionalInfo, defenseDetails} = arrestDraft;
      const updatedDetaineeDeclaration = defenceAssignmentList.find(
        (item) => item.value === detaineeDeclaration
      );

      setDetaineeDeclarationData(updatedDetaineeDeclaration);
      setAdditionalInformation(additionalInfo);
      setDefenceLawyerName(defenseDetails?.name);
      setDefenceLawyerContact(defenseDetails?.phoneNumber);
    }
  }, [arrestId]);

  const getPersonalDetailsData = async () => {
    const defenceLawyer =
      detaineeDeclarationData?.value === 'SUSPECT_GIVEN'
        ? {defenceLawyerName, defenceLawyerContact}
        : null;

    return {
      arrestId,
      arrestData: {
        defenceAssignment: detaineeDeclarationData?.value,
        defenceLawyer,
        additionalInfo: additionalInformation,
        arrestDocuments
      }
    };
  };

  const onPressNext = async (navigationScreen?: string) => {
    const data = await getPersonalDetailsData();
    const {defenceAssignment, arrestDocuments} = data?.arrestData || {};

    const isMandatoryFieldsFilled = defenceAssignment?.length > 0 && arrestDocuments.length > 0;

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
        else navigateTo(routes.REVIEW_ARREST_DETAILS, {arrestId});

      if (response?.error?.errors) showToast(response?.error?.errors[0], {type: 'error'});
    } catch (error) {
      showToast(t('failed_to_save_data'), {type: 'error'});
    }
  };

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const onPressDiscard = () => {
    navigateTo(routes.HOME_TABS);
    setShowClosePopup(false);
  };

  const onCameraResponse = async (photo) => {
    setAdditionalPhotos([photo, ...additionalPhotos]);
    const mediaData = await uploadMedia({
      mediaName: `suspect_photo`,
      mediaUrl: photo,
      mediaType: 'USER_AVTAR'
    });

    setArrestDocuments([
      {
        mediaName: `suspect_photo`,
        mediaKey: mediaData.key,
        mediaType: mediaTypes.ADDITIONAL_EVIDENCE_FILES
      },
      ...arrestDocuments
    ]);
  };

  const removeItem = (index) => {
    const updatedPhotos = additionalPhotos.filter((_, i) => i !== index);
    const updatedDocuments = arrestDocuments.filter((_, i) => i !== index);

    setAdditionalPhotos(updatedPhotos);
    setArrestDocuments(updatedDocuments);
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

  const renderPhotos = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoContainer}>
        {additionalPhotos.map((photo, index) => (
          <TouchableOpacity onPress={() => removeItem(index)} key={photo} style={styles.photo}>
            <View style={styles.removeIcon}>
              <Close width={25} height={25} />
            </View>
            <Image source={{uri: photo}} style={styles.photoImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderTitle(t('detainee_declaration'), true)}
        <CustomDetaineeDeclaration
          setDefenceLawyerName={setDefenceLawyerName}
          setDefenceLawyerContact={setDefenceLawyerContact}
          defenceLawyerName={defenceLawyerName}
          defenceLawyerContact={defenceLawyerContact}
          item={detaineeDeclarationData}
          onSelectItem={setDetaineeDeclarationData}
          list={defenceAssignmentList}
        />
        {renderTitle(t('additional_information'))}
        <CustomTextInput
          placeholder={t('enter_additional_information')}
          multiline
          value={additionalInformation}
          onChangeText={setAdditionalInformation}
          containerStyle={styles.additionalInfo}
        />
        {renderTitle(t('additional_photos'), true)}
        <View style={styles.row}>
          <View style={styles.half}>
            <CustomCamera
              onResponse={onCameraResponse}
              uploading={imageUploading}
              cameraButtonStyle={styles.cameraContainer}
            />
          </View>
          <View style={styles.half}>
            <FilePicker />
          </View>
        </View>
        {renderPhotos()}
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
        mainTitle={t('additional_info')}
      />
      {!isEditAndSubmit && <Progress style={styles.progress} totalStep={4} step={4} />}
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

export default AdditionalInfo;
