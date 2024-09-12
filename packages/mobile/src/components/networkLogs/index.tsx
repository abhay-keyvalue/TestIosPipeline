import React, {memo, useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, SafeAreaView, TouchableOpacity, Modal} from 'react-native';
import NetworkLogger, {startNetworkLogging} from 'react-native-network-logger';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';

const NetworkLogs = ({onPress}: {onPress?: () => void}) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const [isNetworkModalVisible, setIsNetworkVIsible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    startNetworkLogging({forceEnable: true});
  }, []);

  const themeStyle = {
    background: {
      backgroundColor: colors.PRIMARY_BACKGROUND
    },
    primaryColorBackground: {
      backgroundColor: `${colors.PRIMARY_COLOR}99`
    },
    primary: {
      color: colors.PRIMARY_TEXT
    },
    border: {
      borderColor: colors.BORDER_COLOR
    }
  };

  const theme = {
    colors: {
      background: colors.PRIMARY_BACKGROUND,
      link: colors.PRIMARY_COLOR,
      card: colors.LIGHT,
      text: colors.PRIMARY_TEXT
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
      onPanResponderGrant: () => {
        pan.setOffset({x: pan.x._value, y: pan.y._value});
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  return (
    <>
      <Modal
        style={styles.modal}
        visible={isNetworkModalVisible}
        animationType='slide'
        onRequestClose={() => setIsNetworkVIsible(false)}
        transparent={false}
      >
        <SafeAreaView style={[styles.contentContainer, themeStyle.background]}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsNetworkVIsible(false)}>
            <CustomText style={[styles.close, themeStyle.primary]}>Close</CustomText>
          </TouchableOpacity>
          <NetworkLogger theme={theme} maxRows={100} compact />
        </SafeAreaView>
      </Modal>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {transform: [{translateX: pan.x}, {translateY: pan.y}]},
          styles.container,
          themeStyle.primaryColorBackground,
          themeStyle.border
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            onPress && onPress();
            setIsNetworkVIsible(true);
          }}
        >
          <CustomText style={styles.content}>Logs</CustomText>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = ScaledSheet.create({
  modal: {
    margin: 0
  },
  container: {
    width: '50@s',
    height: '50@s',
    position: 'absolute',
    right: '20@s',
    bottom: '20@vs',
    borderRadius: '25@s',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  content: {
    fontSize: '10@s',
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFF'
  },
  contentContainer: {
    flex: 1,
    padding: '12@s'
  },
  closeButton: {
    width: '100%',
    height: '40@s',
    justifyContent: 'center',
    alignItems: 'center'
  },
  close: {
    fontSize: '17@s',
    fontWeight: '600'
  }
});

export default memo(NetworkLogs);
