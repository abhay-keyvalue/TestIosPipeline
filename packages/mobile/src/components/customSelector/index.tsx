import React, {useEffect, useState} from 'react';
import type {RegisteredStyle} from 'react-native';
import {TouchableOpacity, Modal, View, FlatList} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {WINDOW_HEIGHT, isIOS} from '@constants/general';
import CustomText from '@components/customText';
import DownArrow from '@assets/svg/downArrow.svg';

type CustomSelectorProps = {
  onSelectItem?: (item: Item) => void;
  item?: Item;
  list: Item[];
  placeHolder?: string;
  title?: string;
  style?: RegisteredStyle<{[key: string]: string | number}>;
};

type Item = {
  id: number;
  label: string | number;
  type?: string;
  value?: string | number;
};

const CustomSelector = ({
  onSelectItem = () => null,
  item,
  list,
  placeHolder,
  title,
  style
}: CustomSelectorProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(item);

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
    setSelectedItem(item);
  }, [item]);

  const onPressCard = (item: Item) => {
    setSelectedItem(item);
    onSelectItem && onSelectItem(item);
    setVisible(false);
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      style={[styles.cardContainer, themeStyle.border]}
      onPress={() => onPressCard(item)}
    >
      <CustomText style={styles.option}>{t(`${item.label}`)}</CustomText>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <CustomText style={[styles.title, themeStyle.textStyle]}>{title}</CustomText>
  );

  const renderSelector = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.selectorBox, themeStyle.border, style]}
      >
        <CustomText
          style={[
            styles.placeholder,
            selectedItem?.label ? themeStyle.textStyle : themeStyle.placeHolder
          ]}
        >
          {selectedItem?.label ? t(`${selectedItem?.label}`) : placeHolder}
        </CustomText>
        <View style={styles.iconContainer}>
          <DownArrow width={12} height={12} color={`${colors?.PRIMARY_TEXT}80`} />
        </View>
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
            {title?.length > 0 && renderHeader()}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={list}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={renderCard}
            />
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
    paddingBottom: '30@vs'
  },
  option: {
    paddingVertical: '8@vs',
    fontSize: '14@ms',
    fontWeight: '400'
  },
  activityIndicator: {
    paddingRight: '5@s'
  },
  cardContainer: {
    borderWidth: 1,
    paddingHorizontal: '10@ms',
    paddingVertical: '2@vs',
    borderRadius: '4@ms',
    overflow: 'hidden',
    marginBottom: '8@vs'
  },
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: '4@ms',
    height: isIOS ? '40@vs' : '45@vs',
    paddingHorizontal: '8@ms',
    paddingVertical: '5@vs'
  },
  placeholder: {
    fontSize: '14@ms',
    fontWeight: '400'
  },
  iconContainer: {
    marginTop: '2@vs',
    marginRight: '2@s',
    marginLeft: '2@s'
  }
});

export default CustomSelector;
