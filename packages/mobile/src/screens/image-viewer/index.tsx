import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

import {WINDOW_WIDTH, hitSlop} from '@constants/general';
import {popScreens} from '@navigation/navigationUtils';
import Close from '@assets/svg/close.svg';

const ImageViewer = (params) => {
  const routeParams = params?.route?.params;
  const close = () => {
    popScreens(1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity hitSlop={hitSlop} style={styles.close} onPress={close}>
        <Close color={'#FFF'} width={20} height={20} />
      </TouchableOpacity>
      <Image source={{uri: routeParams?.imageUrl}} style={styles.content} />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 2
  },
  content: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH
  },
  close: {
    position: 'absolute',
    top: '5@s',
    right: '5@s',
    padding: '10@s'
  }
});

export default ImageViewer;
