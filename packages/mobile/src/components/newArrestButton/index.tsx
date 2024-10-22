import React from 'react';
import type {TextProps} from 'react-native';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import PlusIcon from '@assets/svg/plusIcon.svg';

const NewArrestButton = ({onPress = () => {}}: TextProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const textStyle = {
    color: colors?.LIGHT
  };

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={styles.container}>
      <LinearGradient style={styles.gradient} angle={135} colors={['#0069CA', '#4D97DC']}>
        <View style={styles.iconContainer}>
          <PlusIcon color={colors?.LIGHT} />
        </View>
        <CustomText style={[styles.buttonLabel, textStyle]}>{t('new_arrest')}</CustomText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 260,
    height: '220@vs',
    marginBottom: '6@s'
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLabel: {
    textTransform: 'uppercase',
    fontWeight: '800',
    fontSize: '24@ms0.3',
    marginTop: '14@vs'
  },
  iconContainer: {
    opacity: 0.5
  }
});

export default NewArrestButton;
