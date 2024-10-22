import {combineReducers} from 'redux';

import homeReducer from '@screens/home/homeSlice';
import themeReducer from '@utils/themeSlice';
import localizationReducer from '@src/localization/localizationSlice';
import arrestDraftReducer from '@screens/review-arrest-details/arrestDraftSlice';
import filterReducer from '@screens/filter-screen/filterSlice';
import featureReducer from '@utils/featureSlice';

const rootReducer = combineReducers({
  home: homeReducer,
  theme: themeReducer,
  localization: localizationReducer,
  arrestDraft: arrestDraftReducer,
  filter: filterReducer,
  feature: featureReducer
});

export default rootReducer;
