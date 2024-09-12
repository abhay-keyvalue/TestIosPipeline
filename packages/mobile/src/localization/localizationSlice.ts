import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {supportedLanguages} from './i18n.config';

export interface Home {
  selectedLocalCode: string;
}

const initialState: Home = {
  selectedLocalCode: supportedLanguages[0].code
};

export const LocalizationSlice = createSlice({
  name: 'Localization',
  initialState,
  reducers: {
    setSelectedLocalCode: (state, action: PayloadAction<string>) => {
      if (action.payload) state.selectedLocalCode = action.payload;
    },
    resetLocalizationSlice: () => initialState
  }
});

export const {setSelectedLocalCode, resetLocalizationSlice} = LocalizationSlice.actions;
export default LocalizationSlice.reducer;
