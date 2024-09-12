import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Modal, View, FlatList} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {WINDOW_HEIGHT, isIOS} from '@constants/general';
import {countryCodes} from '@utils/countryCodes';
import CustomText from '@components/customText';
import DownArrow from '@assets/svg/downArrow.svg';
import SearchBox from '@components/searchBox';

type CountryCodeSelectorProps = {
  onSelectItem?: (item: string) => void;
  value?: string;
};

type Item = {
  name: string;
  dial_code?: string;
  code?: string | number;
};

const initialCountryCode = {
  name: 'Albania',
  dial_code: '+355',
  code: 'AL'
};

const CountryCodeSelector = ({onSelectItem = () => null, value}: CountryCodeSelectorProps) => {
  const {t} = useTranslation();
  const {colors} = useSelector((state: RootState) => state.theme);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(initialCountryCode);
  const [keyword, setKeyword] = useState('');
  const [codeList, setCodeList] = useState<Item[]>(countryCodes);

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
    const filteredList = countryCodes.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) || item.dial_code.includes(keyword)
    );

    setCodeList(filteredList);
  }, [keyword]);

  useEffect(() => {
    if (value) {
      const updateValue = countryCodes?.filter((item) => item.dial_code === value)[0];

      setSelectedItem(updateValue);
    }
  }, [value]);

  const onPressCard = (item: Item) => {
    setSelectedItem(item);
    onSelectItem(item.dial_code);
    setVisible(false);
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      style={[styles.cardContainer, themeStyle.border]}
      onPress={() => onPressCard(item)}
    >
      <CustomText style={styles.option}>{`${item?.dial_code} ${item?.name}`}</CustomText>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBox onChangeText={setKeyword} placeholder={t('search_criminal_code_text')} />
    </View>
  );

  const renderSelector = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.selectorBox, themeStyle.border]}
      >
        <CustomText style={[styles.placeholder, themeStyle.textStyle]}>
          {selectedItem?.dial_code}
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
            {renderHeader()}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={codeList}
              keyExtractor={(item) => item?.name?.toString()}
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
    height: WINDOW_HEIGHT * 0.7,
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
    borderRadius: '5@ms',
    height: isIOS ? '40@vs' : '45@vs',
    paddingHorizontal: '8@ms',
    marginRight: '8@s',
    paddingVertical: '5@vs',
    minWidth: '70@ms'
  },
  placeholder: {
    fontSize: '14@ms',
    fontWeight: '400',
    marginRight: '5@s'
  },
  iconContainer: {
    marginTop: '2@vs',
    marginRight: '2@s'
  },
  header: {
    marginBottom: '10@vs'
  }
});

export default CountryCodeSelector;
