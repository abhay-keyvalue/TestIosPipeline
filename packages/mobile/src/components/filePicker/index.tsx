import React from 'react';
import type {RegisteredStyle} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

import type {RootState} from '@src/store';
import {showToast} from '@components/customToast';
import CustomText from '@components/customText';
import Upload from '@assets/svg/upload.svg';

type FilePickerType = {
  buttonStyle?: RegisteredStyle<{[key: string]: string | number}>;
  onPickImages?: (images: Asset[]) => void;
};

type Asset = {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  originalPath?: string;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
};

function FilePicker({buttonStyle, onPickImages}: FilePickerType): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    text: {
      color: colors.PRIMARY_TEXT
    },
    background: {
      backgroundColor: colors.BORDER_COLOR
    }
  };

  const openFilePicker = async () => {
    const options = {
      mediaType: 'photo'
    };

    try {
      const result = await launchImageLibrary(options);

      onPickImages(result?.assets);
    } catch (error) {
      showToast(t('canceled_image_selection'), {type: 'warning'});
    }
  };

  return (
    <TouchableOpacity
      onPress={() => openFilePicker()}
      style={[styles.container, themeStyle.background, buttonStyle]}
    >
      <Upload width={15} />
      <CustomText style={[styles.takePictureText, themeStyle.text]}>{t('upload_file')}</CustomText>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  container: {
    borderRadius: '8@s',
    minHeight: '70@vs',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5@vs',
    overflow: 'hidden'
  },
  takePictureText: {
    fontSize: '14@ms0.3',
    paddingLeft: '10@s',
    marginTop: '3@vs'
  }
});

export default FilePicker;
