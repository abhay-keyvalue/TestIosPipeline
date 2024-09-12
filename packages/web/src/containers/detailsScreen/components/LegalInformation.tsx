import {DetailsCardLayout, DetailsItem} from '.';
import type {LegalInformationProps} from '../types';

export const LegalInformation = ({legalDetails}: {legalDetails: LegalInformationProps}) => {
  const {
    criminalOffence,
    offences,
    circumstance,
    detaineeDeclaration,
    additionalInfo,
    defenceDetails,
    officerDetails
  } = legalDetails;

  return (
    <>
      <DetailsCardLayout title='OFFENCE DETAILS'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='Criminal Offense' value={criminalOffence} />
          <DetailsItem
            label='Article of criminal code'
            value={offences?.map((offence) => offence.article).join(', ')}
          />
          <DetailsItem label='Circumstances' value={circumstance} />
        </div>
      </DetailsCardLayout>
      <DetailsCardLayout title='ADDITIONAL INFORMATION'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='Detainee declaration' value={detaineeDeclaration} />
          <DetailsItem label='Name of the lawyer' value={defenceDetails?.name} />
          <DetailsItem label='Telephone Number' value={defenceDetails?.phoneNumber} />
          <DetailsItem label='Additional Information' value={additionalInfo} />
          <DetailsItem label='Additional photos' value='' />
        </div>
      </DetailsCardLayout>
      <DetailsCardLayout title='DEFENSE DETAILS'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='Name' value={defenceDetails?.name} />
          <DetailsItem label='Assigned Time' value={defenceDetails?.assignedAt} />
          <DetailsItem label='Supervisor' value='' />
        </div>
      </DetailsCardLayout>
      <DetailsCardLayout title='OFFICER DETAILS'>
        <div className='flex w-full flex-wrap'>
          <DetailsItem label='Officer Name' value={officerDetails?.name} />
          <DetailsItem label='Location' value={officerDetails?.locationName} />
          <DetailsItem label='Badge Number' value={officerDetails?.badgeNumber} />
        </div>
      </DetailsCardLayout>
    </>
  );
};
