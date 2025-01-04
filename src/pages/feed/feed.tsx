import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import {
  feedsIsLoading,
  getFeeds,
  ordersSelector
} from '../../slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  /** TODO: взять переменную из стора */
  const orders = useSelector(ordersSelector);
  const isLoading = useSelector(feedsIsLoading);

  if (isLoading) {
    return <Preloader />;
  } else
    return (
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(getFeeds());
        }}
      />
    );
};
