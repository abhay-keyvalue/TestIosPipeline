import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '@screens/home';
import Notifications from '@screens/notifications';
import Profile from '@screens/profile';
import Arrests from '@screens/arrests';
import HomeActive from '@assets/svg/homeActive.svg';
import HomeInactive from '@assets/svg/homeInactive.svg';
import NotificationsActive from '@assets/svg/notificationsActive.svg';
import NotificationsInactive from '@assets/svg/notificationsInactive.svg';
import ProfileActive from '@assets/svg/profileActive.svg';
import ProfileInactive from '@assets/svg/profileInactive.svg';
import ArrestsInactive from '@assets/svg/arrestsInactive.svg';
import ArrestsActive from '@assets/svg/arrestsActive.svg';
import {useSelector} from 'react-redux';
import type {RootState} from '@src/store';
import {ScaledSheet} from 'react-native-size-matters';
import {View} from 'react-native';
import {isIOS} from '@constants/general';
import CustomText from '@components/customText';

interface icons {
  Home: JSX.Element;
  Notifications: JSX.Element;
  Profile: JSX.Element;
  Arrests: JSX.Element;
}

export type BottomTabParamList = {
  Home: undefined;
  Arrests: {stage?: string};
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const renderTabBarIcon = (route: string, focused: boolean, colors: {[key: string]: string}) => {
  const ActiveColor = colors.PRIMARY_COLOR;
  const focusedIcons: icons = {
    Home: <HomeActive />,
    Arrests: <ArrestsActive />,
    Notifications: <NotificationsActive />,
    Profile: <ProfileActive />
  };

  const unfocusedIcons: icons = {
    Home: <HomeInactive color={colors.PRIMARY_TEXT} />,
    Arrests: <ArrestsInactive color={colors.PRIMARY_TEXT} />,
    Notifications: <NotificationsInactive color={colors.PRIMARY_TEXT} />,
    Profile: <ProfileInactive color={colors.PRIMARY_TEXT} />
  };

  return (
    <View style={[styles.iconContainer, focused && {borderTopColor: ActiveColor}]}>
      {focused ? focusedIcons[route as keyof icons] : unfocusedIcons[route as keyof icons]}
    </View>
  );
};

const BottomTabs = () => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {hideArrestTab} = useSelector((state: RootState) => state.feature);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => renderTabBarIcon(route.name, focused, colors),
        headerShown: false,
        tabBarLabel: ({focused}) => {
          return (
            <CustomText
              style={[
                styles.tabText,
                {color: focused ? colors.PRIMARY_COLOR : colors.PRIMARY_TEXT}
              ]}
            >
              {route.name}
            </CustomText>
          );
        },
        tabBarStyle: [styles.tabBar, {backgroundColor: colors.CARD_BACKGROUND}],
        tabBarInactiveTintColor: colors.PRIMARY_TEXT,
        tabBarActiveTintColor: colors.PRIMARY_COLOR
      })}
    >
      <Tab.Screen options={{headerShown: false}} name='Home' component={Home} />
      {!hideArrestTab && (
        <Tab.Screen options={{headerShown: false}} name='Arrests' component={Arrests} />
      )}
      <Tab.Screen options={{headerShown: false}} name='Notifications' component={Notifications} />
      <Tab.Screen options={{headerShown: false}} name='Profile' component={Profile} />
    </Tab.Navigator>
  );
};

const styles = ScaledSheet.create({
  tabText: {
    fontFamily: 'Inter-Regular',
    fontSize: '11@ms',
    paddingTop: '3@vs'
  },
  tabBar: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    paddingTop: 0,
    paddingBottom: 10,
    borderWidth: 0
  },
  iconContainer: {
    paddingTop: 5,
    marginTop: isIOS ? 0 : 1,
    width: 75,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'transparent'
  }
});

export default BottomTabs;
