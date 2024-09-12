import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';
import dateFormat from 'dateformat';

import {fontWeights} from '@constants/general';
import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import CourtHammer from '@assets/svg/courtHammer.svg';
import Shield from '@assets/svg/shield.svg';
import Alarm from '@assets/svg/notificationIcon.svg';
import ProsecutionIcon from '@assets/svg/prosecutionIcon.svg';

type ActivityTimelineType = {
  timeline?: Array<TimelineItemType>;
};

type TimelineItemType = {id?: number; message?: string; activityType?: string; createdAt?: string};

const ActivityTimeline = ({timeline}: ActivityTimelineType) => {
  const {t} = useTranslation();
  const {colors} = useSelector((state: RootState) => state.theme);
  const [viewMore, setViewMore] = React.useState(true);

  const themeStyle = {
    container: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    iconBackground: {
      backgroundColor: colors?.BORDER_COLOR
    },
    dash: {
      backgroundColor: colors?.BORDER_COLOR
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    }
  };

  const timelineToShow = viewMore ? timeline?.slice(0, 4) : timeline;

  const VerticalDashedLine = (
    <View style={styles.dashedContainer}>
      {[...Array(7)].map((_, index) => (
        <View key={index} style={[styles.dash, themeStyle.dash]} />
      ))}
    </View>
  );

  const getIcon = (type) => {
    switch (type) {
      case 'Police':
        return <Shield width={14} height={14} color={colors.PRIMARY_TEXT} />;
      case 'Court':
        return <CourtHammer width={14} height={14} color={colors.PRIMARY_TEXT} />;
      case 'Reminder':
        return <Alarm width={14} height={14} color={colors.PRIMARY_TEXT} />;
      case 'Prosecution':
        return <ProsecutionIcon width={14} height={14} color={colors.PRIMARY_TEXT} />;
      default:
        return <Alarm width={14} height={14} color={colors.PRIMARY_TEXT} />;
    }
  };

  const renderTimelineItem = (item, index) => {
    const {id, createdAt, message, activityType}: TimelineItemType = item;

    return (
      <View key={id} style={styles.timelineItem}>
        <View style={styles.leftContainer}>
          <View style={[styles.iconContainer, themeStyle.iconBackground]}>
            {getIcon(activityType)}
          </View>
          {index < timelineToShow?.length - 1 && VerticalDashedLine}
        </View>
        <View style={styles.textContainer}>
          <CustomText numberOfLines={2} style={themeStyle.text}>
            {message}
          </CustomText>
          <CustomText style={[themeStyle.text, styles.subText]}>
            {dateFormat(createdAt, 'hh:MM, dd/mm/yyyy')}
          </CustomText>
        </View>
      </View>
    );
  };

  const renderViewMore = () => {
    return (
      <TouchableOpacity onPress={() => setViewMore(!viewMore)} style={styles.viewMoreContainer}>
        <CustomText style={[themeStyle.primary]}>
          {viewMore ? t('view_more') : t('view_less')}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomText
        fontWeight={fontWeights.MEDIUM}
        numberOfLines={2}
        style={[styles.title, themeStyle.text]}
      >
        {t('activity_timeline')}
      </CustomText>
      {timelineToShow?.map((item, index) => {
        return renderTimelineItem(item, index);
      })}
      {timeline?.length > 4 && renderViewMore()}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderRadius: '10@s',
    flex: 1,
    overflow: 'hidden',
    padding: '10@s',
    marginBottom: '16@vs'
  },
  text: {
    marginLeft: '4@s',
    fontSize: '14@s',
    flex: 1
  },
  subText: {
    fontSize: '12@s',
    paddingTop: '4@vs'
  },
  title: {
    fontSize: '18@s',
    marginBottom: '10@s',
    fontWeight: '600'
  },
  timelineItem: {
    flexDirection: 'row'
  },
  textContainer: {
    paddingBottom: '12@vs',
    paddingLeft: '8@s',
    flex: 1
  },
  leftContainer: {
    flexDirection: 'column'
  },
  iconContainer: {
    width: '30@s',
    height: '30@s',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15@s',
    overflow: 'hidden'
  },
  dottedLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 1,
    marginHorizontal: '14@s'
  },
  dashedContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: '14@s'
  },
  dash: {
    width: 2,
    height: 4,
    borderRadius: 1,
    marginBottom: 3
  },
  viewMoreContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8@s'
  }
});

export default ActivityTimeline;
