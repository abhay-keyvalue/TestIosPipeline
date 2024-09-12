import {apiRequest, endPoints, apiMethods} from 'shared';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {HomeCountBg, CourtReviewIcon, ReleaseOverdueIcon} from '../../assets';
import {releaseOverdueData} from '../../constants/dummyData';
import {ArrestCard} from '../../components/ArrestCard';
import Loader from '../../components/Loader';

type Summary = 'court_review' | 'release_overdue' | 'application_required';

const HomeScreen = () => {
  const [summary, setSummary] = useState<{
    release_overdue: number;
    application_required: number;
    court_review: number;
  }>({court_review: 0, release_overdue: 0, application_required: 0});
  const [selectedTab, setSelectedTab] = useState('release_overdue');
  const [isLoading, setIsLoading] = useState(false);

  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/details/${id}`);
  };

  const fetchData = async () => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.summary
    };

    setIsLoading(true);
    const response = await apiRequest(options);

    if (response?.data?.data) {
      const summaryData = response?.data?.data;

      setSummary({
        court_review: summaryData?.COURT_REVIEW?.count || 0,
        release_overdue: summaryData?.DRAFT?.count || 0,
        application_required: summaryData?.PROSECUTION_REVIEW?.count || 0
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className='px-5 py-3 md:px-20 md:py-12 h-full sm:px-10 sm:py-6 overflow-auto'>
      <div
        className='w-full flex flex-row justify-between bg-white rounded-lg overflow-hidden bg-cover'
        style={{backgroundImage: `url(${HomeCountBg})`}}
      >
        {Object.keys(summary).map((item: string, index: number) => (
          <div key={item} className='flex px-3 w-1/3 items-center relative'>
            <div className='py-[14px] md:py-[22px] w-full'>
              <div className='w-full flex justify-center items-center'>
                <img
                  className='w-5 h-5 md:w-10 md:h-10 sm:w-7 sm:h-7 mr-4'
                  src={item === 'court_review' ? CourtReviewIcon : ReleaseOverdueIcon}
                  alt='home count bg'
                />
                <div>
                  <div className='text-[10px] md:text-base sm:text-xs text-black font-medium uppercase'>
                    {t(item)}
                  </div>
                  <div className='text-xl md:text-xl font-bold hidden sm:block text-gray-500'>
                    <span className='text-2xl text-black font-semibold mr-2'>
                      {summary?.[item as Summary]}
                    </span>
                    Cases
                  </div>
                </div>
              </div>
              <div className='text-lg flex items-center gap-2 text-gray-500 font-bold sm:hidden ml-1'>
                <span className='text-2xl text-black font-semibold'>
                  {summary?.[item as Summary]}
                </span>
                Cases
              </div>
            </div>
            {index !== Object.keys(summary).length - 1 && (
              <div className='border-r absolute border-gray-300 h-14 right-0' />
            )}
          </div>
        ))}
      </div>
      <div>
        <div className='flex overflow-x-auto'>
          <div
            onClick={() => setSelectedTab('release_overdue')}
            className={`border-b sm:hidden cursor-pointer ${selectedTab === 'release_overdue' ? 'border-b-2 border-court-black' : 'border-gray-200'}`}
          >
            <HomeSubHeader
              title={t('release_overdue')}
              icon={ReleaseOverdueIcon}
              count={summary.release_overdue}
              isActive={selectedTab === 'release_overdue'}
            />
          </div>
          <div
            onClick={() => setSelectedTab('application_required')}
            className={`border-b sm:hidden cursor-pointer pl-4 ${selectedTab === 'application_required' ? 'border-b-2 border-court-black' : 'border-gray-200'}`}
          >
            <HomeSubHeader
              title={t('application_required')}
              icon={ReleaseOverdueIcon}
              count={summary.application_required}
              isActive={selectedTab === 'application_required'}
            />
          </div>
        </div>
        <div className='hidden sm:block'>
          <HomeSubHeader
            icon={ReleaseOverdueIcon}
            title={t('release_overdue')}
            count={summary.release_overdue}
          />
        </div>
        <div
          className={`${selectedTab === 'release_overdue' ? 'felx' : 'hidden'} sm:flex flex-row flex-wrap gap-4`}
        >
          {releaseOverdueData.map((item) => (
            <ArrestCard
              key={item.id}
              image={item.photo}
              name={item.name}
              id={item.id}
              location={item.place}
              arrestDate={item.arrestDate}
              offenceType={item.offenceType}
              description={item.description}
              overdue={item.overdueBy}
              onClick={() => handleCardClick(item.id)}
              cardType='due'
            />
          ))}
        </div>
        <div className='hidden sm:block'>
          <HomeSubHeader
            icon={ReleaseOverdueIcon}
            title={t('application_required')}
            count={summary.application_required}
          />
        </div>
        <div
          className={`${selectedTab === 'application_required' ? 'felx' : 'hidden'} sm:flex flex-row flex-wrap gap-4`}
        >
          {releaseOverdueData.map((item) => (
            <ArrestCard
              key={item.id}
              image={item.photo}
              name={item.name}
              id={item.id}
              location={item.place}
              arrestDate={item.arrestDate}
              offenceType={item.offenceType}
              description={item.description}
              overdue={item.overdueBy}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeSubHeader = ({
  icon,
  title,
  count,
  isActive
}: {
  icon: string;
  title: string;
  count: number;
  isActive?: boolean;
}) => {
  return (
    <div className='flex flex-row mt-8 mb-6 items-center'>
      <img
        src={icon}
        alt='icon'
        className={`w-5 h-5 sm:w-6 sm:h-6 mr-4 ${isActive ? 'visible' : 'invisible'} sm:visible`}
      />
      <h5
        className={`text-xs sm:text-base font-medium text-nowrap sm:opacity-100 ${isActive ? 'opacity-100' : 'opacity-50'}`}
      >
        {title}
      </h5>
      <h5
        className={`text-xs sm:text-base ml-2 sm:opacity-100 ${isActive ? 'opacity-100' : 'opacity-50'}`}
      >
        ({count})
      </h5>
    </div>
  );
};

export default HomeScreen;
