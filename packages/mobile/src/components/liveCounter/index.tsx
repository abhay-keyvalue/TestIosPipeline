import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';

import CustomText from '@components/customText';

const LiveCounter = ({
  stageChangeTime,
  offsetHours
}: {
  stageChangeTime: string;
  offsetHours?: number;
}) => {
  const {t} = useTranslation();

  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  useEffect(() => {
    calculateTimeDifference();
    const interval = setInterval(() => {
      calculateTimeDifference();
    }, 60000);

    return () => clearInterval(interval);
  }, [stageChangeTime]);

  const calculateTimeDifference = () => {
    const givenDate = new Date(stageChangeTime);

    givenDate.setHours(givenDate.getHours() + offsetHours);
    const endDate = givenDate.getTime();
    const currentDate = new Date().getTime();
    const diffMs = endDate < currentDate ? 0 : endDate - currentDate;
    const diffDate = new Date(diffMs);

    const hours =
      Math.floor(diffDate.getUTCHours() + (diffDate.getUTCDate() - 1) * 24).toString() || '00';
    const minutes = diffDate.getUTCMinutes().toString() || '00';

    setHours(hours?.length === 1 ? `0${hours}` : hours);
    setMinutes(minutes?.length === 1 ? `0${minutes}` : minutes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <View style={styles.row}>
          <View style={styles.timeBox}>
            <CustomText style={styles.time}>{hours[0]}</CustomText>
          </View>
          <View style={styles.timeBox}>
            <CustomText style={styles.time}>{hours[1]}</CustomText>
          </View>
        </View>
        <CustomText style={styles.text}>{t('hrs')}</CustomText>
      </View>
      <CustomText style={styles.colon}>:</CustomText>
      <View style={styles.block}>
        <View style={styles.row}>
          <View style={styles.timeBox}>
            <CustomText style={styles.time}>{minutes[0]}</CustomText>
          </View>
          <View style={styles.timeBox}>
            <CustomText style={styles.time}>{minutes[1]}</CustomText>
          </View>
        </View>
        <CustomText style={styles.text}>{t('min')}</CustomText>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row'
  },
  text: {
    fontSize: '12@ms0.3',
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4@vs'
  },
  timeBox: {
    borderRadius: '3@s',
    borderWidth: '1@s',
    borderColor: 'red',
    marginHorizontal: '2@s',
    width: '20@ms',
    height: '22@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  time: {
    fontSize: '15@ms0.3',
    fontWeight: '700'
  },
  block: {
    alignItems: 'center'
  },
  colon: {
    fontSize: '17@s',
    fontWeight: '700'
  }
});

export default LiveCounter;
