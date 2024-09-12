import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';

import type {RootState} from '@src/store';
import {routes} from '@constants/labels';
import {apiMethods, endPoints} from 'shared';
import {navigateTo} from '@navigation/navigationUtils';
import {arrestStages, arrestStagesLabels} from '@constants/general';
import {setSelectedFilterData} from '@screens/filter-screen/filterSlice';
import {setArrestDraft} from '@screens/review-arrest-details/arrestDraftSlice';
import SortSheet from '@components/sortSheet';
import useApi from '@api/useApi';
import SearchBox from '@components/searchBox';
import CustomText from '@components/customText';
import CustomHeader from '@components/customHeader';
import EmptyScreen from '@components/emptyScreen';
import ArrestCard from '@components/arrestCard';
import CustomLoader from '@components/customLoader';
import EmptyArrests from '@assets/svg/emptyArrests.svg';
import Filter from '@assets/svg/filter.svg';
import Close from '@assets/svg/close.svg';

function Arrests(): React.JSX.Element {
  const {colors} = useSelector((state: RootState) => state.theme);
  const selectedFilterData = useSelector((state: RootState) => state.filter.selectedFilterData);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {callApi, loading, data} = useApi();

  const [keyword, setKeyword] = useState(null);
  const [arrestList, setArrestList] = useState([]);
  const {stage} = selectedFilterData;

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    border: {
      borderColor: colors?.BORDER_COLOR
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setArrestDraft({}));
    }, [])
  );

  useEffect(() => {
    setArrestList([]);
    fetchArrestList();
  }, [keyword, JSON.stringify(selectedFilterData)]);

  const onChangeText = (text: string) => {
    setKeyword(text);
  };

  const fetchArrestList = async (cursor?: string) => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.arrests,
      params: {
        pageSize: 10,
        cursor,
        stages: stage,
        keyword
      }
    };

    const response = await callApi(options);
    const newArrestList = response?.data?.data?.contents;

    if (newArrestList) setArrestList(cursor ? [...arrestList, ...newArrestList] : newArrestList);
  };

  const onEndReached = () => {
    const hasNextPage = data?.data?.hasNextPage;

    if (arrestList?.length > 0 && hasNextPage && !loading) {
      const cursor = arrestList?.length > 0 && arrestList[arrestList.length - 1]?.id;

      fetchArrestList(cursor);
    }
  };

  const navigateToMandatoryInformation = (id) => {
    navigateTo(routes.MANDATORY_INFORMATION, {arrestId: id});
  };

  const navigateArrestDetails = (id) => {
    navigateTo(routes.ARREST_DETAILS, {arrestId: id});
  };

  const onPressArrestCard = (item) => {
    switch (item.stage) {
      case arrestStages.DRAFT:
        navigateToMandatoryInformation(item.id);
        break;

      default:
        navigateArrestDetails(item.id);
    }
  };

  const onRefresh = () => {
    dispatch(setSelectedFilterData({}));
    fetchArrestList(null);
  };

  const openFilters = () => {
    navigateTo(routes.FILTERS);
  };

  const onPressFilterItem = () => {
    dispatch(setSelectedFilterData({stage: null}));
  };

  const renderCard = ({item}) => {
    return <ArrestCard arrestData={item} onPress={() => onPressArrestCard(item)} />;
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <EmptyScreen
        icon={<EmptyArrests />}
        title={t('no_Arrests')}
        description={t('no_Arrests_description')}
      />
    );
  };

  const renderFooter = () => {
    return loading && arrestList?.length > 0 && <ActivityIndicator color={colors.PRIMARY_COLOR} />;
  };

  const renderList = () => {
    return (
      <View style={styles.flatListContainer}>
        <FlatList
          data={arrestList}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          onRefresh={onRefresh}
          refreshing={false}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={onEndReached}
        />
      </View>
    );
  };

  const renderFilterList = () => {
    return (
      <View style={styles.filterList}>
        <ScrollView horizontal>
          <TouchableOpacity onPress={openFilters} style={[styles.chip, themeStyle.border]}>
            <Filter />
            <CustomText style={styles.filterText}>{t('Filter')}</CustomText>
          </TouchableOpacity>
          <SortSheet />
          {stage?.length > 0 && (
            <TouchableOpacity onPress={onPressFilterItem} style={[styles.chip, themeStyle.border]}>
              <CustomText style={styles.stage}>{arrestStagesLabels[stage]}</CustomText>
              <Close width={10} height={10} color={colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <CustomHeader
        title={t('arrests')}
        showBadge
        badgeCount={arrestList?.length > 0 && arrestList?.length}
      />
      <View style={styles.content}>
        <SearchBox
          onChangeText={onChangeText}
          value={keyword}
          placeholder={t('search_arrest_text')}
        />
        {renderFilterList()}
        {renderList()}
      </View>
      {loading && !(arrestList?.length > 0) && <CustomLoader />}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingBottom: 0,
    flex: 1,
    justifyContent: 'flex-start'
  },
  flatList: {
    paddingBottom: '120@vs'
  },
  flatListContainer: {
    flex: 1
  },
  filterList: {
    height: '50@vs'
  },
  chip: {
    borderRadius: '6@s',
    paddingVertical: '5@s',
    paddingHorizontal: '10@s',
    marginTop: '12@s',
    marginRight: '10@s',
    marginBottom: '5@s',
    borderWidth: '1@s',
    justifyContent: 'center',
    flex: 1,
    height: '30@vs',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stage: {
    fontSize: '12@ms',
    fontWeight: '600',
    paddingRight: '5@s',
    paddingBottom: '2@s'
  },
  filterText: {
    fontSize: '12@ms',
    fontWeight: '600',
    paddingLeft: '5@s',
    paddingBottom: '2@s'
  }
});

export default Arrests;
