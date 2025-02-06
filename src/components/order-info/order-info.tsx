import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchFeed, fetchUserOrders } from '../../slices/slices';
import {
  useParams,
  redirect,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  selectIngredients,
  selectUserOrders
} from '../../slices/slices';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const orders = useSelector(selectOrders);
  const navigate = useNavigate();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const location = useLocation();
  const isModal = location.state?.background;
  const dispatch = useDispatch();
  const userOrders = useSelector(selectUserOrders);

  useEffect(() => {
    if (!userOrders) {
      dispatch(fetchUserOrders());
    }
  }, [userOrders, dispatch]);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeed());
    }
  }, [orders, dispatch]);

  useEffect(() => {
    if (!params.number) {
      navigate('/feed', { replace: true });
    }
  }, [params.number, navigate]);

  const orderData = useMemo(() => {
    const allOrders = location.pathname.startsWith('/profile/orders')
      ? userOrders
      : orders;

    if (!allOrders?.length) return null;
    return allOrders.find((item) => item.number === parseInt(params.number!));
  }, [orders, userOrders, params.number, location.pathname]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  if (isModal) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
