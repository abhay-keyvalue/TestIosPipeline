import {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import {apiRequest, apiMethods, endPoints} from 'shared';

import {DummyImage1, DotSeparator, RightArrow} from '../../assets';
import Loader from '../../components/Loader';
import BackWithLabel from '../../components/BackWithLabel';

type Notification = {
  id: string;
  suspectName: string;
  avatarThumbnail: string;
  caseNumber: string;
  message: string;
  createdAt: string;
  arrestId: string;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMetaData, setApiMetaData] = useState({cursor: '', hasNext: false});
  const navigate = useNavigate();
  const {t} = useTranslation();
  const divRef = useRef(null);
  let currentDate = '';

  const handleBack = () => {
    navigate(-1);
  };

  const fetchNotifications = async (listCursor?: string) => {
    const options = {
      method: apiMethods.get,
      endpoint: endPoints.notifications,
      params: {
        pageSize: 6,
        ...(listCursor && {cursor: listCursor})
      }
    };

    if (!apiMetaData.cursor) setIsLoading(true);
    const response = await apiRequest(options);

    if (apiMetaData.cursor && response?.data?.data?.contents)
      setNotifications([...notifications, ...response.data.data.contents]);
    else setNotifications(response?.data?.data?.contents);
    setApiMetaData({
      cursor: response?.data?.data?.cursor,
      hasNext: response?.data?.data?.hasNextPage
    });
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (divRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = divRef.current;

      if (scrollTop + clientHeight >= scrollHeight && apiMetaData.hasNext)
        fetchNotifications(apiMetaData?.cursor);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div
      onScroll={handleScroll}
      ref={divRef}
      className='w-full px-2 sm:px-8 md:px-12 lg:px-16 py-4 lg:py-6 flex flex-col items-center h-full overflow-auto'
    >
      <div className='w-full flex justify-start'>
        <BackWithLabel
          label='Notifications'
          onBackClick={handleBack}
          count={notifications?.length}
        />
      </div>
      <div className='flex flex-col max-w-[848px] items-center w-full mt-1'>
        {notifications?.map((notification: Notification) => {
          const itemDate = format(notification?.createdAt, 'dd MMM yyyy');
          const showDateHeader = itemDate !== currentDate;

          currentDate = itemDate;

          return (
            <div key={notification.id} className='w-full'>
              {showDateHeader && (
                <div className='w-full p-2 text-base font-normal text-tertiary-text'>
                  {itemDate === format(new Date(), 'dd MMM yyyy') ? 'Today' : itemDate}
                </div>
              )}
              <NotificationCard
                suspectName={notification?.suspectName}
                avatarThumbnail={notification?.avatarThumbnail || DummyImage1}
                caseNumber={notification?.caseNumber}
                message={t(notification?.message)}
                time={notification?.createdAt}
                onViewDetailsClick={() => navigate(`/details/${notification?.arrestId}`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface NotificationCardProps {
  suspectName: string;
  avatarThumbnail: string;
  caseNumber: string;
  message: string;
  time: string;
  onViewDetailsClick: () => void;
}

const NotificationCard = ({
  suspectName,
  avatarThumbnail,
  caseNumber,
  message,
  time,
  onViewDetailsClick
}: NotificationCardProps) => {
  const createdAt = new Date(time);
  const date = format(createdAt, 'dd MMM yyyy');
  const timeString = format(createdAt, 'hh:mm a');

  return (
    <div className='p-4 bg-white rounded-lg w-full my-1 md:my-2'>
      <div className='flex gap-2 w-full items-center'>
        <img src={avatarThumbnail} alt='icon' className='h-8 w-8 md:h-10 md:w-10 rounded-full' />
        <h5 className='text-base md:text-lg lg:text-xl font-semibold text-court-black'>
          {suspectName || 'Gezim Gjoni'}
        </h5>
        <h5 className='text-xs md:text-sm lg:text-base font-normal text-tertiary-text opacity-70'>
          {caseNumber || 'CA-123455/12'}
        </h5>
      </div>
      <h5 className='text-sm md:text-base lg:text-lg font-normal text-court-black my-2'>
        {message}
      </h5>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-xs lg:text-sm font-normal text-tertiary-text'>
          <div className='opacity-60'>{date}</div>
          <img src={DotSeparator} alt='dot' className='h-2 w-2' />
          <div className='opacity-60'>{timeString}</div>
        </div>
        <div className='flex items-center gap-1 cursor-pointer' onClick={onViewDetailsClick}>
          <h5 className='text-sm lg:text-base font-medium text-court-black'>View Details</h5>
          <img src={RightArrow} alt='right-arrow' className='h-5 w-5 mt-1' />
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;
