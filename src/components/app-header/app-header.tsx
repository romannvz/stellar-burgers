import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../slices/userSlice';

export const AppHeader: FC = () => {
  const username = useSelector(userDataSelector).name;
  return <AppHeaderUI userName={username} />;
};
