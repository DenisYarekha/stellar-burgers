import { FC, useEffect, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import {
  selectOrderRequest,
  selectConstructorItems,
  selectOrderModalData,
  fetchNewOrder,
  closeOrderRequest,
  selectIsAuthenticated,
  addIngredient
} from '../../slices/slices';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orderRequest = useSelector(selectOrderRequest);
  const constructorItems = useSelector(selectConstructorItems);
  const orderModalData = useSelector(selectOrderModalData);

  useEffect(() => {
    if (isAuthenticated) {
      const savedConstructorItems = localStorage.getItem('constructorItems');
      if (savedConstructorItems) {
        const { bun, ingredients } = JSON.parse(savedConstructorItems);

        if (bun && !constructorItems.bun) {
          dispatch(addIngredient(bun));
        }
        if (ingredients?.length) {
          const existingIds = new Set(
            constructorItems.ingredients.map((item) => item._id)
          );
          ingredients.forEach((ingredient: TConstructorIngredient) => {
            if (!existingIds.has(ingredient._id)) {
              dispatch(addIngredient(ingredient));
            }
          });
        }

        localStorage.removeItem('constructorItems');
      }
    }
  }, [isAuthenticated, dispatch]);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem(
        'constructorItems',
        JSON.stringify({
          bun: constructorItems.bun?._id ? constructorItems.bun : null,
          ingredients: constructorItems.ingredients.length
            ? constructorItems.ingredients
            : []
        })
      );
      return navigate('/login', { replace: true });
    }

    if (constructorItems.bun._id && constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        fetchNewOrder([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  };

  const closeOrderModal = () => {
    dispatch(closeOrderRequest());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price! * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
