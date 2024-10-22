import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import CustomImage from '@components/customImage';

type ArrestCardMinProps = {
  onPress?: () => void;
  arrestData?: {
    arrestId?: string;
    caseNumber?: string;
    dateOfArrest?: string;
    criminalOffence?: string;
    stage?: string;
    suspect?: {
      id?: string;
      name?: string;
      avatarThumbnail?: string;
    };
    locationName?: string;
  };
};

const ArrestCardMin = ({onPress = () => {}, arrestData = {}}: ArrestCardMinProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    container: {
      backgroundColor: colors.CARD_BACKGROUND
    },
    subText: {
      color: colors.SECONDARY_TEXT
    },
    redText: {
      color: colors.RED
    },
    redBackground: {
      backgroundColor: `${colors.RED}1A`
    }
  };

  const {suspect, arrestId, locationName, dateOfArrest, caseNumber, criminalOffence} = arrestData;

  const {name, avatarThumbnail} = suspect || {};

  const renderAvatarThumbnail = useMemo(
    () => avatarThumbnail?.length && <CustomImage source={{uri: avatarThumbnail}} />,
    [avatarThumbnail]
  );

  const renderCardDetails = () => {
    return (
      <View style={styles.leftContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>{renderAvatarThumbnail}</View>
          <View style={styles.textContainer}>
            <CustomText numberOfLines={1} style={styles.title}>
              {name}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {caseNumber}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {dateFormat(new Date(dateOfArrest), 'hh:MM, dd/mm/yy')}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {locationName}
            </CustomText>
          </View>
        </View>
        <View style={styles.primaryOffenseContainer}>
          <CustomText style={[styles.subTitle, themeStyle.subText]}>
            {t('primary_offense')}
          </CustomText>
          <CustomText style={styles.text}>{criminalOffence || '_ _'}</CustomText>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, themeStyle.container]}
      activeOpacity={0.5}
      onPress={onPress}
      key={arrestId}
    >
      <View style={styles.container}>{renderCardDetails()}</View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: '8@s',
    marginBottom: '12@vs',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5@s'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '6@vs'
  },
  title: {
    fontSize: '14@ms0.3',
    fontWeight: '700',
    marginBottom: '4@vs'
  },
  subTitle: {
    fontSize: '10@ms0.3',
    fontWeight: '600',
    paddingRight: '4@s',
    textTransform: 'uppercase',
    paddingBottom: '2@vs'
  },
  text: {
    fontSize: '12@ms0.3',
    fontWeight: '400',
    paddingRight: '4@s'
  },
  leftContainer: {
    borderRadius: '5@s',
    padding: '6@s',
    width: '65%',
    flex: 1,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '60@ms',
    height: '60@ms',
    borderRadius: '8@ms',
    borderColor: '#E5E5E5',
    backgroundColor: '#E5E5E5',
    marginRight: '8@s',
    borderWidth: 1,
    overflow: 'hidden'
  },
  containerContainer: {
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    paddingRight: '4@s'
  },
  completeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '8@s',
    paddingHorizontal: '11@s'
  },
  primaryOffenseContainer: {
    padding: '7@s',
    borderRadius: '5@s',
    backgroundColor: '#FAFAFA'
  }
});

export default ArrestCardMin;
