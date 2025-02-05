import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchUserOrders,
  removeUserOrders,
  selectUserOrders
} from '../../slices/slices';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeUserOrders());
    Promise.all([dispatch(fetchUserOrders())]);
  }, [dispatch]);

  const orders: TOrder[] | null = useSelector(selectUserOrders);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
