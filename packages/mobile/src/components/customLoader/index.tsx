import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

import type {RootState} from '@src/store';

const CustomLoader = () => {
  const {colors} = useSelector((state: RootState) => state.theme);

  return (
    <View style={[styles.container, {backgroundColor: `${colors.CARD_BACKGROUND}1A`}]}>
      <ActivityIndicator size='large' color={colors.PRIMARY_COLOR} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  }
});

export default CustomLoader;
