import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  getFeeds,
  ordersSelector,
  totalTodayOrderSelector,
  totalOrderSelector
} from '../../slices/feedsSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  if (useSelector(ordersSelector).length === 0) dispatch(getFeeds());
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(ordersSelector);
  const feed = {
    total: useSelector(totalOrderSelector),
    totalToday: useSelector(totalTodayOrderSelector)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
