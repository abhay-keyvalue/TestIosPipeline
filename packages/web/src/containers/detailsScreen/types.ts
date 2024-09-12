export interface SuspectDetails {
  name: string;
  gender: string;
  dob: string;
  fatherName: string;
  avatar: string;
  avatarThumbnail: string;
  placeOfBirth: string;
  nationality: string;
  citizenship: string;
  education: string;
  profession: string;
  maritalStatus: string;
  isConvicted: boolean;
  phoneNumber: string;
  proofDocument: {
    id: string;
    documentNumber: string;
    documentType: string;
    documentKey: string;
    documentName: string;
  };
  address: {
    district: string;
    city: string;
    neighborhood: string;
    street: string;
    palaceNumber: string;
    staircaseNumber: string;
  };
}

export interface ProfileCardProps {
  stage: string;
  caseNumber: string;
  suspect: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  locationName: string;
}

export interface DetailsType {
  criminalOffence: string;
  offences: {article: string; description: string; id: string}[];
  circumstance: string;
  detaineeDeclaration: string;
  additionalInfo: string;
  documents: string;
  defenceDetails: {
    name: string;
    assignedAt: string;
    id: string;
    phoneNumber: string;
  };
  officerDetails: {
    name: string;
    locationName: string;
    badgeNumber: string;
  };
  stage: string;
  caseNumber: string;
  suspect: SuspectDetails;
  createdAt: string;
  locationName: string;
}

export interface LegalInformationProps {
  criminalOffence: string;
  offences: {article: string; description: string; id: string}[];
  circumstance: string;
  detaineeDeclaration: string;
  additionalInfo: string;
  documents: string;
  defenceDetails: {
    name: string;
    assignedAt: string;
    id: string;
    phoneNumber: string;
  };
  officerDetails: {
    name: string;
    locationName: string;
    badgeNumber: string;
  };
}
