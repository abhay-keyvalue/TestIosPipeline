import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import RadioActive from '@assets/svg/radioActive.svg';
import RadioInActive from '@assets/svg/radioInActive.svg';
import {fontWeights} from '@constants/general';
import CustomTextInput from '@components/customTextInput';
import CustomPhoneInput from '@components/customPhoneInput';

type CustomRadioSelectorProps = {
  onSelectItem?: (item: Item) => void;
  item?: Item;
  list: Item[];
  wrap?: boolean;
  setDefenceLawyerName?: (value: string) => void;
  setDefenceLawyerContact?: (value: string) => void;
  setDefenceLawyerEmail?: (value: string) => void;
  defenceLawyerEmail?: string;
  defenceLawyerName?: string;
  defenceLawyerContact?: string;
};

type Item = {
  id: number;
  label: string;
  type?: string;
  value?: string | number | boolean;
};

const CustomDetaineeDeclaration = ({
  onSelectItem = () => null,
  item,
  list,
  wrap = false,
  defenceLawyerName,
  defenceLawyerContact,
  defenceLawyerEmail,
  setDefenceLawyerEmail,
  setDefenceLawyerName,
  setDefenceLawyerContact
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

  const renderTitle = (title: string) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.inputTitle]}>
        {title}
      </CustomText>
    );
  };

  const renderForm = () => {
    return (
      <View>
        {renderTitle(t('name_of_lawyer'))}
        <CustomTextInput
          value={defenceLawyerName}
          onChangeText={setDefenceLawyerName}
          placeholder={t('enter_name_of_lawyer')}
        />
        {renderTitle(t('email'))}
        <CustomTextInput
          value={defenceLawyerEmail}
          onChangeText={setDefenceLawyerEmail}
          placeholder={t('email_id')}
        />
        {renderTitle(t('telephone_number'))}
        <CustomPhoneInput
          value={defenceLawyerContact}
          onChangePhoneNumber={setDefenceLawyerContact}
          placeholder={t('telephone_number_placeholder')}
        />
      </View>
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedItem?.id === item.id;

    return (
      <View key={item.id}>
        <TouchableOpacity style={styles.itemContainer} onPress={() => onPressItem(item)}>
          <View style={styles.iconContainer}>
            {isSelected ? (
              <RadioActive width={15} height={15} />
            ) : (
              <RadioInActive width={15} height={15} />
            )}
          </View>
          <CustomText style={[styles.option, themeStyle.text]}>{t(`${item.label}`)}</CustomText>
        </TouchableOpacity>
        {item?.value === 'SUSPECT_GIVEN' && isSelected && renderForm()}
      </View>
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
    marginTop: '3@vs'
  },
  iconContainer: {
    marginTop: '0@vs',
    marginRight: '2@s'
  },
  inputTitle: {
    fontSize: '13@ms0.3',
    marginBottom: '5@vs',
    marginTop: '10@vs',
    fontWeight: '500'
  }
});

export default CustomDetaineeDeclaration;
