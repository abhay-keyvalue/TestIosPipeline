import React, {useMemo, useState} from 'react';
import {TouchableOpacity, Modal, View, FlatList, ActivityIndicator} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {supportedLanguages} from '@src/localization/i18n.config';
import {WINDOW_HEIGHT} from '@constants/general';
import {setSelectedLocalCode} from '@src/localization/localizationSlice';
import {showToast} from '@components/customToast';
import {apiMethods, endPoints} from 'shared';
import {setUserLanguage} from '@screens/home/homeSlice';
import CustomText from '@components/customText';
import useApi from '@api/useApi';
import DownArrow from '@assets/svg/downArrow.svg';

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const {colors} = useSelector((state: RootState) => state.theme);
  const {i18n, t} = useTranslation();
  const {callApi, loading} = useApi();
  const {selectedLocalCode} = useSelector((state: RootState) => state.localization);

  const [modalVisible, setModalVisible] = useState(false);

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    textStyle: {
      color: colors?.PRIMARY_TEXT
    },
    selectedTextStyle: {
      color: colors?.PRIMARY_COLOR
    }
  };

  const changeLanguageHandler = async (language) => {
    const options = {
      method: apiMethods.patch,
      endpoint: endPoints.users,
      data: {language}
    };

    setModalVisible(false);

    try {
      const response = await callApi(options);

      if (response?.data?.statusCode === 200) {
        i18n.changeLanguage(language);
        dispatch(setUserLanguage({userLanguage: language}));
        dispatch(setSelectedLocalCode(language));
      } else {
        showToast(t('error_selecting_language'), {type: 'error'});
      }
    } catch (error) {
      showToast(t('error_selecting_language'), {type: 'error'});
    }
  };

  const languageLabel = useMemo(() => {
    switch (String(selectedLocalCode)) {
      case 'en_US':
        return 'EN';
      case 'sq_AL':
        return 'AL';
      default:
        return 'EN';
    }
  }, [selectedLocalCode]);

  const renderLanguageCard = ({item}) => (
    <TouchableOpacity onPress={() => changeLanguageHandler(item.code)}>
      <CustomText
        style={[
          styles.languageOption,
          item.code === selectedLocalCode && themeStyle.selectedTextStyle
        ]}
      >
        {`${item.label} (${item.code})`}
      </CustomText>
    </TouchableOpacity>
  );

  const renderModel = () => {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.outSide} onPress={() => setModalVisible(false)} />
          <View style={[styles.modalContent, themeStyle.cardBackground]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={supportedLanguages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageCard}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        {loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <CustomText style={[styles.text, themeStyle.textStyle]}>{languageLabel}</CustomText>
        )}
        <DownArrow color={colors.PRIMARY_TEXT} />
      </TouchableOpacity>
      {renderModel()}
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10@ms',
    minWidth: '80@ms'
  },
  text: {
    fontSize: '14@ms',
    fontWeight: '600',
    textTransform: 'uppercase',
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
    borderTopLeftRadius: '8@ms',
    borderTopRightRadius: '8@ms',
    width: '100%',
    maxHeight: WINDOW_HEIGHT * 0.8,
    paddingBottom: '30@vs'
  },
  languageOption: {
    paddingVertical: '8@vs',
    fontSize: '14@ms',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  activityIndicator: {
    paddingRight: '5@s'
  }
});

export default LanguageSelector;
