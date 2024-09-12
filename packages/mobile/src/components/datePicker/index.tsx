import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {isIOS} from '@constants/general';
import CustomText from '@components/customText';
import Calendar from '@assets/svg/calendar.svg';

type DatePickerProps = {
  onSelectDate?: (date: Date) => void;
  date?: Date;
  mode?: 'date' | 'time' | 'datetime';
};

const CustomDatePicker = ({onSelectDate = () => null, date, mode = 'date'}: DatePickerProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(date || null);

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    textStyle: {
      color: colors?.PRIMARY_TEXT
    },
    border: {
      borderColor: colors?.BORDER_COLOR
    },
    borderActive: {
      borderColor: colors?.PRIMARY_COLOR
    },
    placeHolder: {
      color: `${colors?.PRIMARY_TEXT}99`
    }
  };

  useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  const onConfirmDate = (date: Date) => {
    setSelectedDate(date);
    onSelectDate && onSelectDate(date);
    setVisible(false);
  };

  const dateString = useMemo(() => {
    if (mode === 'date') {
      if (selectedDate) return dateFormat(selectedDate, 'dd/mm/yyyy');

      return 'dd/mm/yyyy';
    } else if (mode === 'datetime') {
      if (selectedDate) return dateFormat(selectedDate, 'hh:MM TT dd mmmm yyyy');

      return 'hh:MM TT dd mmmm yyyy';
    } else {
      if (selectedDate) return dateFormat(selectedDate, 'HH:MM');

      return 'hh:mm';
    }
  }, [selectedDate, mode]);

  const renderSelector = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.selectorBox, themeStyle.border]}
      >
        <CustomText style={[styles.placeholder, themeStyle.placeHolder]}>{dateString}</CustomText>
        <View style={styles.iconContainer}>
          <Calendar width={20} height={20} color={colors?.PRIMARY_TEXT} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderSelector()}
      <DatePicker
        modal
        mode={mode}
        open={visible}
        date={new Date()}
        maximumDate={new Date()}
        onConfirm={onConfirmDate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: '1@vs',
    borderRadius: '4@ms',
    minHeight: isIOS ? '40@vs' : '45@vs',
    paddingHorizontal: '8@ms',
    paddingVertical: '5@vs'
  },
  placeholder: {
    fontSize: '14@ms',
    fontWeight: '400',
    maxWidth: '80%'
  },
  iconContainer: {
    marginRight: '2@s'
  }
});

export default CustomDatePicker;
