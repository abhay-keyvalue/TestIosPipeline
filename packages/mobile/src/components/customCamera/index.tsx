import React, {useEffect, useRef, useState} from 'react';
import type {RegisteredStyle} from 'react-native';
import {
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  View,
  Linking,
  SafeAreaView
} from 'react-native';
import {useSelector} from 'react-redux';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useTranslation} from 'react-i18next';
import {CropView} from 'react-native-image-crop-tools';

import type {RootState} from '@src/store';
import {hitSlop, isIOS} from '@constants/general';
import CustomText from '@components/customText';
import CameraIcon from '@assets/svg/camera.svg';
import BackIcon from '@assets/svg/back.svg';
import Rotate from '@assets/svg/rotate.svg';
import Done from '@assets/svg/done.svg';
import styles from './styles';

type CameraProps = {
  cameraButton?: React.ReactNode;
  cameraButtonStyle?: RegisteredStyle<{[key: string]: string | number}>;
  type?: string;
  uri?: string;
  uploading?: boolean;
  disabled?: boolean;
  renderPreview?: (setVisible: (show: boolean) => void) => JSX.Element;
  onResponse?: (response: string) => void;
};

const CustomCamera = ({
  type,
  cameraButton,
  uri = null,
  cameraButtonStyle,
  uploading,
  disabled = false,
  renderPreview,
  onResponse
}: CameraProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const cropViewRef = useRef(null);
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState(uri);
  const [isCropping, setIsCropping] = useState(false);

  const themeStyle = {
    text: {
      color: colors.PRIMARY_TEXT
    },
    background: {
      backgroundColor: colors.BORDER_COLOR
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    if (uri?.length > 0) setImageUri(uri);
  }, [uri]);

  const getPermission = async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') await Linking.openSettings();
  };

  const openCamera = async () => {
    setVisible(true);
  };

  const closeCamera = () => {
    setVisible(false);
  };

  const capturePhoto = async () => {
    const photo = await camera.current.takePhoto();

    setImageUri(isIOS ? photo.path : `file://${photo.path}`);
    setIsCropping(true);
  };

  const retakePhoto = () => {
    setImageUri(null);
    setIsCropping(false);
  };

  const doneCropping = () => {
    cropViewRef.current.saveImage(true, 100, 'jpg', 100);
  };

  const rotateImage = () => {
    cropViewRef.current.rotateImage(true);
  };

  const onImageCrop = (res) => {
    const imageUrl = isIOS ? res.uri : `file://${res.uri}`;

    setImageUri(imageUrl);
    setIsCropping(false);
    onResponse && onResponse(imageUrl);
    setVisible(false);
  };

  const renderCameraButton = () => {
    if (cameraButton)
      return <TouchableOpacity onPress={openCamera}>{cameraButton}</TouchableOpacity>;

    if (uri?.length > 0 && renderPreview) return renderPreview(setVisible);

    return (
      <TouchableOpacity
        onPress={() => openCamera()}
        disabled={uploading || disabled}
        style={[styles.takePictureContainer, themeStyle.background, cameraButtonStyle]}
      >
        {uploading ? <ActivityIndicator /> : <CameraIcon />}
        {!uploading && (
          <CustomText style={[styles.takePictureText, themeStyle.text]}>
            {t('take_picture')}
          </CustomText>
        )}
      </TouchableOpacity>
    );
  };

  const renderTopTools = () => {
    return (
      <View style={styles.topToolsContainer}>
        <SafeAreaView>
          <TouchableOpacity hitSlop={hitSlop} style={styles.backContainer} onPress={closeCamera}>
            <BackIcon color='#FFF' />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  };

  const renderCameraTools = () => {
    return (
      <View style={styles.bottomToolsContainer}>
        <TouchableOpacity style={styles.captureOuter} onPress={capturePhoto}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCropperTools = () => {
    return (
      <View style={styles.bottomToolsContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={rotateImage}>
          <Rotate />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureOuter} onPress={retakePhoto}>
          <CustomText style={styles.cameraText}>{'Retake'}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={doneCropping}>
          <Done />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <>
        {visible && (
          <Camera
            ref={camera}
            style={styles.container}
            device={device}
            isActive={visible}
            focusable
            photo={true}
          />
        )}
        {renderTopTools()}
        {renderCameraTools()}
      </>
    );
  };

  const renderCropper = () => {
    return (
      <>
        <CropView
          sourceUrl={imageUri}
          style={styles.container}
          ref={cropViewRef}
          onImageCrop={onImageCrop}
          aspectRatio={type === 'suspect_image' ? {width: 1, height: 1} : {width: 16, height: 10}}
        />
        {renderCropperTools()}
      </>
    );
  };

  const renderCameraModal = () => {
    return (
      <Modal visible={visible} animationType='slide'>
        <View style={styles.container}>{isCropping ? renderCropper() : renderCamera()}</View>
      </Modal>
    );
  };

  return (
    <>
      {renderCameraButton()}
      {device && renderCameraModal()}
    </>
  );
};

export default CustomCamera;
