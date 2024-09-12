import {useEffect, useState} from 'react';
import BackWithLabel from '../../components/BackWithLabel';
import {useNavigate, useParams} from 'react-router-dom';
import {ReassignIcon, PlusIcon} from '../../assets';
import Loader from '../../components/Loader';
import {LegalInformation, PersonalInformation, ProfileCard} from './components';
import {apiRequest, apiMethods, endPoints} from 'shared';
import type {DetailsType} from './types';

const DetailsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [arrestData, setArrestData] = useState<DetailsType>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const handleBack = () => {
    navigate(-1);
  };

  const getArrestDetails = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: `${endPoints.arrests}/${id}`
    };

    setIsLoading(true);
    const response = await apiRequest(options);

    setArrestData(response?.data?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getArrestDetails();
  }, [id]);

  if (isLoading) return <Loader />;

  if (!arrestData) return null;

  return (
    <div className='w-full px-2 sm:px-6 md:px-12 lg:px-16 py-4 md:py-6 h-full overflow-auto'>
      <div className='flex justify-between items-center mb-4 '>
        <BackWithLabel label='Case Details' onBackClick={handleBack} />
        <div className='flex items-center cursor-pointer border border-court-black md:border-0 px-2 py-1 md:px-0 md:py-0 rounded-sm'>
          <img src={ReassignIcon} alt='reassign' className='w-5 h-5 md:w-6 md:h-6' />
          <h5 className='text-sm md:text-base lg:text-lg font-medium ml-2'>Reassign Case</h5>
        </div>
      </div>
      {arrestData && <ProfileCard details={arrestData} />}
      <div className='flex justify-between my-4 w-full border-b border-court-border-gray'>
        <div className='flex gap-4 justify-between w-full md:w-fit '>
          <div
            className={`text-sm font-medium p-2 cursor-pointer ${selectedTab === 0 ? 'opacity-100 border-b-2 border-b-black' : 'opacity-50'}`}
            onClick={() => setSelectedTab(0)}
          >
            LEGAL INFORMATION
          </div>
          <div
            className={`text-sm font-medium p-2 cursor-pointer ${selectedTab === 1 ? 'opacity-100 border-b-2 border-b-black' : 'opacity-50'}`}
            onClick={() => setSelectedTab(1)}
          >
            PERSONAL INFORMATION
          </div>
        </div>
        <div className='md:flex items-center hidden'>
          <img src={PlusIcon} alt='plus' />
          <div className='ml-2'>Add more details</div>
        </div>
      </div>
      {selectedTab === 0 ? (
        <LegalInformation legalDetails={arrestData} />
      ) : (
        <PersonalInformation suspectDetails={arrestData?.suspect} />
      )}
    </div>
  );
};

export default DetailsScreen;
