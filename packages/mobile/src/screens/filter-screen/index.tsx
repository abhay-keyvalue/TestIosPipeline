import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import type {SelectedFilterDataType} from './filterSlice';
import {setSelectedFilterData} from './filterSlice';
import {popScreens} from '@navigation/navigationUtils';
import {caseStatuses, filterTypesList, fontWeights, genderList} from '@constants/general';
import CustomButton from '@components/customButton';
import CustomRadioSelector from '@components/customRadioSelector';
import CustomDatePicker from '@components/datePicker';
import CustomHeader from '@components/customHeader';
import CustomText from '@components/customText';
import RightArrow from '@assets/svg/rightArrow.svg';

const assignedProsecutorList = [
  {id: 1, label: 'John Doe', value: 'John Doe'},
  {id: 2, label: 'Abhay Balan', value: 'Abhay Balan'},
  {id: 3, label: 'John Smith', value: 'John Smith'},
  {id: 4, label: 'George Smith', value: 'George Smith'}
];

function Filters(): React.JSX.Element {
  const colors = useSelector((state: RootState) => state.theme.colors);
  const selectedFilterData = useSelector((state: RootState) => state.filter.selectedFilterData);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [selectedFilterType, setSelectedFilterType] = useState(filterTypesList[0]);
  const [selectedCaseStatus, setSelectedCaseStatus] = useState(caseStatuses[0]);
  const [selectedGender, setSelectedGender] = useState(genderList[0]);
  const [selectedProsecutor, setSelectedProsecutor] = useState(assignedProsecutorList[0]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const themeStyle = {
    content: {backgroundColor: `${colors.PRIMARY_COLOR}1A`},
    container: {backgroundColor: colors.PRIMARY_BACKGROUND},
    right: {backgroundColor: colors.secondary}
  };

  useEffect(() => {
    if (selectedFilterData) {
      const {dateRange, caseStatus, gender, prosecutor} = selectedFilterData;

      setSelectedCaseStatus(caseStatus || caseStatuses[0]);
      setSelectedGender(gender || genderList[0]);
      setSelectedProsecutor(prosecutor || assignedProsecutorList[0]);
      setFromDate(dateRange?.[0] ? new Date(dateRange[0]) : null);
      setToDate(dateRange?.[1] ? new Date(dateRange[1]) : null);
    }
  }, [selectedFilterData]);

  const onPressContinue = () => {
    const updatedSelectedFilterData: SelectedFilterDataType = {};

    if (selectedCaseStatus) updatedSelectedFilterData.caseStatus = selectedCaseStatus;
    if (selectedGender) updatedSelectedFilterData.gender = selectedGender;
    if (selectedProsecutor) updatedSelectedFilterData.prosecutor = selectedProsecutor;
    if (fromDate) updatedSelectedFilterData.dateRange = [dateFormat(fromDate, 'yyyy-mm-dd')];
    if (toDate)
      updatedSelectedFilterData.dateRange = [
        ...updatedSelectedFilterData.dateRange,
        dateFormat(toDate, 'yyyy-mm-dd')
      ];

    dispatch(setSelectedFilterData(updatedSelectedFilterData));
    popScreens(1);
  };

  const onSelectCaseStatus = (item) => {
    setSelectedCaseStatus(item);
  };

  const onSelectGender = (item) => {
    setSelectedGender(item);
  };

  const onSelectProsecutor = (item) => {
    setSelectedProsecutor(item);
  };

  const renderArrestDateSelector = () => {
    return (
      <View>
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.dateTitle}>
          {t('select_start_date')}
        </CustomText>
        <CustomDatePicker
          date={fromDate}
          onSelectDate={(date) => setFromDate(date)}
          mode={'date'}
        />
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.dateTitle}>
          {t('select_to_date')}
        </CustomText>
        <CustomDatePicker date={toDate} onSelectDate={(date) => setToDate(date)} mode={'date'} />
      </View>
    );
  };

  const renderCaseStatus = () => {
    return (
      <CustomRadioSelector
        onSelectItem={onSelectCaseStatus}
        list={caseStatuses}
        item={selectedCaseStatus}
      />
    );
  };

  const renderProsecutorList = () => {
    return (
      <CustomRadioSelector
        onSelectItem={onSelectProsecutor}
        list={assignedProsecutorList}
        item={selectedProsecutor}
      />
    );
  };

  const renderGenderList = () => {
    return (
      <CustomRadioSelector onSelectItem={onSelectGender} list={genderList} item={selectedGender} />
    );
  };

  const renderLeftItem = (item) => {
    return (
      <TouchableOpacity
        key={item}
        onPress={() => setSelectedFilterType(item)}
        style={[styles.leftItem, selectedFilterType === item && themeStyle.content]}
      >
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.leftItemText}>
          {t(`${item}`)}
        </CustomText>
        <RightArrow width={14} height={14} color={colors.PRIMARY_COLOR} />
      </TouchableOpacity>
    );
  };

  const renderLeftView = () => {
    return (
      <View style={[styles.left, themeStyle.container]}>
        {filterTypesList?.map((item) => renderLeftItem(item))}
      </View>
    );
  };

  const renderRightViewItem = () => {
    switch (selectedFilterType) {
      case 'case_status':
        return renderCaseStatus();
      case 'suspect_gender':
        return renderGenderList();
      case 'date_of_arrest':
        return renderArrestDateSelector();
      case 'assigned_prosecutor':
        return renderProsecutorList();
      default:
        return <View />;
    }
  };

  const renderRightView = () => {
    return (
      <View style={[styles.right, themeStyle.right]}>
        {renderRightViewItem()}
        <CustomButton
          style={styles.buttonStyles}
          textStyle={styles.buttonTextStyle}
          title={t('continue')}
          onPress={onPressContinue}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomHeader
        showBackButton
        mainTitle={t('Filters')}
        mainTitleStyle={styles.mainTitle}
        rightContainerItem={<View />}
      />
      <View style={[styles.content, themeStyle.content]}>
        {renderLeftView()}
        {renderRightView()}
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  mainTitle: {
    fontSize: '22@ms0.3',
    fontWeight: '600'
  },
  content: {
    flexDirection: 'row',
    flex: 1
  },
  left: {
    width: '40%',
    paddingTop: '14@ms0.3'
  },
  right: {
    width: '60%',
    paddingTop: '14@vs',
    padding: '14@s',
    justifyContent: 'space-between'
  },
  leftItem: {
    width: '100%',
    paddingVertical: '20@ms0.3',
    paddingRight: '15@ms0.3',
    paddingLeft: '10@ms0.3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftItemText: {
    fontSize: '14@ms0.3',
    paddingRight: '12@s',
    width: '90%'
  },
  buttonStyles: {
    marginLeft: '30@s'
  },
  buttonTextStyle: {
    fontSize: '16@ms0.3'
  },
  dateTitle: {
    fontSize: '14@ms0.3',
    marginBottom: '5@vs',
    marginTop: '10@vs'
  }
});

export default Filters;
