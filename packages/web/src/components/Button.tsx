interface ButtonProps {
  src: string;
  label: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Button = ({src, label, className = '', variant = 'primary'}: ButtonProps) => {
  if (variant === 'secondary')
    return (
      <button
        className={`w-full py-1.5 flex text-base text-court-black border border-court-black leading-5 flex-row justify-center rounded-sm items-center font-normal ${className}`}
      >
        <img src={src} alt='release' className='w-5 h-5 mr-2' />
        <h5>{label}</h5>
      </button>
    );

  return (
    <button
      className={`w-full py-1.5 flex text-base text-white leading-5 flex-row justify-center rounded-md items-center font-normal bg-gradient-to-r from-[#26993F] to-[#12A533] via-[#12A533] ${className}`}
    >
      <img src={src} alt='release' className='w-5 h-5 mr-2' />
      <h5>{label}</h5>
    </button>
  );
};

export default Button;
