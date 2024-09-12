import {routesPath} from '../constants/common';
import {
  MainPage,
  HomePage,
  SignInPage,
  OverviewPage,
  NotificationPage,
  DetailsPage
} from '../pages';
import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={routesPath.DEFAULT} element={<MainPage />}>
      <Route path={routesPath.SIGNIN} element={<SignInPage />} />
      <Route path={routesPath.HOME} element={<HomePage />} />
      <Route path={routesPath.OVERVIEW} element={<OverviewPage />} />
      <Route path={routesPath.RESET_PASSWORD} element={<SignInPage />} />
      <Route path={routesPath.NOTIFICATIONS} element={<NotificationPage />} />
      <Route path={routesPath.DETAILS} element={<DetailsPage />} />
    </Route>
  )
);
