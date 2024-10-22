import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {toggleArrestTabFeature, toggleCollectMinimumDetailsFlag} from '@utils/featureSlice';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';

function SettingsAndPrivacy(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {hideArrestTab, collectMinimumDetails} = useSelector((state: RootState) => state.feature);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    primaryColor: {
      color: colors?.PRIMARY_COLOR
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    }
  };

  const renderSettings = () => {
    return (
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, themeStyle.cardBackground]}
          onPress={() => {
            dispatch(toggleArrestTabFeature(!hideArrestTab));
          }}
        >
          <CustomText style={[themeStyle.primaryColor, styles.buttonText]}>
            {hideArrestTab ? 'Show Arrest Tab' : 'Hide Arrest Tab'}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, themeStyle.cardBackground]}
          onPress={() => {
            dispatch(toggleCollectMinimumDetailsFlag(!collectMinimumDetails));
          }}
        >
          <CustomText style={[themeStyle.primaryColor, styles.buttonText]}>
            {collectMinimumDetails ? 'Collect All Details' : 'Collect Minimum Details'}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomHeader title={t('settings_and_Privacy')} showBackButton />
      {renderSettings()}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: '12@s',
    paddingTop: '4@vs',
    flex: 1
  },
  button: {
    padding: '12@s',
    borderRadius: '4@s',
    marginBottom: '6@vs'
  },
  buttonText: {
    fontSize: '14@s',
    fontWeight: '500'
  }
});

export default SettingsAndPrivacy;
