import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {IS_AUTHENTICATED} from '../constants/common';
import {routesPath} from '../constants/common';
import {setupBaseUrl} from 'shared';
import MainLayout from '../layout/MainLayout';

import 'shared/src/localization/i18n.config';

const MainPage = () => {
  const [isAuth, setIsAuth] = useState('false');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuth(localStorage.getItem(IS_AUTHENTICATED) as string);
    setupBaseUrl(import.meta.env.VITE_APP_BASE_URL as string);
  }, []);

  useEffect(() => {
    if (!isAuth && location.pathname !== `/${routesPath.RESET_PASSWORD}`)
      navigate(`/${routesPath.SIGNIN}`);
    else if (isAuth === 'true')
      navigate(location.pathname ? location.pathname : `/${routesPath.HOME}`);
  }, [isAuth]);

  if (localStorage.getItem(IS_AUTHENTICATED) === 'true')
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );

  return (
    <>
      <Outlet />
    </>
  );
};

export default MainPage;
