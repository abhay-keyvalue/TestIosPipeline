import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import CustomText from '@components/customText';
import EditIcon from '@components/editIcon';

type ResidentialDetailsCardType = {
  district?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  staircase_number?: string;
  telephone_number?: string;
  private_house_palace_number?: string;
  onPressEdit?: () => void;
};

const ResidentialDetailsCard = (props: ResidentialDetailsCardType) => {
  const {
    district,
    city,
    neighborhood,
    street,
    staircase_number,
    telephone_number,
    private_house_palace_number,
    onPressEdit
  } = props;

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    text: {
      color: colors?.PRIMARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    }
  };
  const renderHalfBox = (title: string, value: string) => {
    return (
      <View style={styles.half}>
        <CustomText
          numberOfLines={2}
          fontWeight={fontWeights.MEDIUM}
          style={[themeStyle.text, styles.text]}
        >
          {title}
        </CustomText>
        <CustomText numberOfLines={2} style={[themeStyle.text, styles.text]}>
          {value || '-'}
        </CustomText>
      </View>
    );
  };

  return (
    <View style={[styles.cardContainer, themeStyle.cardBackground]}>
      <View style={styles.titleRow}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.cardTitle, themeStyle.text]}>
          {t('residential_details')}
        </CustomText>
        {onPressEdit && <EditIcon onPress={onPressEdit} />}
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('district'), district)}
        {renderHalfBox(t('city_municipality'), city)}
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('neighborhood'), neighborhood)}
        {renderHalfBox(t('street'), street)}
      </View>
      <View style={styles.column}>
        <CustomText style={[themeStyle.text, styles.text]}>
          {t('private_house_palace_number')}
        </CustomText>
        <CustomText style={[themeStyle.text, styles.text]}>
          {private_house_palace_number || '-'}
        </CustomText>
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('staircase_number'), staircase_number)}
        {renderHalfBox(t('telephone_number'), telephone_number)}
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  cardContainer: {
    padding: '12@s',
    borderRadius: '8@s',
    marginBottom: '16@vs'
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '12@vs'
  },
  column: {
    flexDirection: 'column',
    marginBottom: '12@vs'
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '5@vs'
  },
  title: {
    fontSize: '18@ms0.3',
    fontWeight: '600'
  },
  half: {
    width: '50%'
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '12@vs'
  }
});

export default ResidentialDetailsCard;
