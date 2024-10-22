import React, {useEffect, useState} from 'react';
import {View, BackHandler, ScrollView, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import {showToast} from '@components/customToast';

import {defenceAssignmentList, fontWeights, mediaTypes} from '@constants/general';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import {isValidEmail, isValidPhoneNumber} from '@utils/common';
import useUploadMedia from '@utils/useUploadMedia';
import FilePicker from '@components/filePicker';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import CustomButton from '@components/customButton';
import CustomDetaineeDeclaration from '@components/customDetaineeDeclaration';
import CustomCamera from '@components/customCamera';
import Progress from '@components/progress';
import Camera from '@assets/svg/camera.svg';
import DeleteIcon from '@assets/svg/delete.svg';
import styles from './styles';

type AdditionalInfoProps = {
  route: {
    params: {
      arrestId?: string;
      isEditAndSubmit?: boolean;
    };
  };
};

const additionalDocFileName = 'additionalPhoto.jpg';
const userImageFileName = 'suspectImage.jpg';

function AdditionalInfo(props: AdditionalInfoProps): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {collectMinimumDetails} = useSelector((state: RootState) => state.feature);
  const {arrestDraft} = useSelector((state: RootState) => state.arrestDraft);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {uploadMedia, loading: imageUploading} = useUploadMedia();
  const routeParams = props?.route?.params;
  const totalSteps = collectMinimumDetails ? 2 : 4;
  const currentStep = collectMinimumDetails ? 2 : 4;

  const [detaineeDeclarationData, setDetaineeDeclarationData] = useState(null);
  const [isEditAndSubmit, setIsEditAndSubmit] = useState(routeParams?.isEditAndSubmit);
  const [arrestDocuments, setArrestDocuments] = useState([]);
  const [defenseLawyerName, setDefenseLawyerName] = useState('');
  const [defenseLawyerContact, setDefenseLawyerContact] = useState('');
  const [defenseLawyerEmail, setDefenseLawyerEmail] = useState('');
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
    },
    card: {
      backgroundColor: colors?.CARD_BACKGROUND
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
    const {defenceAssignment, defenceLawyer} = arrestDraft;
    const updatedDetaineeDeclaration = defenceAssignmentList.find(
      (item) => item.value === defenceAssignment
    );

    setDetaineeDeclarationData(updatedDetaineeDeclaration);
    setDefenseLawyerName(defenceLawyer?.name);
    setDefenseLawyerContact(defenceLawyer?.phoneNumber);
    setDefenseLawyerEmail(defenceLawyer?.email);
    setArrestDocuments(arrestDraft?.documents || []);
    setMediaData(arrestDraft?.userImage);
  }, [arrestDraft]);

  const getPersonalDetailsData = async () => {
    const defenceLawyer =
      detaineeDeclarationData?.value === 'SUSPECT_GIVEN'
        ? {
          name: defenseLawyerName?.trim(),
          phoneNumber: defenseLawyerContact,
          email: defenseLawyerEmail?.length > 0 ? defenseLawyerEmail?.trim() : null
        }
        : null;

    return {
      defenceAssignment: detaineeDeclarationData?.value,
      defenceLawyer,
      documents: arrestDocuments,
      userImage: mediaData
    };
  };

  const saveArrestData = async () => {
    const data = await getPersonalDetailsData();
    const defenceLawyerContact = data?.defenceLawyer?.phoneNumber;

    if (defenceLawyerContact?.length > 0 && !isValidPhoneNumber(defenceLawyerContact)) {
      showToast(t('invalid_phone_number'), {type: 'error'});

      return;
    }

    if (defenseLawyerEmail?.length > 0 && !isValidEmail(defenseLawyerEmail?.trim())) {
      showToast(t('invalid_email'), {type: 'error'});

      return;
    }

    const isMandatoryFieldsFilled =
      detaineeDeclarationData?.value?.length > 0 && arrestDocuments?.length > 0;

    if (!data || !isMandatoryFieldsFilled) {
      showToast(t('fill_mandatory_fields'), {type: 'error'});

      return null;
    }

    dispatch(setArrestDraft(data));
  };

  const onPressNext = async () => {
    await saveArrestData();
    if (isEditAndSubmit) goBack();
    else navigateTo(routes.REVIEW_ARREST_DETAILS);
  };

  const handleBackButton = () => {
    goBack();

    return true;
  };

  const backButtonPress = async () => {
    const data = await getPersonalDetailsData();

    dispatch(setArrestDraft(data));

    handleBackButton();
  };

  const onGetImage = async (image) => {
    const mediaData = await uploadMedia({
      mediaName: userImageFileName,
      mediaUrl: image,
      mediaType: mediaTypes.USER_AVTAR
    });

    setMediaData({
      mediaLocalUrl: image,
      mediaType: mediaTypes.USER_AVTAR,
      mediaKey: mediaData.key,
      mediaName: userImageFileName
    });
  };

  const onCameraResponse = async (photo) => {
    const mediaData = await uploadMedia({
      mediaName: additionalDocFileName,
      mediaUrl: photo,
      mediaType: mediaTypes.PROOF_DOCUMENT
    });

    setArrestDocuments([
      {
        mediaLocalUrl: photo,
        mediaName: additionalDocFileName,
        mediaKey: mediaData.key,
        mediaType: mediaTypes.PROOF_DOCUMENT
      },
      ...arrestDocuments
    ]);
  };

  const onFilePickerResponse = async (images) => {
    if (images?.length > 0) {
      const image = images[0]?.uri;

      const mediaData = await uploadMedia({
        mediaName: additionalDocFileName,
        mediaUrl: image,
        mediaType: mediaTypes.PROOF_DOCUMENT
      });

      setArrestDocuments([
        {
          mediaLocalUrl: image,
          mediaName: additionalDocFileName,
          mediaKey: mediaData.key,
          mediaType: mediaTypes.PROOF_DOCUMENT
        },
        ...arrestDocuments
      ]);
    }
  };

  const removeItem = (index) => {
    const updatedDocuments = arrestDocuments.filter((_, i) => i !== index);

    setArrestDocuments(updatedDocuments);
  };

  const renderSuspectImagePreview = (setVisible: (show: boolean) => void) => {
    return (
      <View style={[styles.previewContainer, themeStyle.line]}>
        <View style={styles.previewImageContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setMediaData(null)}>
            <DeleteIcon />
          </TouchableOpacity>
          {mediaData?.mediaLocalUrl?.length > 0 && (
            <Image source={{uri: mediaData?.mediaLocalUrl}} style={styles.previewImage} />
          )}
        </View>
        <TouchableOpacity style={styles.reTakeButton} onPress={() => setVisible(true)}>
          <Camera />
          <CustomText style={styles.reTakeText}>{t('retake_image')}</CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <CustomButton
          disabled={imageUploading}
          loading={imageUploading}
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

  const renderPhotos = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoContainer}>
        {arrestDocuments?.map((document, index) => (
          <View key={document?.mediaLocalUrl || document?.mediaKey} style={styles.photo}>
            <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeIcon}>
              <DeleteIcon />
            </TouchableOpacity>
            <Image source={{uri: document.mediaLocalUrl}} style={styles.photoImage} />
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderTitle(t('detainee_declaration'), true)}
        <CustomDetaineeDeclaration
          setDefenceLawyerName={setDefenseLawyerName}
          setDefenceLawyerContact={setDefenseLawyerContact}
          defenceLawyerName={defenseLawyerName}
          defenceLawyerContact={defenseLawyerContact}
          defenceLawyerEmail={defenseLawyerEmail}
          setDefenceLawyerEmail={setDefenseLawyerEmail}
          item={detaineeDeclarationData}
          onSelectItem={setDetaineeDeclarationData}
          list={defenceAssignmentList}
        />
        {renderTitle(t('photo_of_suspect'))}
        <CustomCamera
          type={'suspect_image'}
          uri={mediaData?.mediaLocalUrl}
          onResponse={onGetImage}
          renderPreview={(setVisible) => renderSuspectImagePreview(setVisible)}
          cameraButtonStyle={styles.cameraContainer}
        />
        {renderTitle(t('additional_photos'), true)}
        <View style={styles.row}>
          <View style={styles.half}>
            <CustomCamera
              onResponse={onCameraResponse}
              cameraButtonStyle={styles.cameraContainer}
            />
          </View>
          <View style={styles.half}>
            <FilePicker onPickImages={onFilePickerResponse} />
          </View>
        </View>
        {renderPhotos()}
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.background]}>
      <CustomHeader
        showBackButton
        mainTitle={collectMinimumDetails ? t('arrest_information') : t('additional_info')}
        showLanguageSelector
        onBackPress={backButtonPress}
      />
      {!isEditAndSubmit && (
        <Progress style={styles.progress} totalStep={totalSteps} step={currentStep} />
      )}
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

export default AdditionalInfo;
