import React, {useCallback, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';

import {apiMethods, endPoints} from 'shared';
import type {RootState} from '@src/store';
import {navigateTo} from '@navigation/navigationUtils';
import {routes} from '@constants/labels';
import useApi from '@api/useApi';
import CustomHeader from '@components/customHeader';
import NotificationCard from '@components/notificationCard';
import EmptyScreen from '@components/emptyScreen';
import EmptyNotifications from '@assets/svg/emptyNotifications.svg';
import CustomLoader from '@components/customLoader';

function Notifications(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();
  const {callApi, loading, data} = useApi();

  const [notifications, setNotifications] = useState([]);

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    colorPrimary: {
      color: colors.PRIMARY_COLOR
    },
    backgroundPrimary: {
      backgroundColor: colors.PRIMARY_COLOR
    },
    buttonContainer: {
      borderColor: colors?.PRIMARY_COLOR
    },
    primaryText: {
      color: colors?.PRIMARY_TEXT
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async (cursor?: string) => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.notifications,
      params: {
        pageSize: 10,
        cursor
      }
    };

    const response = await callApi(options);
    const newNotifications = response?.data?.data?.contents;

    if (newNotifications)
      setNotifications(cursor ? [...notifications, ...newNotifications] : newNotifications);
  };

  const onEndReached = () => {
    const hasNextPage = data?.data?.hasNextPage;

    if (hasNextPage && !loading) {
      const cursor = notifications?.length > 0 && notifications[notifications.length - 1]?.id;

      fetchNotifications(cursor);
    }
  };

  const updateReadStatus = async (id: string) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) return {...notification, isRead: true};

      return notification;
    });

    setNotifications(updatedNotifications);
  };

  const onPressNotification = (notification) => {
    updateReadStatus(notification.id);
    navigateTo(routes.ARREST_DETAILS, {id: notification.id});
  };

  const renderCard = ({item}) => {
    return <NotificationCard data={item} onPress={onPressNotification} />;
  };

  const renderFooter = () => {
    return (
      loading && notifications?.length > 0 && <ActivityIndicator color={colors.PRIMARY_COLOR} />
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={notifications}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notifications?.length <= 0 && styles.list}
        onRefresh={fetchNotifications}
        refreshing={false}
        onEndReached={onEndReached}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    );
  };

  const renderEmpty = () => {
    return (
      <EmptyScreen
        icon={<EmptyNotifications />}
        title={t('no_notifications')}
        description={t('no_notifications_description')}
      />
    );
  };

  const renderNotifications = () => {
    if (loading && notifications?.length === 0) return <CustomLoader />;
    else return renderList();
  };

  return (
    <View style={[styles.container, themeStyle.cardBackground]}>
      <CustomHeader title={t('notifications')} />
      <View style={styles.content}>{renderNotifications()}</View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: '12@s',
    paddingTop: '4@vs',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '6@vs'
  },
  buttonContainer: {
    paddingVertical: '4@vs',
    paddingHorizontal: '12@s',
    borderRadius: '15@s',
    borderWidth: '1@s',
    marginRight: '10@s'
  },
  buttonText: {
    fontSize: '14@ms0.3',
    fontWeight: '600'
  },
  list: {
    flex: 1
  },
  active: {
    backgroundColor: 'black'
  }
});

export default Notifications;
