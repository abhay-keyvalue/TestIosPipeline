import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import CustomText from '@components/customText';
import EditIcon from '@components/editIcon';

type AdditionalInfoCardType = {
  detaineeDeclaration?: {label: string};
  lawyerName?: string;
  telephoneNumber?: string;
  additionalInfo?: string;
  onPressEdit?: () => void;
};

const AdditionalInfoCard = (props: AdditionalInfoCardType) => {
  const {detaineeDeclaration, lawyerName, telephoneNumber, additionalInfo, onPressEdit} = props;

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
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
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
          {t('additional_info')}
        </CustomText>
        <EditIcon onPress={onPressEdit} />
      </View>
      <View style={styles.column}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.text}>
          {t('detainee_declaration')}
        </CustomText>
        <CustomText numberOfLines={2} style={styles.text}>
          {t(`${detaineeDeclaration?.label}`)}
        </CustomText>
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('name_of_lawyer'), lawyerName)}
        {renderHalfBox(t('telephone_number'), telephoneNumber)}
      </View>
      <View style={styles.column}>
        <CustomText style={styles.text}>{t('additional_information')}</CustomText>
        <CustomText style={styles.text}>{additionalInfo || '-'}</CustomText>
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
    marginBottom: '10@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '8@vs'
  },
  column: {
    flexDirection: 'column',
    marginBottom: '8@vs'
  },
  textContainer: {
    marginLeft: '12@s',
    flex: 1
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '5@vs'
  },
  half: {
    width: '50%'
  }
});

export default AdditionalInfoCard;
