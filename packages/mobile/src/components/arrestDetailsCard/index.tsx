import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {defenceAssignmentList, fontWeights} from '@constants/general';
import type {ArrestDraftType} from '@screens/review-arrest-details/arrestDraftSlice';
import CustomText from '@components/customText';
import CustomImage from '@components/customImage';
import styles from './styles';

const ArrestDetailsCard = ({arrestDetails}: {arrestDetails: ArrestDraftType}) => {
  const {
    offences,
    createdAt,
    locationName,
    criminalOffence,
    circumstance,
    detaineeDeclaration,
    additionalInfo,
    suspect,
    defenseDetails,
    documents
  } = arrestDetails || {};
  const {
    gender,
    dob,
    fatherName,
    placeOfBirth,
    nationality,
    citizenship,
    education,
    profession,
    maritalStatus,
    phoneNumber,
    isConvicted,
    address
  } = suspect || {};

  const {district, city, neighborhood, street, palaceNumber, staircaseNumber} = address || {};

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const [viewMore, setViewMore] = useState(false);

  const themeStyle = {
    text: {
      color: colors?.PRIMARY_TEXT
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    },
    line: {
      backgroundColor: colors?.BORDER_COLOR
    }
  };

  const renderArticleOfCriminalCodes = () => {
    return offences?.map((offence) => {
      return (
        <View key={offence.article}>
          <CustomText style={[themeStyle.subText, styles.smallText]}>{offence.article}</CustomText>
          <CustomText numberOfLines={2} style={[themeStyle.text, styles.subText]}>
            {offence.description}
          </CustomText>
        </View>
      );
    });
  };

  const renderTitle = (title) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={styles.text}>
        {title}
      </CustomText>
    );
  };

  const renderHalfBox = (title: string, value: string) => {
    return (
      <View style={styles.half}>
        <CustomText
          numberOfLines={2}
          fontWeight={fontWeights.MEDIUM}
          style={[themeStyle.text, styles.text]}
        >
          {title}
        </CustomText>
        <CustomText numberOfLines={2} style={[themeStyle.text, styles.text]}>
          {value || '-'}
        </CustomText>
      </View>
    );
  };

  const renderColumn = (title: string, value: string) => {
    return (
      <View key={title} style={styles.column}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {title}
        </CustomText>
        <CustomText numberOfLines={2} style={[themeStyle.text, styles.text]}>
          {value || '-'}
        </CustomText>
      </View>
    );
  };

  const renderViewMore = () => {
    return (
      <TouchableOpacity onPress={() => setViewMore(!viewMore)} style={styles.viewMoreContainer}>
        <CustomText style={[themeStyle.primary]}>
          {viewMore ? t('view_less') : t('view_more')}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderPhotos = () => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.imageContainer}
      >
        {documents?.length > 0 ? (
          documents?.map((photo, index) => (
            <CustomImage style={styles.photo} key={index} source={{uri: photo?.documentKey}} />
          ))
        ) : (
          <CustomText style={[themeStyle.text, styles.text]}>{t('-')}</CustomText>
        )}
      </ScrollView>
    );
  };

  const listSeparator = <View style={[styles.separator, themeStyle.line]} />;

  const renderMoreData = () => {
    let detaineeDeclarationLabel = '';

    defenceAssignmentList.map((item) => {
      if (item.value === detaineeDeclaration) detaineeDeclarationLabel = item.label;
    });

    return (
      <>
        {listSeparator}
        <View style={styles.row}>
          {renderHalfBox(t('gender'), gender)}
          {renderHalfBox(t('date_of_birth'), dob)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('arrest_time_date'), dateFormat(createdAt, 'hh:MM, dd/mm/yyyy'))}
          {renderHalfBox(t('arrest_location'), locationName)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('place_of_birth'), placeOfBirth)}
          {renderHalfBox(t('father_name'), fatherName)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('nationality'), nationality)}
          {renderHalfBox(t('citizenship'), citizenship)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('education'), education)}
          {renderHalfBox(t('profession'), profession)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('material_status'), maritalStatus)}
          {renderHalfBox(t('convicted'), isConvicted ? t('yes') : t('no'))}
        </View>
        {listSeparator}
        <View style={styles.row}>
          {renderHalfBox(t('district'), district)}
          {renderHalfBox(t('city_municipality'), city)}
        </View>
        <View style={styles.row}>
          {renderHalfBox(t('neighborhood'), neighborhood)}
          {renderHalfBox(t('street'), street)}
        </View>
        {renderColumn(t('private_house_palace_number'), palaceNumber)}
        <View style={styles.row}>
          {renderHalfBox(t('staircase_number'), staircaseNumber)}
          {renderHalfBox(t('telephone_number'), phoneNumber)}
        </View>
        {listSeparator}
        {renderColumn(t('detainee_declaration'), t(`${detaineeDeclarationLabel}`))}
        <View style={styles.row}>
          {renderHalfBox(t('lawyer_name'), defenseDetails?.name)}
          {renderHalfBox(t('lawyer_telephone'), defenseDetails?.phoneNumber)}
        </View>
        {renderColumn(t('additional_information'), additionalInfo)}
        <View style={styles.column}>
          {renderTitle(t('additional_photos'))}
          {renderPhotos()}
        </View>
        {renderViewMore()}
      </>
    );
  };

  const renderListData = () => {
    return (
      <View>
        {renderColumn(t('criminal_offense'), criminalOffence)}
        <View style={styles.column}>
          {renderTitle(t('article_of_criminal_code'))}
          {renderArticleOfCriminalCodes()}
        </View>
        <View style={styles.column}>
          {renderTitle(t('circumstances'))}
          <CustomText numberOfLines={4} style={[styles.text, themeStyle.subText]}>
            {circumstance}
          </CustomText>
        </View>
        {!viewMore && renderViewMore()}
        {viewMore && renderMoreData()}
      </View>
    );
  };

  return (
    <View style={[styles.cardContainer, themeStyle.cardBackground]}>
      <View style={styles.titleRow}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.cardTitle, themeStyle.text]}>
          {t('arrest_details')}
        </CustomText>
      </View>
      {renderListData()}
    </View>
  );
};

export default ArrestDetailsCard;
