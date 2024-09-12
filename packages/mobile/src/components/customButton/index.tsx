import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import CustomText from '@components/customText';

type CustomButtonProps = {
  title: string;
  style?: object;
  textStyle?: object;
  onPress: () => void;
  disabled?: boolean;
};

const CustomButton = ({title, style, disabled, textStyle, ...props}: CustomButtonProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    button: {
      backgroundColor: colors?.PRIMARY_COLOR
    },
    text: {
      color: colors?.LIGHT
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, themeStyle.button, style, disabled && styles.disabled]}
      {...props}
    >
      <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.text, themeStyle.text, textStyle]}>
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  button: {
    borderRadius: '5@s',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40@ms'
  },
  text: {
    fontSize: '14@ms0.3',
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.5
  }
});

export default CustomButton;
