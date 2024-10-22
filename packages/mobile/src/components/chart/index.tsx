import React, {useMemo} from 'react';
import {View} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import type {RootState} from '@src/store';
import {ScaledSheet} from 'react-native-size-matters';
import {WINDOW_WIDTH} from '@constants/general';
import CustomText from '@components/customText';
import CustomSelector from '@components/customSelector';

type StatisticsDataType = {
  monthlyArrestResponses?: {
    [key: string]: {
      [key: string]: {
        count: number;
      };
    };
  };
} | null;

const monthsList = [
  {id: 1, label: 'Last 3 months', value: 3},
  {id: 2, label: 'Last 6 months', value: 6},
  {id: 3, label: 'Last 12 months', value: 12},
  {id: 4, label: 'Last 24 months', value: 24}
];

type Item = {
  id: number;
  label: string | number;
  type?: string;
  value?: string | number;
};

const Chart = ({
  statisticsData,
  noOfMonths,
  setNoOfMonths
}: {
  statisticsData?: StatisticsDataType;
  noOfMonths?: Item;
  setNoOfMonths?: (value: Item) => void;
}) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    chart: {
      backgroundColor: colors?.TEXT_4
    }
  };

  const generateTotalArrestData = (statisticsData) => {
    const data = statisticsData?.monthlyArrestResponses;

    if (!data) return [];

    const totalArrestData = [];

    for (const key in data) {
      const month = new Date(key).toLocaleString('default', {month: 'short'}).toUpperCase();
      const monthData = data[key];

      let total = 0;

      for (const key in monthData) total += monthData[key].count;

      totalArrestData.push({value: total, label: month, showXAxisIndex: true});
    }

    return totalArrestData;
  };

  const totalArrestData = useMemo(() => {
    return generateTotalArrestData(statisticsData);
  }, [statisticsData]);

  const colorTotalArrests = '#000';

  return (
    <View style={[themeStyle.cardBackground, styles.container]}>
      <View style={styles.rowBetween}>
        <CustomText style={styles.title}>{t('app_statistics')}</CustomText>
        {noOfMonths && (
          <CustomSelector
            item={noOfMonths}
            list={monthsList}
            style={styles.selectorStyle}
            onSelectItem={(item) => setNoOfMonths(item)}
          />
        )}
      </View>
      <View style={[styles.chart, themeStyle.chart]}>
        <LineChart
          data={totalArrestData}
          color={colorTotalArrests}
          hideRules
          yAxisColor={'transparent'}
          xAxisColor={colors?.BORDER_COLOR}
          yAxisIndicesColor={'transparent'}
          xAxisIndicesColor={'transparent'}
          yAxisTextStyle={{color: colors?.PRIMARY_TEXT}}
          xAxisLabelTextStyle={{color: colors?.PRIMARY_TEXT}}
          showYAxisIndices
          noOfSections={5}
          yAxisLabelTexts={['0', '2', '4', '6', '8', '10']}
          width={WINDOW_WIDTH - 120}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  title: {
    fontSize: '16@s',
    fontWeight: '500'
  },
  summeryContainer: {
    marginVertical: '12@s'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
  },
  summeryItem: {
    alignItems: 'center',
    width: '50%',
    paddingBottom: '12@s'
  },
  summeryText: {
    fontSize: '14@s',
    textAlign: 'left',
    paddingBottom: '4@vs'
  },
  summeryValue: {
    fontSize: '14@s',
    width: '100%',
    textAlign: 'left'
  },
  block: {
    width: '10@s',
    height: '10@s',
    borderRadius: '2@s',
    margin: '4@s',
    marginLeft: 0,
    backgroundColor: 'red'
  },
  chart: {
    paddingVertical: '12@s'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '14@s',
    justifyContent: 'space-between'
  },
  selectorStyle: {
    height: '30@s'
  }
});

export default Chart;
