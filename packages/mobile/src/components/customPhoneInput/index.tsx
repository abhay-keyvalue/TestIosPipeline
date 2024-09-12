import React, {useEffect, useState} from 'react';
import type {RegisteredStyle} from 'react-native';
import {TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {isIOS} from '@constants/general';
import CountryCodeSelector from '@components/countryCodeSelector';

interface CustomPhoneInputProps {
  containerStyle?: RegisteredStyle<{[key: string]: number | string}>;
  onChangePhoneNumber: (phoneNumber: string) => void;
  placeholder?: string;
  value?: string;
}

const CustomPhoneInput = ({
  containerStyle,
  placeholder,
  onChangePhoneNumber,
  value
}: CustomPhoneInputProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const [countryCode, setCountryCode] = useState('+355');
  const [phoneNumber, setPhoneNumber] = useState('');

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

  useEffect(() => {
    if (value?.length > 0) {
      const [countryCode, phoneNumber] = value.split('-');

      setCountryCode(countryCode);
      setPhoneNumber(phoneNumber);
    }
  }, [value]);

  useEffect(() => {
    const updatePhone = `${countryCode}-${phoneNumber}`;

    if (updatePhone?.length > 1 && phoneNumber?.length > 0) onChangePhoneNumber(updatePhone);
  }, [countryCode, phoneNumber]);

  return (
    <View style={[[styles.container, containerStyle]]}>
      <CountryCodeSelector value={countryCode} onSelectItem={setCountryCode} />
      <View style={[styles.phoneNumberContainer, themeStyle.container]}>
        <TextInput
          value={phoneNumber}
          placeholderTextColor={`${colors?.PRIMARY_TEXT}99`}
          style={[styles.input, themeStyle.text]}
          placeholder={placeholder}
          keyboardType='number-pad'
          onChangeText={setPhoneNumber}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isIOS ? '40@vs' : '45@vs',
    overflow: 'hidden'
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: '100%',
    width: '100%',
    paddingHorizontal: '12@s',
    fontSize: '14@ms0.3',
    textAlignVertical: 'center'
  },
  phoneNumberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: '1@s',
    borderRadius: '5@s'
  }
});

export default CustomPhoneInput;
