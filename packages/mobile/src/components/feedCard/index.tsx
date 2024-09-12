import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';

type FeedCardProps = {
  onPress?: () => void;
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  subTitleIcon: React.ReactNode;
};

const FeedCard = ({
  onPress = () => {},
  icon,
  title = '',
  subTitle = '',
  subTitleIcon = null
}: FeedCardProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    container: {
      backgroundColor: colors.CARD_BACKGROUND
    },
    text: {
      color: colors.PRIMARY_TEXT
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[styles.container, themeStyle.container]}
    >
      <View style={styles.textContainer}>
        {title?.length > 0 && (
          <CustomText style={[styles.title, themeStyle.text]}>{title}</CustomText>
        )}
        <View style={styles.row}>
          {subTitle?.length > 0 && (
            <CustomText style={[styles.subTitle, subTitleIcon && styles.semiBold, themeStyle.text]}>
              {subTitle}
            </CustomText>
          )}
          {subTitleIcon}
        </View>
      </View>
      {icon && <View>{icon}</View>}
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  container: {
    minHeight: '80@vs',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: '7@vs',
    padding: '18@s'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: '14@ms0.3',
    fontWeight: '400',
    marginBottom: '4@vs',
    textTransform: 'uppercase'
  },
  subTitle: {
    fontSize: '14@ms0.3',
    fontWeight: '700',
    paddingRight: '4@s',
    textTransform: 'uppercase'
  },
  textContainer: {
    justifyContent: 'center'
  },
  semiBold: {
    fontWeight: '600'
  }
});

export default FeedCard;
