/* eslint-disable @typescript-eslint/no-explicit-any */
import {CommonActions, StackActions} from '@react-navigation/native';

let navigator: any;

export const setTopLevelNavigator = (navigatorRef: any) => {
  navigator = navigatorRef;
};

export const navigateAndReset = (routeName: string, params?: Record<string, any>) => {
  if (navigator)
    navigator.dispatch(
      CommonActions.reset({
        routes: [{name: routeName, params: params || {}}]
      })
    );
};

export const navigateToNestedScreen = (
  routeName: string,
  nestedRouteName: string,
  params?: Record<string, any>
) => {
  if (navigator)
    navigator.dispatch(
      CommonActions.navigate({
        name: routeName,
        params: {
          screen: nestedRouteName,
          params: params || {}
        }
      })
    );
};

export const goBack = () => {
  if (navigator?.canGoBack()) navigator.goBack();
};

export const navigateTo = (routeName: string, params?: Record<string, any>) => {
  if (navigator) navigator.navigate(routeName, params || {});
};

export const navigateAndReplace = (routeName: string, params?: Record<string, any>) => {
  if (navigator) navigator.dispatch(StackActions.replace(routeName, params || {}));
};

export const navigateAndPush = (routeName: string, params?: Record<string, any>) => {
  if (navigator) {
    const pushAction = StackActions.push(routeName, params || {});

    navigator.dispatch(pushAction);
  }
};

export const navigateAndResetToIndex = (index: number, routes?: any) => {
  if (navigator)
    navigator.dispatch(
      CommonActions.reset({
        index,
        routes
      })
    );
};

export const popScreens = (count = 1) => {
  if (navigator) navigator.dispatch(StackActions.pop(count));
};
