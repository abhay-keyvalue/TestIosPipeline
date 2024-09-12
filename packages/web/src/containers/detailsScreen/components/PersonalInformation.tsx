import {DetailsCardLayout, DetailsItem} from '.';
import type {SuspectDetails} from '../types';

export const PersonalInformation = ({suspectDetails}: {suspectDetails: SuspectDetails}) => {
  const {
    gender,
    dob,
    placeOfBirth,
    fatherName,
    nationality,
    citizenship,
    education,
    profession,
    maritalStatus,
    isConvicted,
    address,
    phoneNumber
  } = suspectDetails;

  const {district, city, neighborhood, street, palaceNumber, staircaseNumber} = address;

  return (
    <>
      <DetailsCardLayout title='SUSPECT DETAILS'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='Suspect ID' value='Gjoni Jane_ID.jpg' />
          <DetailsItem label='Gender' value={gender} />
          <DetailsItem label='Date of Birth' value={dob} />
          <DetailsItem label='Place of Birth' value={placeOfBirth} />
          <DetailsItem label={`Father's Name`} value={fatherName} />
          <DetailsItem label='Nationality' value={nationality} />
          <DetailsItem label='Citizenship' value={citizenship} />
          <DetailsItem label='Education' value={education} />
          <DetailsItem label='Profession' value={profession} />
          <DetailsItem label='Marital Status' value={maritalStatus} />
          <DetailsItem label='Convicted' value={isConvicted ? 'Yes' : 'No'} />
        </div>
      </DetailsCardLayout>
      <DetailsCardLayout title='ADDRESS DETAILS'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='District' value={district} />
          <DetailsItem label='City/Municipality' value={city} />
          <DetailsItem label='Neighbourhood' value={neighborhood} />
          <DetailsItem label='Street' value={street} />
          <DetailsItem label='Private House/Palace Number' value={palaceNumber} />
          <DetailsItem label='Staircase Number' value={staircaseNumber} />
          <DetailsItem label='Telephone Number' value={phoneNumber} />
        </div>
      </DetailsCardLayout>
    </>
  );
};
