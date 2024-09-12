import React, {useEffect, useState} from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {fontWeights, hitSlop, lawyerEditFieldTypes} from '@constants/general';
import CustomDatePicker from '@components/datePicker';
import CustomText from '@components/customText';
import CustomButton from '@components/customButton';
import Close from '@assets/svg/close.svg';
import CustomTextInput from '@components/customTextInput';

type LawyerEditPopupType = {
  visible: boolean;
  setVisible: (flag: boolean) => void;
  title: string;
  columns?: Array<{type: string; title: string; value: string}>;
  selectedData?: {
    name?: string;
    telephoneNumber?: string;
    assignedTime?: string;
    supervisor?: string;
  };
  buttonProps?: {
    primaryButtonTitle?: string;
    primaryButtonAction?: (data) => void;
  };
};

const LawyerEditPopup = ({
  visible,
  setVisible,
  title,
  buttonProps,
  columns,
  selectedData
}: LawyerEditPopupType) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const [name, setName] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [assignedTime, setAssignedTime] = useState(null);
  const [supervisor, setSupervisor] = useState('');

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    },
    text: {
      color: colors?.PRIMARY_TEXT
    }
  };

  useEffect(() => {
    if (selectedData) {
      setName(selectedData?.name);
      setTelephoneNumber(selectedData?.telephoneNumber);
      setAssignedTime(selectedData?.assignedTime);
      setSupervisor(selectedData?.supervisor);
    }
  }, [selectedData]);

  const onPressSubmit = () => {
    if (buttonProps?.primaryButtonAction) {
      const data = {
        name,
        telephoneNumber,
        assignedTime,
        supervisor
      };

      buttonProps?.primaryButtonAction(data);
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {buttonProps?.primaryButtonTitle?.length > 0 && (
          <CustomButton
            title={buttonProps?.primaryButtonTitle}
            onPress={onPressSubmit}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />
        )}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.row}>
        {title?.length > 0 && (
          <CustomText fontWeight={fontWeights.MEDIUM} style={styles.title}>
            {title}
          </CustomText>
        )}
        <TouchableOpacity
          style={styles.closeIcon}
          hitSlop={hitSlop}
          onPress={() => setVisible(false)}
        >
          <Close color={colors.PRIMARY_TEXT} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEditName = (type) => {
    return (
      <View key={type}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {t('name')}
        </CustomText>
        <CustomTextInput value={name} onChangeText={setName} />
      </View>
    );
  };

  const renderEditTelephoneNumber = (type) => {
    return (
      <View key={type}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {t('telephone_number')}
        </CustomText>
        <CustomTextInput value={telephoneNumber} onChangeText={setTelephoneNumber} />
      </View>
    );
  };

  const renderEditAssignedTime = (type) => {
    return (
      <View key={type}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {t('assigned_time')}
        </CustomText>
        <CustomDatePicker
          date={assignedTime}
          onSelectDate={(date) => setAssignedTime(date)}
          mode={'datetime'}
        />
      </View>
    );
  };

  const renderEditSupervisor = (type) => {
    return (
      <View key={type}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {t('supervisor')}
        </CustomText>
        <CustomTextInput value={supervisor} onChangeText={setSupervisor} />
      </View>
    );
  };

  const renderContent = () => {
    const {NAME, TELEPHONE_NUMBER, ASSIGNED_TIME, SUPERVISOR} = lawyerEditFieldTypes;

    return columns?.map((column) => {
      switch (column.type) {
        case NAME:
          return renderEditName(column.type);
        case TELEPHONE_NUMBER:
          return renderEditTelephoneNumber(column.type);
        case ASSIGNED_TIME:
          return renderEditAssignedTime(column.type);
        case SUPERVISOR:
          return renderEditSupervisor(column.type);
        default:
          return null;
      }
    });
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.outSide} onPress={() => setVisible(false)} />
        <View style={[styles.content, themeStyle.cardBackground]}>
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  outSide: {
    flex: 1
  },
  content: {
    width: '100%',
    borderTopLeftRadius: '10@s',
    borderTopRightRadius: '10@s',
    padding: '15@s',
    paddingBottom: '30@s'
  },
  title: {
    fontSize: '18@s',
    fontWeight: '600',
    marginBottom: '12@s'
  },
  text: {
    fontSize: '14@s',
    marginBottom: '6@s',
    marginTop: '12@s'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footer: {
    paddingTop: '12@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  primaryButton: {
    flex: 1,
    height: '40@s'
  },
  primaryButtonText: {
    fontSize: '14@s',
    fontWeight: '600'
  },
  closeIcon: {
    paddingBottom: '8@s'
  }
});

export default LawyerEditPopup;
