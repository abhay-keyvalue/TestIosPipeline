import React from 'react';
import type {RegisteredStyle} from 'react-native';
import {TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {WINDOW_HEIGHT, isIOS} from '@constants/general';

interface TextInputProps extends React.ComponentProps<typeof TextInput> {
  icon?: React.ReactNode;
  containerStyle?: RegisteredStyle<{[key: string]: number | string}>;
}

const CustomTextInput = ({containerStyle, icon, multiline, ...props}: TextInputProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    container: {
      borderColor: colors?.BORDER_COLOR
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    placeHolder: {
      color: `${colors?.PRIMARY_TEXT}99`
    }
  };

  return (
    <View
      style={[
        [styles.container, multiline && styles.multiline, themeStyle.container, containerStyle]
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        placeholderTextColor={`${colors?.PRIMARY_TEXT}99`}
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea, themeStyle.text]}
        {...props}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: isIOS ? '40@vs' : '45@vs',
    borderWidth: '1@vs',
    borderRadius: '5@s',
    overflow: 'hidden'
  },
  textArea: {
    textAlignVertical: 'top'
  },
  multiline: {
    height: '100@vs',
    paddingVertical: isIOS ? '8@s' : '5@s',
    paddingHorizontal: isIOS ? '4@s' : '4@s',
    minHeight: '40@vs',
    maxHeight: WINDOW_HEIGHT * 0.4
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: '100%',
    width: '100%',
    paddingHorizontal: '12@s',
    fontSize: '14@ms0.3',
    textAlignVertical: 'center'
  },
  icon: {
    marginLeft: '8@s',
    minHeight: '32@vs',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CustomTextInput;
