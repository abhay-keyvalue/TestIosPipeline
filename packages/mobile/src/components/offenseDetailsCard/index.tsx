import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import {navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import CustomText from '@components/customText';
import EditIcon from '@components/editIcon';

type OffenseDetailsCardType = {
  criminalOffense?: string;
  articleOfCriminalCodes?: Array<{
    id?: number;
    description?: string;
    article?: string;
  }>;
  circumstances?: string;
  arrestId?: string;
};

const OffenseDetailsCard = (props: OffenseDetailsCardType) => {
  const {criminalOffense, articleOfCriminalCodes, circumstances, arrestId} = props;

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    text: {
      color: colors?.PRIMARY_TEXT
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    }
  };

  const navigateToMandatoryInformation = () => {
    navigateTo(routes.MANDATORY_INFORMATION, {arrestId, isEditAndSubmit: true});
  };

  const renderArticleOfCriminalCodes = () => {
    return articleOfCriminalCodes?.map((article) => {
      return (
        <View key={article.article}>
          <CustomText style={[themeStyle.subText, styles.smallText]}>{article.article}</CustomText>
          <CustomText numberOfLines={2} style={[themeStyle.text, styles.subText]}>
            {article.description}
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

  return (
    <View style={[styles.cardContainer, themeStyle.cardBackground]}>
      <View style={styles.titleRow}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.cardTitle, themeStyle.text]}>
          {t('arrest_details')}
        </CustomText>
        <EditIcon onPress={navigateToMandatoryInformation} />
      </View>
      <View style={styles.column}>
        {renderTitle(t('criminal_offense'))}
        <CustomText numberOfLines={2} style={styles.text}>
          {criminalOffense}
        </CustomText>
      </View>
      <View style={styles.column}>
        {renderTitle(t('article_of_criminal_code'))}
        {renderArticleOfCriminalCodes()}
      </View>
      <View style={styles.column}>
        {renderTitle(t('circumstances'))}
        <CustomText numberOfLines={4} style={[styles.text, themeStyle.subText]}>
          {circumstances}
        </CustomText>
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
    marginBottom: '10@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  column: {
    flexDirection: 'column',
    marginBottom: '8@vs'
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
    paddingTop: '3@vs'
  },
  smallText: {
    fontSize: '10@ms0.3',
    paddingTop: '6@vs',
    textTransform: 'uppercase'
  }
});

export default OffenseDetailsCard;
