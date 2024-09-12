import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ArrestDraftType {
  caseNumber?: string;
  stage?: string;
  createdAt?: string;
  locationName?: string;
  criminalOffence?: string;
  offences?: Array<{
    article?: string;
    description?: string;
  }>;
  circumstance?: string;
  detaineeDeclaration?: string;
  additionalInfo?: string;
  documents?: Array<{
    id?: string;
    documentType?: string;
    documentKey?: string;
    documentNumber?: string;
    documentName?: string;
  }>;
  proofDocument?: {
    id?: string;
    documentType?: string;
    documentKey?: string;
    documentNumber?: string;
    documentName?: string;
  };
  suspect?: {
    name?: string;
    gender?: string | null;
    dob?: string;
    fatherName?: string | null;
    avatar?: string | null;
    avatarThumbnail?: string | null;
    placeOfBirth?: string | null;
    nationality?: string | null;
    citizenship?: string | null;
    education?: string | null;
    profession?: string | null;
    maritalStatus?: string | null;
    isConvicted?: boolean | null;
    phoneNumber?: string | null;
    proofDocument?: {
      id?: string;
      documentNumber?: string;
      documentType?: string;
      documentKey?: string;
      documentName?: string | null;
    };
    address?: {
      district?: string | null;
      city?: string | null;
      neighborhood?: string | null;
      street?: string | null;
      palaceNumber?: string | null;
      staircaseNumber?: string | null;
    };
  };
  prosecutorDetails?: {
    name?: string;
  };
  defenseDetails?: {
    name?: string;
    phoneNumber?: string;
  };
  officerDetails?: {
    id?: string;
    name?: string;
    badgeNumber?: string;
    locationName?: string;
    deviceId?: string | null;
  };
}

export interface ArrestDraftSliceType {
  arrestDraft?: ArrestDraftType;
}

const initialState: ArrestDraftSliceType = {
  arrestDraft: {}
};

export const arrestDraftSlice = createSlice({
  name: 'arrestDraft',
  initialState,
  reducers: {
    setArrestDraft: (state, action: PayloadAction<ArrestDraftType>) => {
      state.arrestDraft = action.payload;
    },
    resetArrestDraft: () => initialState
  }
});

export const {setArrestDraft, resetArrestDraft} = arrestDraftSlice.actions;
export default arrestDraftSlice.reducer;
