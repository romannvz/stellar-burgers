import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useSelector, AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import { logoutThunk, userAuthSelector } from '../../slices/userSlice';
import { Navigate } from 'react-router-dom';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(userAuthSelector);

  const handleLogout = () => dispatch(logoutThunk());

  if (!isAuth) return <Navigate replace to='/login' />;

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
