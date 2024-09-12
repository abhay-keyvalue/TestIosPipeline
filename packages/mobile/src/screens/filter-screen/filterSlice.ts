import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

type Item = {
  id: number;
  label: string;
  value: string;
};

export interface SelectedFilterDataType {
  caseStatus?: Item;
  gender?: Item;
  prosecutor?: Item;
  dateRange?: string[];
  stage?: string;
  sort?: Item;
}

export interface Filter {
  selectedFilterData: SelectedFilterDataType;
}

const initialState: Filter = {
  selectedFilterData: {}
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedFilterData: (state, action: PayloadAction<SelectedFilterDataType>) => {
      state.selectedFilterData = {...state.selectedFilterData, ...action.payload};
    },
    resetSelectedFilters: () => initialState
  }
});

export const {setSelectedFilterData, resetSelectedFilters} = filterSlice.actions;
export default filterSlice.reducer;
