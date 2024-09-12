import React, {useEffect} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import {Toast, ToastProvider} from '@components/customToast';
import {isAndroid} from '@constants/general';
import {persistor, store} from '@src/store';
import Init from '@src/init';

function App(): React.JSX.Element {
  useEffect(() => {
    if (isAndroid) SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <Init />
          <Toast />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
