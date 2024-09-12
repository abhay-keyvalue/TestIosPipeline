import {ReleaseOverdueIcon, CourtReviewIcon, ReleaseBadge} from '../assets';

const StatusBadge = ({status}: {status: string}) => {
  const getStatusData = () => {
    switch (status) {
      case 'PROSECUTION_REVIEW':
        return {
          label: 'Prosecution Review',
          bg: 'bg-court-purple',
          textColor: 'text-court-black',
          icon: ReleaseOverdueIcon
        };
      case 'COURT_REVIEW':
        return {
          label: 'Court Review',
          bg: 'bg-court-purple',
          textColor: 'text-court-black',
          icon: CourtReviewIcon
        };
      case 'RELEASE_OVERDUE':
        return {
          label: 'Release Overdue',
          bg: 'bg-alert-bg-red',
          textColor: 'text-alert-red',
          icon: ReleaseBadge
        };

      default:
        return {
          label: 'Release Overdue',
          bg: 'bg-alert-bg-red',
          textColor: 'text-alert-red',
          icon: ReleaseBadge
        };
    }
  };

  const statusValues = getStatusData();

  return (
    <div
      className={`flex justify-center items-center gap-2 md:gap-3 rounded-full px-2 py-2 md:px-4 md:py-2 w-fit ${statusValues.bg}`}
    >
      <img src={statusValues.icon} alt='release-overdue' className='w-5 h-5' />
      <div className={`text-sm md:text-base font-normal ${statusValues.textColor}`}>
        {statusValues.label}
      </div>
    </div>
  );
};

export default StatusBadge;
