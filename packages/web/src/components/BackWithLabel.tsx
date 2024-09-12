import {LeftArrow} from '../assets';

const BackWithLabel = ({
  label,
  onBackClick,
  count
}: {
  label: string;
  onBackClick: () => void;
  count?: number;
}) => {
  return (
    <div className='flex flex-row items-center'>
      <img src={LeftArrow} alt='back' className='w-6 h-6 cursor-pointer' onClick={onBackClick} />
      <h5 className='text-lg font-medium ml-2'>{label}</h5>
      {count ? <h5 className='text-lg font-medium ml-2'>({count})</h5> : ''}
    </div>
  );
};

export default BackWithLabel;
