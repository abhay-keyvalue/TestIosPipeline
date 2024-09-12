import React, {createContext, useState, useCallback, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';

type ToastOptions = {
  position?: 'top' | 'bottom';
  type?: 'info' | 'error' | 'success';
  style?: object;
};

const defaultOptions: ToastOptions = {
  position: 'bottom',
  type: 'info',
  style: {}
};

export const ToastContext = createContext({
  toast: {
    visible: false,
    message: '',
    ...defaultOptions
  }
});
let showToast;

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    ...defaultOptions
  });

  showToast = useCallback((message: string, options: ToastOptions = defaultOptions) => {
    setToast({visible: true, message, ...options});
    setTimeout(() => setToast({visible: false, message: '', ...defaultOptions}), 3000);
  }, []);

  return <ToastContext.Provider value={{toast}}>{children}</ToastContext.Provider>;
};

export {showToast};

export const Toast = () => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {toast} = useContext(ToastContext);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'error':
        return {backgroundColor: colors.RED, color: colors.LIGHT};
      case 'success':
        return {backgroundColor: colors.PRIMARY_COLOR, color: colors.LIGHT};
      case 'info':
      default:
        return {backgroundColor: colors.PRIMARY_COLOR, color: colors.LIGHT};
    }
  };

  const themeStyle = {
    toast: {
      backgroundColor: colors?.PRIMARY_BACKGROUND,
      ...getTypeStyle(toast.type),
      ...toast.style
    },
    toastText: {
      color: colors?.PRIMARY_TEXT,
      ...getTypeStyle(toast.type),
      ...toast.style
    }
  };

  if (!toast.visible) return null;

  const toastPositionStyle = toast.position === 'top' ? {top: 20} : {bottom: 100};

  return (
    <View style={[styles.toast, themeStyle.toast, toastPositionStyle]}>
      <CustomText style={[styles.toastText, themeStyle.toastText]}>{toast.message}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderColor: '#D6D6D6B3',
    borderWidth: 1,
    padding: 10,
    margin: 20,
    borderRadius: 5,
    maxHeight: 100,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
