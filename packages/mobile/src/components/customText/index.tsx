import React, {useMemo} from 'react';
import type {TextProps} from 'react-native';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';

type CustomTextType = TextProps & {
  children: React.ReactNode;
  fontWeight?: string;
};

const CustomText = ({style, children, fontWeight, ...props}: CustomTextType) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const textStyle = {
    color: colors?.PRIMARY_TEXT
  };

  // Fix for font weight in android
  const fontFamily = useMemo(() => {
    switch (fontWeight) {
      case fontWeights.BOLD:
        return 'Inter-Bold';
      case fontWeights.MEDIUM:
        return 'Inter-Medium';
      case fontWeights.REGULAR:
        return 'Inter-Regular';
      case fontWeights.THIN:
        return 'Inter-Thin';
      default:
        return 'Inter-Regular';
    }
  }, [fontWeight]);

  return (
    <Text style={[styles.text, textStyle, {fontFamily: fontFamily}, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = ScaledSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: '14@ms0.3'
  }
});

export default CustomText;
