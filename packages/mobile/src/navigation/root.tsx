import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '@screens/login';
import ResetPassword from '@screens/reset-password';
import Initializing from '@screens/initializing';
import MandatoryInformation from '@screens/mandatory-information';
import PersonalDetails from '@screens/personal-details';
import ResidentialDetails from '@screens/residential-details';
import AdditionalInfo from '@screens/additional-Info';
import ReviewArrestDetails from '@screens/review-arrest-details';
import ArrestDetails from '@screens/arrest-details';
import ArrestDetailsV2 from '@screens/arrest-details-v2';
import ImageViewer from '@screens/image-viewer';
import Filters from '@screens/filter-screen';
import SettingsAndPrivacy from '@screens/settings-and-privacy';
import type * as ScreenTypes from '@interface/navigation';
import {setTopLevelNavigator} from './navigationUtils';
import BottomTabs from './tabNavigator';

export type RootStackParamList = {
  Initializing: undefined;
  Login: undefined;
  HomeTabs: ScreenTypes.BottomTabsParams;
  ResetPassword: {token: string};
  MandatoryInformation: undefined;
  PersonalDetails: {arrestId: string; isEditAndSubmit?: boolean};
  ResidentialDetails: {arrestId: string; isEditAndSubmit?: boolean};
  AdditionalInfo: {arrestId: string; isEditAndSubmit?: boolean};
  ReviewArrestDetails: {arrestId: string};
  ArrestDetails: {arrestId: string};
  ImageViewer: {imageUrl: string};
  Filters: undefined;
  SettingsAndPrivacy: undefined;
  ArrestDetailsV2: {arrestId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Root = () => (
  <NavigationContainer
    ref={(navigatorRef) => {
      setTopLevelNavigator(navigatorRef);
    }}
  >
    <Stack.Navigator>
      <Stack.Screen name='Initializing' component={Initializing} options={{headerShown: false}} />
      <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
      <Stack.Screen name='ResetPassword' component={ResetPassword} options={{headerShown: false}} />
      <Stack.Screen name='HomeTabs' component={BottomTabs} options={{headerShown: false}} />
      <Stack.Screen
        name='MandatoryInformation'
        component={MandatoryInformation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PersonalDetails'
        component={PersonalDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ResidentialDetails'
        component={ResidentialDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='AdditionalInfo'
        component={AdditionalInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ReviewArrestDetails'
        component={ReviewArrestDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SettingsAndPrivacy'
        component={SettingsAndPrivacy}
        options={{headerShown: false}}
      />
      <Stack.Screen name='ImageViewer' component={ImageViewer} options={{headerShown: false}} />
      <Stack.Screen name='ArrestDetails' component={ArrestDetails} options={{headerShown: false}} />
      <Stack.Screen
        name='ArrestDetailsV2'
        component={ArrestDetailsV2}
        options={{headerShown: false}}
      />
      <Stack.Screen name='Filters' component={Filters} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Root;
