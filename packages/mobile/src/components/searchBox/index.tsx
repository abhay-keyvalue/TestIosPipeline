import React from 'react';
import type {TextInputProps} from 'react-native';
import {TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import SearchIcon from '@assets/svg/searchIcon.svg';

const SearchBox = ({style, ...props}: TextInputProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    searchContainer: {
      borderColor: colors.BORDER_COLOR
    },
    inputStyle: {
      color: colors.PRIMARY_TEXT
    }
  };

  return (
    <View style={[styles.searchContainer, themeStyle.searchContainer]}>
      <TextInput
        placeholderTextColor={colors.SECONDARY_TEXT}
        style={[styles.input, themeStyle.inputStyle, style]}
        {...props}
      />
      <SearchIcon />
    </View>
  );
};

const styles = ScaledSheet.create({
  searchContainer: {
    width: '100%',
    height: '44@ms',
    flexDirection: 'row',
    borderRadius: '5@s',
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: '10@s'
  },
  input: {
    fontFamily: 'Inter-Regular',
    flex: 1,
    height: '44@ms',
    paddingRight: '8@s',
    borderRadius: '5@s',
    fontSize: '13@ms0.3'
  }
});

export default SearchBox;
