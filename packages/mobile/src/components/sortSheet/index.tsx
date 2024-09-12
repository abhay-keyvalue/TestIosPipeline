import React, {useState} from 'react';
import {TouchableOpacity, Modal, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {WINDOW_HEIGHT, sortList} from '@constants/general';
import {setSelectedFilterData} from '@screens/filter-screen/filterSlice';
import CustomRadioSelector from '@components/customRadioSelector';
import CustomText from '@components/customText';
import DownArrow from '@assets/svg/downArrow.svg';

type Item = {
  id: number;
  label: string;
  type?: string;
  value?: string | number;
};

const SortSheet = () => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const selectedFilterData = useSelector((state: RootState) => state.filter.selectedFilterData);
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const selectedItem = selectedFilterData?.sort || sortList[0];
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

  const onSelectItem = (item: Item) => {
    dispatch(setSelectedFilterData({sort: item}));
    setVisible(false);
  };

  const renderSelector = () => {
    return (
      <TouchableOpacity onPress={() => setVisible(true)} style={[styles.chip, themeStyle.border]}>
        <CustomText style={styles.stage}>{t('sort')}</CustomText>
        <DownArrow color={colors.PRIMARY_TEXT} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderSelector()}
      <Modal
        animationType='slide'
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.outSide} onPress={() => setVisible(false)} />
          <View style={[styles.modalContent, themeStyle.cardBackground]}>
            <CustomText style={[styles.title, themeStyle.textStyle]}>{t('sort_by')}</CustomText>
            <CustomRadioSelector list={sortList} onSelectItem={onSelectItem} item={selectedItem} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = ScaledSheet.create({
  title: {
    fontSize: '16@ms',
    fontWeight: '600',
    marginBottom: '14@vs',
    marginTop: '10@vs'
  },
  text: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingRight: '5@s'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  outSide: {
    flex: 1
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '16@ms',
    borderTopLeftRadius: '20@ms',
    borderTopRightRadius: '20@ms',
    width: '100%',
    maxHeight: WINDOW_HEIGHT * 0.8,
    paddingBottom: '30@vs',
    minHeight: WINDOW_HEIGHT * 0.25
  },
  chip: {
    borderRadius: '6@s',
    paddingVertical: '5@s',
    paddingHorizontal: '10@s',
    marginTop: '12@s',
    marginRight: '10@s',
    marginBottom: '5@s',
    borderWidth: '1@s',
    justifyContent: 'center',
    flex: 1,
    height: '30@vs',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stage: {
    fontSize: '12@ms',
    fontWeight: '600',
    paddingHorizontal: '5@s',
    paddingBottom: '2@s'
  }
});

export default SortSheet;
