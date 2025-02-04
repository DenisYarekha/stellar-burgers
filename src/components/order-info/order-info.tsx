import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  useParams,
  redirect,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectOrders, selectIngredients } from '../../slices/slices';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const orders = useSelector(selectOrders);
  const navigate = useNavigate();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const location = useLocation();
  const isModal = location.state?.background;

  useEffect(() => {
    if (!params.number) {
      navigate('/feed', { replace: true });
    }
  }, [params.number, navigate]);

  const orderData = useMemo(() => {
    if (!orders.length) return null;
    return orders.find((item) => item.number === parseInt(params.number!));
  }, [orders, params.number]);

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
