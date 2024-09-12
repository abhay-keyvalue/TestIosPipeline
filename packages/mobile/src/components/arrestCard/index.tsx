import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {arrestStages} from '@constants/general';
import CustomText from '@components/customText';
import LiveCounter from '@components/liveCounter';
import CustomImage from '@components/customImage';
import ProsecutionIcon from '@assets/svg/prosecutionIcon.svg';
import CourtHammer from '@assets/svg/courtHammer.svg';
import Tick from '@assets/svg/tick.svg';
import Cross from '@assets/svg/cross.svg';
import Shield from '@assets/svg/shield.svg';
import RightArrow from '@assets/svg/rightArrow.svg';

type ArrestCardProps = {
  onPress?: () => void;
  arrestData?: {
    suspectName?: string;
    id?: string;
    stage?: string;
    locationName?: string;
    createdAt?: string;
    caseNumber?: string;
    criminalOffence?: string;
    prosecutorName?: string;
    actionDate?: string;
    avatarThumbnail?: string;
    stageChangeTime?: string;
  };
};

const ArrestCard = ({onPress = () => {}, arrestData = {}}: ArrestCardProps) => {
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

  const {
    suspectName,
    id,
    stage,
    locationName,
    createdAt,
    caseNumber,
    criminalOffence,
    prosecutorName,
    avatarThumbnail,
    stageChangeTime
  } = arrestData;

  const renderAvatarThumbnail = useMemo(
    () => avatarThumbnail?.length && <CustomImage source={{uri: avatarThumbnail}} />,
    [avatarThumbnail]
  );

  const renderLeftView = () => {
    return (
      <View style={styles.leftContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>{renderAvatarThumbnail}</View>
          <View style={styles.textContainer}>
            <CustomText numberOfLines={1} style={styles.title}>
              {suspectName}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {caseNumber}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {dateFormat(new Date(createdAt), 'hh:MM, dd/mm/yy')}
            </CustomText>
            <CustomText numberOfLines={1} style={[styles.subTitle, themeStyle.subText]}>
              {locationName}
            </CustomText>
          </View>
        </View>
        <CustomText style={[styles.subTitle, themeStyle.subText]}>{t('prosecutor')}</CustomText>
        <CustomText style={styles.text}>{prosecutorName || '_ _'}</CustomText>
        <CustomText style={[styles.subTitle, themeStyle.subText]}>
          {t('primary_offense')}
        </CustomText>
        <CustomText style={styles.text}>{criminalOffence || '_ _'}</CustomText>
      </View>
    );
  };

  const renderActionStatusIcon = useMemo(() => {
    switch (stage) {
      case arrestStages.RELEASED:
        return <Tick color={colors.PRIMARY_TEXT} />;
      case arrestStages.DETAINED:
        return <Cross color={colors.PRIMARY_TEXT} />;
      case arrestStages.PROSECUTION_REVIEW:
        return <ProsecutionIcon color={colors.PRIMARY_TEXT} />;
      case arrestStages.COURT_REVIEW:
        return <CourtHammer color={colors.PRIMARY_TEXT} />;
      case arrestStages.DRAFT:
        return <Shield color={colors.PRIMARY_TEXT} />;
      default:
        return null;
    }
  }, [stage]);

  const offsetHours = useMemo(() => {
    switch (stage) {
      case arrestStages.DRAFT:
        return 10;
      case arrestStages.PROSECUTION_REVIEW:
        return 48;
      case arrestStages.COURT_REVIEW:
        return 48;
      default:
        return 0;
    }
  }, [stageChangeTime]);

  const renderCompleteArrestLabel = () => {
    return (
      <View style={[styles.completeLabelRow, themeStyle.redBackground]}>
        <CustomText style={[styles.subTitle, themeStyle.redText]}>
          {t('complete_arrest_details')}
        </CustomText>
        <RightArrow color={colors.RED} />
      </View>
    );
  };

  const renderRightView = () => {
    return (
      <View style={styles.rightContainer}>
        <View style={styles.iconContainer}>{renderActionStatusIcon}</View>
        {stage === arrestStages.RELEASED || stage === arrestStages.DETAINED ? (
          <>
            <CustomText style={styles.status}>{stage}</CustomText>
            <CustomText style={styles.statusDate}>
              {dateFormat(new Date(stageChangeTime), 'dd mmm yyyy')}
            </CustomText>
            <CustomText style={styles.statusDate}>
              {dateFormat(new Date(stageChangeTime), 'h MM TT')}
            </CustomText>
          </>
        ) : (
          <LiveCounter stageChangeTime={stageChangeTime} offsetHours={offsetHours} />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, themeStyle.container]}
      activeOpacity={0.5}
      onPress={onPress}
      key={id}
    >
      <View style={styles.container}>
        {renderLeftView()}
        {renderRightView()}
      </View>
      {stage === arrestStages.DRAFT && renderCompleteArrestLabel()}
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: '8@s',
    marginVertical: '7@vs',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12@s'
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
    paddingRight: '4@s',
    paddingBottom: '6@vs'
  },
  leftContainer: {
    borderRadius: '5@s',
    padding: '6@s',
    width: '65%',
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E5E5E526'
  },
  rightContainer: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '6@s',
    overflow: 'hidden'
  },
  semiBold: {
    fontWeight: '600'
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
  iconContainer: {
    marginBottom: '8@vs'
  },
  status: {
    fontSize: '15@ms0.3',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  statusDate: {
    fontSize: '10@ms0.3',
    fontWeight: '500',
    textTransform: 'uppercase',
    paddingTop: '2@vs'
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
  }
});

export default ArrestCard;
