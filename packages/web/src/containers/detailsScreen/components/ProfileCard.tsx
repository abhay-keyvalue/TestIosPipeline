import {ReleaseIcon, RemandIcon, ArrestTimeIcon, LocationIcon, PlusIcon} from '../../../assets';
import {DummyProfile1} from '../../../assets';
import Button from '../../../components/Button';
import StatusBadge from '../../../components/StatusBadge';
import {useTimer} from '../../../hooks/useTimer';
import {formatTime} from '../../../utils/timer';
import {format} from 'date-fns';
import type {ProfileCardProps} from '../types';

const ProfileCard = ({details}: {details: ProfileCardProps}) => {
  const {suspect, stage, caseNumber, createdAt, locationName} = details;
  const {remainingTime} = useTimer(false, createdAt);
  const createdAtDate = createdAt ? new Date(createdAt) : '';
  const dateString = createdAtDate ? format(createdAtDate, 'k:mm, dd/MM/yyyy') : createdAtDate;

  return (
    <div className='flex flex-col md:flex-row justify-between bg-white rounded-lg p-2 md:p-4 lg-p8 w-full'>
      <div className='flex w-full md:w-fit'>
        <div
          className='rounded-2xl bg-cover hidden md:block h-[100px] w-[100px] lg:h-[164px] lg:w-[164px]'
          style={{backgroundImage: `url(${DummyProfile1})`}}
        />
        <div className='flex flex-col md:ml-4 gap-3 md:gap-5 w-full md:w-fit'>
          <div className='flex items-center'>
            <div
              className='rounded-2xl bg-cover block md:hidden h-[76px] w-[76px]'
              style={{backgroundImage: `url(${DummyProfile1})`}}
            />
            <div className='flex flex-col ml-3 md:ml-0 md:flex-row md:items-center gap-3'>
              <h5 className='text-lg md:text-2xl lg:text-3xl font-semibold leading-3 md:leading-6 lg:leading-9'>
                {suspect?.name}
              </h5>
              <div className='h-6 border border-gray-200 hidden md:block' />
              <h5 className='text-xs font-normal text-court-gray ml-0 md:ml-2'>{caseNumber}</h5>
            </div>
          </div>
          <div className='hidden md:block'>
            <StatusBadge status={stage} />
          </div>
          <div className='flex flex-col md:flex-row gap-2 md:gap-5'>
            <DetailsItem icon={ArrestTimeIcon} title='Arrest time & date' value={dateString} />
            <DetailsItem icon={LocationIcon} title='Arrest Location' value={locationName} />
          </div>
          <div className='flex justify-between md:hidden w-full'>
            <StatusBadge status='Prosecution Review' />
            <TimerComponent
              hours={formatTime(remainingTime)?.hours}
              minutes={formatTime(remainingTime)?.minutes}
              isDue={false}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <div className='md:flex w-full justify-end hidden'>
          <TimerComponent
            hours={formatTime(remainingTime)?.hours}
            minutes={formatTime(remainingTime)?.minutes}
            isDue={false}
          />
        </div>
        <div className='flex flex-col md:flex-row justify-end items-center gap-2 mt-4 md:mt-0'>
          <Button
            src={PlusIcon}
            label='Add more details'
            variant='secondary'
            className='px-5 py-[14px] text-nowrap rounded-sm font-medium md:hidden'
          />
          <Button
            src={RemandIcon}
            label='Remand Application'
            className='px-5 py-[14px] text-nowrap rounded-md font-medium'
          />
          <Button
            src={ReleaseIcon}
            label='Prosecution Release'
            className='px-4 py-[14px] text-nowrap rounded-md font-medium'
          />
        </div>
      </div>
    </div>
  );
};

const DetailsItem = ({icon, title, value}: {icon: string; title: string; value: string}) => {
  return (
    <div className='flex flex-row md:flex-col md:justify-center items-center md:items-start gap-1'>
      <div className='flex gap-2 items-center'>
        <img src={icon} alt='icon' className='w-5 h-5' />
        <h5 className='text-sm font-semibold'>{title}</h5>
      </div>
      <div className='block md:hidden'>:</div>
      <h5 className='text-sm font-normal text-court-gray pl-1'>{value}</h5>
    </div>
  );
};

const TimerComponent = (timerValues: {hours: number; minutes: number; isDue: boolean}) => {
  const {hours, minutes, isDue} = timerValues;
  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const timerBoxClassName = `border ml-2 leading-3 md:leading-6 lg:leading-10 h-[26px] md:h-[40px] lg:h-[52px] w-[20px] md:w-[32px] lg:w-[45px] flex items-center justify-center ${!isDue && hours > 8 ? 'border-court-border-black text-court-black' : 'border-court-border-red text-court-text-red'} rounded-md text-sm md:text-2xl lg:text-[32px] font-medium`;
  const timerTextClassName = `text-xs md:text-base ml-2 md:ml-0 font-medium ${!isDue && hours > 8 ? 'text-court-black' : 'text-court-text-red'}`;

  return (
    <div className='flex flex-row items-center'>
      <div className='flex flex-row md:flex-col items-center'>
        <div className='flex'>
          <div className={`${timerBoxClassName} ml-0`}>{hoursString.charAt(0)}</div>
          <div className={timerBoxClassName}>{hoursString.charAt(1)}</div>
        </div>
        <div className={timerTextClassName}>HRS</div>
      </div>
      <div
        className={`hidden md:block mt-[-40px] ml-2 text-[40px] leading-[46px] font-medium ${!isDue && hours > 8 ? 'text-court-black' : 'text-court-text-red'}`}
      >
        :
      </div>
      <div className='flex flex-row md:flex-col items-center'>
        <div className='flex'>
          <div className={timerBoxClassName}>{minutesString.charAt(0)}</div>
          <div className={timerBoxClassName}>{minutesString.charAt(1)}</div>
        </div>
        <div className={timerTextClassName}>MIN</div>
      </div>
    </div>
  );
};

export default ProfileCard;
