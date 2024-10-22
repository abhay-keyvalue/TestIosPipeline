import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {apiMethods, endPoints} from 'shared';
import {fontWeights} from '@constants/general';
import useApi from '@api/useApi';
import CustomText from '@components/customText';
import CustomImage from '@components/customImage';

type NotificationCardProps = {
  onPress?: (data) => void;
  data: {
    id: string;
    arrestId: string;
    title: string;
    isRead: boolean;
    createdAt: string;
    thumbnail?: string;
    message?: string;
    caseNumber?: string;
  };
};

const NotificationCard = ({onPress = () => {}, data}: NotificationCardProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {callApi} = useApi();

  const themeStyle = {
    container: {
      backgroundColor: colors.BACKGROUND_PRIMARY
    },
    text: {
      color: colors.PRIMARY_TEXT
    },
    subText: {
      color: colors.SECONDARY_TEXT
    },
    unread: {
      backgroundColor: `${colors.PRIMARY_COLOR}1A`
    }
  };

  const {id, caseNumber, title, thumbnail, message, isRead, createdAt} = data;

  const readNotification = async () => {
    const options = {
      method: apiMethods.post,
      endpoint: endPoints.readNotification,
      params: {id}
    };

    await callApi(options);
  };

  const onPressNotification = async () => {
    if (!isRead) await readNotification();
    onPress(data);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPressNotification}
      key={id}
      style={[styles.container, isRead ? themeStyle.container : themeStyle.unread]}
    >
      <View style={styles.image}>
        {thumbnail?.length > 0 && <CustomImage source={{uri: thumbnail}} />}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <CustomText numberOfLines={2} style={[styles.id, themeStyle.subText]}>
            <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.title, themeStyle.text]}>
              {title || "Suspect's Name"}
            </CustomText>
            {'  '}
            {caseNumber || 'CASE-ID'}
          </CustomText>
        </View>
        {message?.length > 0 && <CustomText style={styles.message}>{message}</CustomText>}
        {createdAt?.length > 0 && (
          <CustomText style={[styles.date, themeStyle.subText]}>
            {dateFormat(new Date(createdAt), 'HH:MM, dd/mm/yyyy')}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  container: {
    minHeight: '50@vs',
    width: '100%',
    flexDirection: 'row',
    borderRadius: '10@s',
    marginBottom: '12@vs',
    padding: '12@s'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4@vs'
  },
  image: {
    width: '40@ms',
    height: '40@ms',
    borderRadius: '20@ms',
    backgroundColor: '#E5E5E5',
    overflow: 'hidden'
  },
  textContainer: {
    justifyContent: 'center',
    marginLeft: '10@s',
    flex: 1
  },
  title: {
    fontSize: '13@ms0.3',
    fontWeight: '600',
    paddingRight: '5@s'
  },
  id: {
    fontSize: '10@ms0.3',
    fontWeight: '400'
  },
  message: {
    fontSize: '12@ms0.3',
    fontWeight: '400',
    paddingBottom: '5@vs'
  },
  date: {
    fontSize: '10@ms0.3',
    fontWeight: '400'
  },
  semiBold: {
    fontWeight: '600'
  }
});

export default NotificationCard;
