import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '@screens/login';
import ForgotPassword from '@screens/forgot-password';
import Initializing from '@screens/initializing';
import MandatoryInformation from '@screens/mandatory-information';
import PersonalDetails from '@screens/personal-details';
import ResidentialDetails from '@screens/residential-details';
import AdditionalInfo from '@screens/additional-Info';
import ReviewArrestDetails from '@screens/review-arrest-details';
import ArrestDetails from '@screens/arrest-details';
import ImageViewer from '@screens/image-viewer';
import Filters from '@screens/filter-screen';
import type * as ScreenTypes from '@interface/navigation';
import {setTopLevelNavigator} from './navigationUtils';
import BottomTabs from './tabNavigator';

export type RootStackParamList = {
  Initializing: undefined;
  Login: undefined;
  HomeTabs: ScreenTypes.BottomTabsParams;
  ForgotPassword: {email: string};
  MandatoryInformation: undefined;
  PersonalDetails: {arrestId: string; isEditAndSubmit?: boolean};
  ResidentialDetails: {arrestId: string; isEditAndSubmit?: boolean};
  AdditionalInfo: {arrestId: string; isEditAndSubmit?: boolean};
  ReviewArrestDetails: {arrestId: string};
  ArrestDetails: {arrestId: string};
  ImageViewer: {imageUrl: string};
  Filters: undefined;
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
      <Stack.Screen
        name='ForgotPassword'
        component={ForgotPassword}
        options={{headerShown: false}}
      />
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
      <Stack.Screen name='ImageViewer' component={ImageViewer} options={{headerShown: false}} />
      <Stack.Screen name='ArrestDetails' component={ArrestDetails} options={{headerShown: false}} />
      <Stack.Screen name='Filters' component={Filters} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Root;
