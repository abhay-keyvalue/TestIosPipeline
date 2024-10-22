import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';

import type {RootState} from '@src/store';
import {showToast} from '@components/customToast';
import {hitSlop, isIOS} from '@constants/general';
import CustomText from '@components/customText';
import Play from '@assets/svg/play.svg';
import Pause from '@assets/svg/stop.svg';
import thumbCircle from '@assets/png/thumbCircle.png';
import Close from '@assets/svg/close.svg';

const audioRecorderPlayer = new AudioRecorderPlayer();
const VoicePlayer = ({
  audioUrl,
  style,
  loading,
  onPressClose
}: {
  audioUrl: string;
  style?: object;
  loading?: boolean;
  onPressClose?: () => void;
}) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cachedAudioPath, setCachedAudioPath] = useState<string | null>(null);

  const themeStyle = {
    border: {
      borderColor: colors.BORDER_COLOR
    },
    text: {
      color: colors.PRIMARY_TEXT
    },
    background: {
      backgroundColor: `${colors.PRIMARY_COLOR}1A`
    }
  };

  useEffect(() => {
    if (audioUrl) cacheAudioFile();
  }, [audioUrl]);

  useEffect(() => {
    if (loading) {
      setDuration(0);
      stopPlaying();
    }
  }, [loading]);

  const cacheAudioFile = async () => {
    if (audioUrl?.startsWith('http'))
      try {
        const fileName = audioUrl.split('/').pop()?.split('?')[0];
        const localFilePath = isIOS
          ? `${RNFS.CachesDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;
        const fileExists = await RNFS.exists(localFilePath);

        if (fileExists) {
          setCachedAudioPath(localFilePath);
        } else {
          const downloadOptions = {
            fromUrl: audioUrl,
            toFile: localFilePath
          };

          await RNFS.downloadFile(downloadOptions).promise;
          setCachedAudioPath(localFilePath);
        }
      } catch (err) {
        showToast(t('failed_to_cache_audio'), {type: 'error'});
      }
  };

  const startPlaying = async () => {
    const playUrl =
      isIOS && cachedAudioPath ? `file://${cachedAudioPath}` : cachedAudioPath || audioUrl;

    if (playUrl)
      try {
        await audioRecorderPlayer.startPlayer(playUrl);
        audioRecorderPlayer.addPlayBackListener((e) => {
          setPlaybackPosition(e.currentPosition);
          setDuration(e.duration);
          if (e.currentPosition === e.duration) stopPlaying();
        });
        setIsPlaying(true);
        setIsPaused(false);
      } catch (err) {
        showToast(t('failed_to_play_audio'), {type: 'error'});
      }
  };

  const pausePlaying = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPaused(true);
      setIsPlaying(false);
    } catch (err) {
      showToast(t('failed_to_pause_audio'), {type: 'error'});
    }
  };

  const resumePlaying = async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      showToast(t('failed_to_resume_audio'), {type: 'error'});
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlaybackPosition(0);
      setIsPlaying(false);
      setIsPaused(false);
    } catch (err) {
      showToast(t('failed_to_stop_audio'), {type: 'error'});
    }
  };

  const onSliderValueChange = async (value: number) => {
    setPlaybackPosition(value);
    await audioRecorderPlayer?.seekToPlayer(value);
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  if (!(audioUrl?.length > 0)) return null;

  return (
    <View style={[styles.container, themeStyle.border, style]}>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.PRIMARY_COLOR} />
      ) : (
        <TouchableOpacity
          hitSlop={hitSlop}
          onPress={isPlaying ? pausePlaying : isPaused ? resumePlaying : startPlaying}
          style={[styles.iconContainer, themeStyle.border]}
        >
          {isPlaying ? (
            <Pause width={14} height={14} color={colors.PRIMARY_TEXT} />
          ) : (
            <Play width={14} height={14} color={colors.PRIMARY_COLOR} />
          )}
        </TouchableOpacity>
      )}
      <View style={[styles.sliderContainer, themeStyle.background]}>
        <Slider
          style={styles.flex}
          value={playbackPosition}
          minimumValue={0}
          maximumValue={duration}
          thumbTintColor={colors.PRIMARY_COLOR}
          minimumTrackTintColor={colors.PRIMARY_COLOR}
          maximumTrackTintColor={colors.BORDER_COLOR}
          thumbImage={thumbCircle}
          onSlidingComplete={onSliderValueChange}
        />
        <CustomText style={[styles.time, themeStyle.text]}>
          {formatTime(playbackPosition)} / {formatTime(duration)}
        </CustomText>
        {onPressClose && (
          <TouchableOpacity hitSlop={hitSlop} onPress={onPressClose} style={styles.closeButton}>
            <Close width={12} height={12} color={colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30@vs',
    borderRadius: '10@s',
    paddingVertical: isIOS ? '2@vs' : '8@vs'
  },
  iconContainer: {
    padding: '8@s',
    borderWidth: '1@s',
    borderRadius: '15@s',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '6@s'
  },
  flex: {
    flex: 1,
    paddingHorizontal: 0
  },
  time: {
    marginLeft: '4@s',
    fontSize: '11@ms0.3'
  },
  closeButton: {
    marginLeft: '6@s'
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: isIOS ? '8@s' : '0@s',
    paddingRight: '8@s',
    backgroundColor: 'red',
    height: '40@s',
    borderRadius: '10@s',
    overflow: 'hidden'
  }
});

export default VoicePlayer;
