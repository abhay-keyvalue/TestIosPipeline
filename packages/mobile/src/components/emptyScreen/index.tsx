import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {WINDOW_HEIGHT} from '@constants/general';
import CustomText from '@components/customText';

type EmptyScreenProps = {
  icon?: React.ReactNode;
  title?: string;
  description: string;
};

const EmptyScreen = ({icon, title, description}: EmptyScreenProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    text: {
      color: colors.PRIMARY_TEXT
    }
  };

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {title && <CustomText style={[styles.title, themeStyle.text]}>{title}</CustomText>}
      {description && (
        <CustomText style={[styles.description, themeStyle.text]}>{description}</CustomText>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20@s',
    minHeight: WINDOW_HEIGHT * 0.6
  },
  title: {
    fontSize: '16@s',
    fontWeight: '500',
    marginTop: '10@s'
  },
  description: {
    fontSize: '14@s',
    marginTop: '8@s',
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: WINDOW_HEIGHT * 0.1
  },
  iconContainer: {
    width: '80@s',
    height: '80@s',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EmptyScreen;
