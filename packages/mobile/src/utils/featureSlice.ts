import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface FeatureState {
  hideArrestTab?: boolean;
  collectMinimumDetails?: boolean;
}

const initialState: FeatureState = {
  hideArrestTab: true,
  collectMinimumDetails: true
};

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    toggleArrestTabFeature: (state, action: PayloadAction<boolean>) => {
      state.hideArrestTab = action.payload;
    },
    toggleCollectMinimumDetailsFlag: (state, action: PayloadAction<boolean>) => {
      state.collectMinimumDetails = action.payload;
    }
  }
});

export const {toggleArrestTabFeature, toggleCollectMinimumDetailsFlag} = featureSlice.actions;
export default featureSlice.reducer;
