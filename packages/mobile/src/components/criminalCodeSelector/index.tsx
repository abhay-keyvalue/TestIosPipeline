import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Modal, View, FlatList, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {t} from 'i18next';

import type {RootState} from '@src/store';
import {fontWeights, hitSlop} from '@constants/general';
import {apiMethods, endPoints} from 'shared';
import useApi from '@api/useApi';
import CustomLoader from '@components/customLoader';
import EmptyScreen from '@components/emptyScreen';
import CustomText from '@components/customText';
import CustomButton from '@components/customButton';
import SearchBox from '@components/searchBox';
import Check from '@assets/svg/check.svg';
import Uncheck from '@assets/svg/uncheck.svg';
import DownArrow from '@assets/svg/downArrow.svg';
import Close from '@assets/svg/close.svg';
import styles from './styles';

type CriminalCodeSelectorProps = {
  onSelectItems?: (items: Item[]) => void;
  selectedList?: Item[];
};

type Item = {
  id: string;
  description: string;
  article: string;
};

const CriminalCodeSelector = ({
  onSelectItems = () => {},
  selectedList
}: CriminalCodeSelectorProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {callApi, loading, data} = useApi();

  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>(selectedList);
  const [criminalOffenses, setCriminalOffenses] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState('');

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
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
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    },
    selectedItem: {
      backgroundColor: colors?.BORDER_COLOR
    }
  };

  useEffect(() => {
    setSelectedItems(selectedList);
  }, [selectedList]);

  useEffect(() => {
    getCriminalCodes();
  }, [searchText]);

  const getCriminalCodes = async (cursor?: string) => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.offence,
      params: {
        pageSize: 10,
        cursor,
        keyword: searchText
      }
    };

    const response = await callApi(options);
    const newOffenses = response?.data?.data?.contents;

    if (newOffenses)
      setCriminalOffenses(cursor ? [...criminalOffenses, ...newOffenses] : newOffenses);
  };

  const onPressItem = (item: Item) => {
    const index = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id);

    if (index > -1) {
      const newItems = [...selectedItems];

      newItems.splice(index, 1);
      setSelectedItems(newItems);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const onSubmit = () => {
    setVisible(false);
    onSelectItems(selectedItems);
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const renderCard = ({item}) => {
    const isSelected = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) > -1;

    return (
      <TouchableOpacity
        style={[styles.cardContainer, themeStyle.border]}
        activeOpacity={0.8}
        onPress={() => onPressItem(item)}
      >
        <View style={styles.checkbox}>{isSelected ? <Check /> : <Uncheck />}</View>
        <View style={styles.textContainer}>
          <CustomText style={[styles.article, themeStyle.subText]}>{item.article}</CustomText>
          <CustomText style={[styles.label, themeStyle.textStyle]}>{item.description}</CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.title, themeStyle.textStyle]}>
        {t('criminal_code_ALBANIA_title')}
      </CustomText>
      <SearchBox onChangeText={onChangeText} placeholder={t('search_criminal_code_text')} />
    </View>
  );

  const renderButtonContainer = () => (
    <View style={styles.buttonContainer}>
      <CustomButton
        style={[styles.button, styles.transparent]}
        textStyle={themeStyle.textStyle}
        title={t('cancel')}
        onPress={() => setVisible(false)}
      />
      <CustomButton
        disabled={selectedItems?.length === 0}
        style={styles.button}
        title={t('submit')}
        onPress={onSubmit}
      />
    </View>
  );

  const renderSelectedItems = () => {
    return (
      <View style={styles.selectedItemsContainer}>
        {selectedItems.map((item) => (
          <View key={item.id} style={[styles.selectedItem, themeStyle.selectedItem]}>
            <View>
              <CustomText style={[styles.selectedItemTitle, themeStyle.subText]}>
                {item.article}
              </CustomText>
              <CustomText style={styles.selectedItemText}>{item.description}</CustomText>
            </View>
            <TouchableOpacity
              hitSlop={hitSlop}
              style={styles.closeIcon}
              onPress={() => onPressItem(item)}
            >
              <Close height={12} width={12} color={colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderSelector = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={[styles.selectorBox, themeStyle.border]}
        >
          <CustomText style={[styles.placeholder, themeStyle.placeHolder]}>
            {t('select_penal_section')}
          </CustomText>
          <View style={styles.iconContainer}>
            <DownArrow width={12} height={12} color={`${colors?.PRIMARY_TEXT}80`} />
          </View>
        </TouchableOpacity>
        {renderSelectedItems()}
      </>
    );
  };

  const renderEmpty = () => {
    if (loading) return <CustomLoader />;

    return (
      <EmptyScreen title={t('no_criminal_codes')} description={t('no_criminal_description')} />
    );
  };

  const onEndReached = () => {
    const hasNextPage = data?.data?.hasNextPage;

    if (hasNextPage && !loading) {
      const cursor =
        criminalOffenses?.length > 0 && criminalOffenses[criminalOffenses.length - 1]?.id;

      getCriminalCodes(cursor);
    }
  };

  const renderFooter = () => {
    return (
      loading &&
      criminalOffenses?.length > 0 && (
        <ActivityIndicator size='small' color={colors.PRIMARY_COLOR} />
      )
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
              data={criminalOffenses}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={renderCard}
              contentContainerStyle={styles.list}
              onRefresh={getCriminalCodes}
              refreshing={false}
              onEndReached={onEndReached}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
            />
            {renderButtonContainer()}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CriminalCodeSelector;
