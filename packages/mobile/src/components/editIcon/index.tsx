import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import Pencil from '@assets/svg/pencil.svg';

const EditIcon = ({onPress}: {onPress?: () => void}) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const textStyle = {
    color: colors?.PRIMARY_COLOR
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <CustomText style={[styles.text, textStyle]}>{t('edit')}</CustomText>
      <Pencil />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginRight: 4
  }
});

export default EditIcon;
