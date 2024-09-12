// TO DO: CustomRadioSelector
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import RadioActive from '@assets/svg/radioActive.svg';
import RadioInActive from '@assets/svg/radioInActive.svg';

type CustomRadioSelectorProps = {
  onSelectItem?: (item: Item) => void;
  item?: Item;
  list: Item[];
  wrap?: boolean;
};

type Item = {
  id: number;
  label: string;
  type?: string;
  value?: string | number | boolean;
};

const CustomRadioSelector = ({
  onSelectItem = () => null,
  item,
  list,
  wrap = false
}: CustomRadioSelectorProps) => {
  const {t} = useTranslation();
  const {colors} = useSelector((state: RootState) => state.theme);
  const [selectedItem, setSelectedItem] = useState<Item | null>(item);

  const themeStyle = {
    text: {
      color: colors?.PRIMARY_TEXT
    }
  };

  useEffect(() => {
    setSelectedItem(item);
  }, [item]);

  const onPressItem = (item: Item) => {
    setSelectedItem(item);
    onSelectItem && onSelectItem(item);
  };

  const renderItem = ({item}) => {
    const isSelected = selectedItem?.id === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.itemContainer}
        onPress={() => onPressItem(item)}
      >
        <View style={styles.iconContainer}>
          {isSelected ? (
            <RadioActive width={15} height={15} />
          ) : (
            <RadioInActive width={15} height={15} />
          )}
        </View>
        <CustomText style={[styles.option, themeStyle.text]}>{t(`${item.label}`)}</CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, wrap && styles.wrap]}>
      {list?.map((item) => renderItem({item}))}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  text: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingRight: '5@s'
  },
  option: {
    paddingVertical: '4@vs',
    fontSize: '14@ms',
    fontWeight: '400',
    paddingLeft: '4@s',
    paddingRight: '16@s'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3@vs',
    minHeight: '36@vs'
  },
  iconContainer: {
    marginTop: '0@vs',
    marginRight: '2@s'
  }
});

export default CustomRadioSelector;
