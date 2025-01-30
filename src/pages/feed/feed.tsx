import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  fetchFeed,
  removeOrders,
  fetchIngredients
} from '../../slices/slices';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchFeed())]);
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(removeOrders());
    dispatch(fetchFeed());
  };

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        handleGetFeeds;
      }}
    />
  );
};
