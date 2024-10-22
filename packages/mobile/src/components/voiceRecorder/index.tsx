import React, {useEffect, useState} from 'react';
import type {RegisteredStyle} from 'react-native';
import {View, TouchableOpacity, Platform, PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import type {RootState} from '@src/store';
import {hitSlop, isAndroid} from '@constants/general';
import {showToast} from '@components/customToast';
import CustomText from '@components/customText';
import Mic from '@assets/svg/mic.svg';

const audioRecorderPlayer = new AudioRecorderPlayer();

const VoiceRecorder = ({
  onRecordingEnd,
  customStyle
}: {
  onRecordingEnd: (url: string) => void;
  customStyle?: RegisteredStyle<{[key: string]: number | string}>;
}) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0); // Track recording duration in seconds
  const themeStyle = {
    border: {
      borderColor: colors.BORDER_COLOR
    },
    activeBorder: {
      borderColor: colors.PRIMARY_COLOR
    },
    active: {
      color: colors.PRIMARY_COLOR
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (isAndroid) return await requestAndroidPermissions();
    else return await requestIosPermissions();
  };

  const requestAndroidPermissions = async () => {
    try {
      const granted = await requestMultiple([
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      ]);

      if (granted['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED) {
        showToast(t('microphone_permission_denied'), {type: 'error'});

        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);

      return false;
    }
  };

  const requestIosPermissions = async () => {
    try {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);

      if (result !== 'granted') {
        showToast(t('microphone_permission_denied'), {type: 'error'});

        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);

      return false;
    }
  };

  const onStartRecord = async () => {
    try {
      const isGranted = await checkPermissions();

      if (isGranted) {
        setIsRecording(true);
        const dirs = RNFetchBlob.fs.dirs;
        const path = Platform.select({
          ios: 'voice.m4a',
          android: `${dirs.CacheDir}/voice.mp3`
        });

        const audioProperties = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
          OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS
        };

        await audioRecorderPlayer.startRecorder(path, audioProperties);
        audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordSecs(e.currentPosition / 1000);

          return;
        });
      }
    } catch (err) {
      setIsRecording(false);
      showToast(t('error_microphone_permission_denied'), {type: 'error'});
    }
  };

  const onStopRecord = async () => {
    if (!isRecording) return;

    try {
      const audioUrl = await audioRecorderPlayer.stopRecorder();

      audioRecorderPlayer.removeRecordBackListener();

      setIsRecording(false);

      if (recordSecs > 4) onRecordingEnd(audioUrl);

      setRecordSecs(0);
    } catch (err) {
      showToast(t('error_microphone_permission_denied'), {type: 'error'});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={customStyle}>
      <TouchableOpacity
        onPressIn={onStartRecord}
        onPressOut={onStopRecord}
        hitSlop={hitSlop}
        activeOpacity={1}
        style={[
          styles.voiceRecorder,
          themeStyle.border,
          isRecording && themeStyle.activeBorder,
          isRecording && styles.large
        ]}
      >
        <Mic />
      </TouchableOpacity>
      {isRecording && (
        <CustomText style={[styles.timer, themeStyle.active]}>{formatTime(recordSecs)}</CustomText>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  voiceRecorder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: 'red',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  large: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  timer: {
    marginTop: '10@s',
    fontSize: '14@s',
    color: 'gray',
    textAlign: 'center'
  }
});

export default VoiceRecorder;
