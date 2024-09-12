interface DetailsCardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const DetailsCardLayout = ({title, children}: DetailsCardLayoutProps) => {
  return (
    <div className='w-full bg-white p-4 my-4 rounded-lg'>
      <h5 className='text-sm font-medium pb-2 border-b border-court-border-gray mb-4'>{title}</h5>
      {children}
    </div>
  );
};
