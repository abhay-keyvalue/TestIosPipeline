import {Platform, Dimensions} from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const hitSlop = {top: 10, left: 10, right: 10, bottom: 10};
export const fontWeights = {
  BOLD: 'bold',
  MEDIUM: 'medium',
  REGULAR: 'regular',
  THIN: 'thin'
};
export const lawyerTypes = {
  DEFENSE: 'DEFENSE',
  PROSECUTOR: 'PROSECUTOR'
};

export const lawyerEditFieldTypes = {
  NAME: 'NAME',
  TELEPHONE_NUMBER: 'TELEPHONE_NUMBER',
  ASSIGNED_TIME: 'ASSIGNED_TIME',
  SUPERVISOR: 'SUPERVISOR'
};

export const arrestStages = {
  RELEASED: 'RELEASED',
  DETAINED: 'DETAINED',
  PROSECUTION_REVIEW: 'PROSECUTION_REVIEW',
  COURT_REVIEW: 'COURT_REVIEW',
  DRAFT: 'DRAFT'
};

export const arrestStagesLabels = {
  RELEASED: 'Released',
  DETAINED: 'Detained',
  PROSECUTION_REVIEW: 'Prosecution review',
  COURT_REVIEW: 'Prosecution review',
  DRAFT: 'Draft'
};

export const documentList = [
  {id: 1, label: 'passport', value: 'PASSPORT'},
  {id: 2, label: 'national_id', value: 'NATIONAL_ID'},
  {id: 3, label: 'driving_license', value: 'DRIVING_LICENSE'},
  {id: 4, label: 'resident_permit', value: 'RESIDENCE_PERMIT'},
  {id: 5, label: 'health_insurance_card', value: 'HEALTH_INSURANCE_CARD'},
  {id: 6, label: 'other', value: 'OTHER'}
];

export const documentTypes = {
  PASSPORT: 'PASSPORT',
  NATIONAL_ID: 'NATIONAL_ID',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  RESIDENCE_PERMIT: 'RESIDENCE_PERMIT',
  HEALTH_INSURANCE_CARD: 'HEALTH_INSURANCE_CARD',
  OTHER: 'OTHER'
};

export const maritalStatusList = [
  {id: 1, label: 'single', value: 'SINGLE'},
  {id: 2, label: 'married', value: 'MARRIED'},
  {id: 3, label: 'divorced', value: 'DIVORCED'},
  {id: 4, label: 'widowed', value: 'WIDOWED'}
];

export const convictedList = [
  {id: 1, label: 'yes', value: true},
  {id: 2, label: 'no', value: false}
];

export const mediaTypes = {
  PROOF_DOCUMENT: 'PROOF_DOCUMENT',
  SUSPECT_IMAGE: 'SUSPECT_IMAGE',
  USER_AVTAR: 'USER_AVTAR',
  CIRCUMSTANCE_RECORDING: 'CIRCUMSTANCE_RECORDING',
  ADDITIONAL_INFO_RECORDING: 'ADDITIONAL_INFO_RECORDING',
  ADDITIONAL_EVIDENCE_FILES: 'ADDITIONAL_EVIDENCE_FILES',
  SUSPECT_AVATAR: 'SUSPECT_AVATAR'
};

export const genderList = [
  {id: 1, label: 'male', value: 'MALE'},
  {id: 2, label: 'female', value: 'FEMALE'},
  {id: 3, label: 'others', value: 'OTHERS'}
];

export const defenceAssignmentList = [
  {id: 1, label: 'does_not_want_lawyer', value: 'NONE'},
  {id: 2, label: 'request_assign_lawyer', value: 'SYSTEM_ASSIGNED'},
  {id: 3, label: 'already_has_lawyer', value: 'SUSPECT_GIVEN'}
];

export const S3_URL_DOMAIN_SUBSTRING = 'crtap-dev-ff-court-app.s3.eu-central-1.amazonaws.com';

export const filterTypesList = [
  'case_status',
  'date_of_arrest',
  'assigned_prosecutor',
  `suspect_gender`
];
export const caseStatuses = [
  {id: 1, label: 'under_investigation', value: 'Under Investigation'},
  {id: 2, label: 'prosecution_review', value: 'Prosecution Review'},
  {id: 3, label: 'court_review', value: 'Court Review'},
  {id: 4, label: 'released', value: 'Released'},
  {id: 5, label: 'detained', value: 'Detained'},
  {id: 6, label: 'missing_arrest_details', value: 'Missing Arrest Details'},
  {id: 7, label: 'pending_prosecution_decision', value: 'Pending Prosecution Decision'},
  {id: 8, label: 'closed', value: 'Closed'}
];

export const sortList = [
  {id: 1, label: 'newest_to_oldest', value: 'Newest to Oldest'},
  {id: 2, label: 'oldest_to_newest', value: 'Oldest to Newest'}
];
