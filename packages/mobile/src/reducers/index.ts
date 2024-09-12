import {combineReducers} from 'redux';

import homeReducer from '@screens/home/homeSlice';
import themeReducer from '@utils/themeSlice';
import localizationReducer from '@src/localization/localizationSlice';
import arrestDraftReducer from '@screens/review-arrest-details/arrestDraftSlice';
import filterReducer from '@screens/filter-screen/filterSlice';

const rootReducer = combineReducers({
  home: homeReducer,
  theme: themeReducer,
  localization: localizationReducer,
  arrestDraft: arrestDraftReducer,
  filter: filterReducer
});

export default rootReducer;
