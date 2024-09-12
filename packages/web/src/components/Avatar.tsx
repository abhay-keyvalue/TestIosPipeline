const Avatar = ({imageSrc}: {imageSrc: string}) => {
  return (
    <div
      className='rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-court-black bg-cover cursor-pointer'
      style={{backgroundImage: `url(${imageSrc})`}}
    />
  );
};

export default Avatar;
