import {MenuIcon, ArrestTimeIcon, LocationIcon, ReleaseIcon, DraftIcon} from '../assets';
import Button from './Button';
import {formatTime} from '../utils/timer';
import {useTimer} from '../hooks/useTimer';

interface ArrestCardProps {
  name: string;
  id: string;
  location: string;
  arrestDate: string;
  offenceType: string;
  description: string;
  overdue: number;
  image: string;
  cardType?: string;
  onClick?: () => void;
}

export const ArrestCard = ({
  name,
  id,
  location,
  arrestDate,
  offenceType,
  description,
  overdue,
  image,
  cardType,
  onClick
}: ArrestCardProps) => {
  const {elapsedTime, remainingTime} = useTimer(cardType === 'due', overdue);

  return (
    <div
      className='max-w-full sm:max-w-[308px] bg-white rounded-lg p-2 pb-4 mt-2 cursor-pointer'
      onClick={onClick}
    >
      <div className='flex flex-row justify-between items-center p-2'>
        <div className='flex flex-row items-center'>
          <img src={image} alt='avatar' className='w-10 h-10 rounded-md' />
          <div className='ml-4'>
            <h5 className='text-lg font-medium'>{name}</h5>
            <h5 className='text-xs font-normal text-gray-400'>{id}</h5>
          </div>
        </div>
        <img src={MenuIcon} alt='menu' className='w-6 h-6 cursor-pointer' />
      </div>
      <div className='flex flex-row items-center mt-3'>
        <img src={ArrestTimeIcon} alt='icon' className='w-5 h-5 mx-2' />
        <h5 className='text-sm font-normal text-tertiary-text'>{arrestDate}</h5>
      </div>
      <div className='flex flex-row items-center mt-1'>
        <img src={LocationIcon} alt='icon' className='w-5 h-5 mx-2' />
        <h5 className='text-sm font-normal text-tertiary-text'>{location}</h5>
      </div>
      <div className='p-2 mt-4 bg-tertiary-bg rounded-lg'>
        <h5 className='text-sm font-semibold'>{offenceType}</h5>
        <h5 className='text-sm font-normal text-secondary-text mt-1'>{description}</h5>
      </div>
      <div className='flex flex-row items-center rounded-md justify-between mt-1 px-2 py-2 mb-4'>
        <h5
          className={`text-sm font-semibold ${cardType !== 'due' && formatTime(remainingTime)?.hours > 8 ? 'text-court-black' : 'text-alert-red'}`}
        >
          {cardType === 'due' ? 'Overdue by' : 'Due in'}
        </h5>
        <TimerComponent
          hours={
            cardType === 'due' ? formatTime(elapsedTime)?.hours : formatTime(remainingTime)?.hours
          }
          minutes={
            cardType === 'due'
              ? formatTime(elapsedTime)?.minutes
              : formatTime(remainingTime)?.minutes
          }
          isDue={cardType === 'due'}
        />
      </div>
      <Button
        src={cardType === 'due' ? ReleaseIcon : DraftIcon}
        label={cardType === 'due' ? 'Cofirm Release' : 'Draft Application'}
      />
    </div>
  );
};

const TimerComponent = (timerValues: {hours: number; minutes: number; isDue: boolean}) => {
  const {hours, minutes, isDue} = timerValues;
  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const timerBoxClassName = `border ml-2 leading-[19px] h-[26px] w-[21px] flex items-center justify-center ${!isDue && hours > 8 ? 'border-court-border-black text-court-black' : 'border-court-border-red text-court-text-red'} rounded-md text-base font-medium`;
  const timerTextClassName = `text-xs ml-2 font-medium ${!isDue && hours > 8 ? 'text-court-black' : 'text-court-text-red'}`;

  return (
    <div className='flex flex-row items-center'>
      <div className={`${timerBoxClassName} ml-0`}>{hoursString.charAt(0)}</div>
      <div className={timerBoxClassName}>{hoursString.charAt(1)}</div>
      <div className={timerTextClassName}>HRS</div>
      <div className={timerBoxClassName}>{minutesString.charAt(0)}</div>
      <div className={timerBoxClassName}>{minutesString.charAt(1)}</div>
      <div className={timerTextClassName}>MIN</div>
    </div>
  );
};
