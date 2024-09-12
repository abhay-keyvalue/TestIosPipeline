import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {fontWeights, lawyerEditFieldTypes, lawyerTypes} from '@constants/general';
import LawyerEditPopup from '@components/lawyerEditPopup';
import CustomText from '@components/customText';
import EditIcon from '@components/editIcon';

type LawyerDetailsCardType = {
  type?: string;
  lawyerName?: string;
  assignedTime?: string;
  telephoneNumber?: string;
  supervisor?: string;
  editable?: boolean;
};

const LawyerDetailsCard = (props: LawyerDetailsCardType) => {
  const {lawyerName, assignedTime, telephoneNumber, supervisor, type, editable = true} = props;
  const [enableEdit, setEnableEdit] = useState(false);

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    text: {
      color: colors?.PRIMARY_TEXT
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    }
  };

  const lawyerCardData = useMemo(() => {
    const {NAME, TELEPHONE_NUMBER, ASSIGNED_TIME, SUPERVISOR} = lawyerEditFieldTypes;

    if (type === lawyerTypes.DEFENSE)
      return {
        title: t('defense_details'),
        columns: [
          {type: NAME, title: t('name'), value: lawyerName},
          {type: TELEPHONE_NUMBER, title: t('telephone_number'), value: telephoneNumber},
          {
            type: ASSIGNED_TIME,
            title: t('assigned_time'),
            value: dateFormat(assignedTime, 'hh:MM TT, dd mmmm yyyy')
          }
        ]
      };

    return {
      title: t('prosecutor_details'),
      columns: [
        {type: NAME, title: t('name'), value: lawyerName},
        {
          type: ASSIGNED_TIME,
          title: t('assigned_time'),
          value: dateFormat(assignedTime, 'hh:MM TT, dd mmmm yyyy')
        },
        {type: SUPERVISOR, title: t('supervisor'), value: supervisor}
      ]
    };
  }, [type, lawyerName, assignedTime, telephoneNumber]);

  const renderColumn = (title: string, value: string) => {
    return (
      <View key={title} style={styles.column}>
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
          {lawyerCardData.title}
        </CustomText>
        {editable && <EditIcon onPress={() => setEnableEdit(true)} />}
      </View>
      {lawyerCardData.columns.map((column) => renderColumn(column.title, column.value))}
      <LawyerEditPopup
        visible={enableEdit}
        setVisible={setEnableEdit}
        title={lawyerCardData.title}
        columns={lawyerCardData.columns}
        buttonProps={{primaryButtonTitle: t('submit')}}
        selectedData={{name: lawyerName, assignedTime, telephoneNumber, supervisor}}
      />
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
  column: {
    flexDirection: 'column',
    marginBottom: '8@vs'
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '3@vs'
  }
});

export default LawyerDetailsCard;
