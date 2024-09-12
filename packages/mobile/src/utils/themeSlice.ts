import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

import {Theme} from '@interface/common';
import {colors} from 'shared';

export interface ThemeState {
  selectedTheme: Theme;
  colors: {[key: string]: string};
}

const initialState: ThemeState = {
  selectedTheme: Theme.LIGHT,
  colors: colors.light
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeData: (state, action: PayloadAction<Theme>) => {
      state.selectedTheme = action.payload;
      state.colors = colors[action.payload];
    }
  }
});

export const {setThemeData} = themeSlice.actions;
export default themeSlice.reducer;
