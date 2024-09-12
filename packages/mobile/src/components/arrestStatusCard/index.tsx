import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import CustomText from '@components/customText';
import Court from '@assets/svg/courtHammer.svg';
import Shield from '@assets/svg/shield.svg';
import Tick from '@assets/svg/tick.svg';

type ArrestStatusCardType = {
  status?: string;
  type?: string;
};

const ArrestStatusCard = ({status, type}: ArrestStatusCardType) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const statusColor = useMemo(() => {
    switch (type) {
      case 'court':
        return colors?.GREEN;
      case 'police':
        return colors?.PRIMARY_COLOR;
      default:
        return colors?.GREEN;
    }
  }, [type]);

  const statusIcon = useMemo(() => {
    switch (type) {
      case 'court':
        return <Court color={statusColor} width={15} height={15} />;
      case 'police':
        return <Shield width={15} height={15} />;
      default:
        return <Tick width={15} height={15} />;
    }
  }, [type]);

  return (
    <View
      style={[styles.container, {borderColor: statusColor, backgroundColor: `${statusColor}1A`}]}
    >
      <View style={styles.iconContainer}>{statusIcon}</View>
      <CustomText numberOfLines={2} style={[styles.text, {color: statusColor}]}>
        {status}
      </CustomText>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: '1@s',
    borderRadius: '10@s',
    flex: 1,
    overflow: 'hidden',
    padding: '6@s'
  },
  text: {
    marginLeft: '4@s',
    fontSize: '13@s',
    flex: 1
  },
  iconContainer: {
    width: '20@s',
    height: '20@vs',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ArrestStatusCard;
