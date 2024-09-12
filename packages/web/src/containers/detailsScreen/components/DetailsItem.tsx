export const DetailsItem = ({label, value}: {label: string; value: string}) => {
  return (
    <div className='w-full md:w-1/3 my-1.5 md:my-3'>
      <div className='text-[13px] font-semibold'>{label}</div>
      <div className='text-base font-normal text-court-gray max-w-[292px] text-wrap'>
        {value || '--'}
      </div>
    </div>
  );
};
