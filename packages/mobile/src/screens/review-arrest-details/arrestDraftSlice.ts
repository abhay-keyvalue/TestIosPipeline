import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ArrestDraftType {
  createdAt?: string;
  locationData?: {
    locRoad?: string;
    locSuburb?: string;
    locCity?: string;
    locCounty?: string;
    locStateDistrict?: string;
    locState?: string;
    locPostcode?: string;
  };
  caseNumber?: string;
  isIdRefused?: boolean;
  locationName?: string;
  criminalOffence?: string;
  circumstance?: string;
  detaineeDeclaration?: string;
  additionalInfo?: string;
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
  district?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  palaceNumber?: string | null;
  staircaseNumber?: string | null;
  defenceAssignment?: string | null;
  offences?: Array<{
    id?: string;
    article?: string;
    description?: string;
  }>;
  userImage?: {
    mediaLocalUrl?: string;
    mediaType?: string;
    mediaKey?: string;
    mediaName?: string;
  };
  circumstanceRecording?: {
    mediaLocalUrl?: string;
    mediaType?: string;
    mediaKey?: string;
    mediaName?: string;
    documentKey?: string;
  };
  documents?: Array<{
    mediaLocalUrl?: string;
    mediaType?: string;
    mediaKey?: string;
    mediaName?: string;
  }>;
  proofDocument?: {
    documentLocalUrl?: string;
    documentType?: string;
    documentKey?: string;
    documentName?: string;
  };
  prosecutorDetails?: {
    name?: string;
  };
  defenceLawyer?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
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
      state.arrestDraft = {...state.arrestDraft, ...action.payload};
    },
    resetArrestDraft: () => initialState
  }
});

export const {setArrestDraft, resetArrestDraft} = arrestDraftSlice.actions;
export default arrestDraftSlice.reducer;
