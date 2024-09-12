import React, {useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import {navigateAndPush, navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import CustomText from '@components/customText';
import CustomImage from '@components/customImage';
import EditIcon from '@components/editIcon';
import Down from '@assets/svg/downArrow.svg';
import DocumentIcon from '@assets/svg/document.svg';

type SuspectInfoCardType = {
  name?: string;
  imageUrl?: string;
  criminalCode?: string;
  arrestTime?: string;
  arrestLocation?: string;
  gender?: string;
  dob?: string;
  idFileName?: string;
  documentUrl?: string;
  arrestId?: string;
};

const SuspectInfoCard = (props: SuspectInfoCardType) => {
  const {
    name,
    imageUrl,
    criminalCode,
    arrestTime,
    arrestLocation,
    gender,
    dob,
    idFileName,
    documentUrl,
    arrestId
  } = props;

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    }
  };

  const openImageViewer = (url?: string) => {
    navigateTo(routes.IMAGE_VIEWER, {imageUrl: url || ''});
  };

  const editPersonalInfo = () => {
    navigateAndPush(routes.PERSONAL_DETAILS, {arrestId, isEditAndSubmit: true});
  };

  const renderProfileImage = useMemo(
    () => imageUrl?.length > 0 && <CustomImage source={{uri: imageUrl}} />,
    [imageUrl]
  );
  const renderIDImage = useMemo(
    () => documentUrl?.length > 0 && <CustomImage source={{uri: documentUrl}} />,
    [documentUrl]
  );

  const renderHalfBox = (title: string, value: string) => {
    return (
      <View style={styles.half}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {title}
        </CustomText>
        <CustomText style={[themeStyle.text, styles.text]}>{value}</CustomText>
      </View>
    );
  };

  return (
    <View style={[styles.cardContainer, themeStyle.cardBackground]}>
      <View style={styles.titleRow}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.cardTitle, themeStyle.text]}>
          {t('suspect_information')}
        </CustomText>
        <EditIcon onPress={editPersonalInfo} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          disabled={!imageUrl}
          onPress={() => openImageViewer(imageUrl)}
          style={styles.suspectImage}
        >
          {renderProfileImage}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <CustomText
            numberOfLines={2}
            fontWeight={fontWeights.MEDIUM}
            style={[themeStyle.text, styles.title]}
          >
            {name}
          </CustomText>
          <CustomText numberOfLines={1} style={[themeStyle.text, styles.text]}>
            {criminalCode}
          </CustomText>
          <CustomText numberOfLines={1} style={[themeStyle.subText, styles.subText]}>
            {dateFormat(arrestTime, 'hh:MM, dd/mm/yy')}
          </CustomText>
          <CustomText numberOfLines={2} style={[themeStyle.subText, styles.subText]}>
            {arrestLocation}
          </CustomText>
        </View>
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('gender'), gender)}
        {renderHalfBox(t('date_of_birth'), dob)}
      </View>
      <TouchableOpacity
        style={styles.textRow}
        onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
      >
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.text, themeStyle.text]}>
          {t('additional_details')}
        </CustomText>
        <View style={styles.downArrow}>
          <Down color={colors.PRIMARY_TEXT} />
        </View>
      </TouchableOpacity>
      {showAdditionalInfo && null}
      <CustomText style={[themeStyle.text, styles.text]}>{t('id_card')}</CustomText>
      <View style={[styles.IdContainer, themeStyle.background]}>
        <View style={styles.textRow}>
          <View style={styles.documentIcon}>
            <DocumentIcon color={colors.PRIMARY_TEXT} />
          </View>
          <CustomText style={[themeStyle.text, styles.text]}>{idFileName}</CustomText>
        </View>
        <TouchableOpacity
          disabled={!documentUrl}
          onPress={() => openImageViewer(documentUrl)}
          style={styles.idImage}
        >
          {renderIDImage}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  cardContainer: {
    padding: '12@s',
    borderRadius: '8@s',
    marginBottom: '16@vs'
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '12@vs'
  },
  textContainer: {
    marginLeft: '12@s',
    flex: 1
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '5@vs'
  },
  subText: {
    fontSize: '12@ms0.3',
    paddingTop: '5@vs'
  },
  suspectImage: {
    width: '90@ms0.3',
    height: '90@ms0.3',
    borderRadius: '12@s',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  },
  title: {
    fontSize: '18@ms0.3',
    fontWeight: '600'
  },
  half: {
    width: '50%'
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '12@vs'
  },
  downArrow: {
    marginLeft: '5@s',
    marginTop: '7@vs'
  },
  IdContainer: {
    marginBottom: '10@vs',
    marginTop: '10@vs',
    padding: '12@s',
    borderRadius: '8@s'
  },
  idImage: {
    width: '100%',
    height: '80@s',
    borderRadius: '5@s',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  },
  documentIcon: {
    marginRight: '10@s',
    marginTop: '5@vs'
  }
});

export default SuspectInfoCard;
