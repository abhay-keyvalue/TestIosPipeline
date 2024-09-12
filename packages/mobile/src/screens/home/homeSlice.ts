import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

interface profileData {
  avatar?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  policeStation?: string;
  location?: string;
  badgeNumber?: string;
}
export interface Home {
  profileData: profileData;
}

const initialState: Home = {
  profileData: {}
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<profileData>) => {
      state.profileData = action.payload;
    },
    setUserLanguage: (state, action: PayloadAction<profileData>) => {
      state.profileData = {...state.profileData, ...action.payload};
    },
    resetHomeSlice: () => initialState
  }
});

export const {setProfileData, setUserLanguage, resetHomeSlice} = homeSlice.actions;
export default homeSlice.reducer;
