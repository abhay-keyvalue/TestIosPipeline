import React from 'react';
import type {RegisteredStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import CustomText from '@components/customText';

type ProgressType = {
  totalStep: number;
  step: number;
  style?: RegisteredStyle<{[key: string]: number | string}>;
};

const Progress = ({totalStep = 4, step, style}: ProgressType) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    text: {
      color: colors.PRIMARY_TEXT
    }
  };

  const renderProgress = (index: number, current: number, colors: {[key: string]: string}) => {
    return (
      <View
        key={index}
        style={{
          width: `${94 / totalStep}%`
        }}
      >
        <View
          style={[
            styles.progressStyle,
            {backgroundColor: index < current ? colors.PRIMARY_COLOR : colors.BORDER_COLOR}
          ]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({length: totalStep}, (_, index) => renderProgress(index, step, colors))}
      <CustomText style={[styles.progressText, themeStyle.text]}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.textLarge}>
          {step}
        </CustomText>
        {`/${totalStep}`}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20
  },
  textLarge: {
    fontSize: 16
  },
  progressText: {
    minWidth: '6%',
    fontSize: 10,
    textAlign: 'right'
  },
  progressStyle: {
    height: 5,
    marginRight: 10,
    borderRadius: 5
  }
});

export default Progress;
