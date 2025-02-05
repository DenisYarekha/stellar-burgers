import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';

import {
  closeModal,
  fetchIngredients,
  init,
  selectIngredients,
  selectIsModalOpened,
  selectOrders,
  getUserThunk,
  selectIsAuthenticated,
  openModal
} from '../../slices/slices';

import { deleteCookie, getCookie } from '../../utils/cookie';
import { useDispatch, useSelector } from '../../services/store';

export const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isModalOpened = useSelector(selectIsModalOpened);
  const token = getCookie('accessToken');
  const ingredients = useSelector(selectIngredients);
  const feed = useSelector(selectOrders);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && token) {
      dispatch(getUserThunk())
        .unwrap()
        .then(() => {
          dispatch(init());
        })
        .catch((e) => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      dispatch(init());
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (
      location.pathname.startsWith('/ingredients/') ||
      location.pathname.startsWith('/feed/') ||
      location.pathname.startsWith('/profile/orders/')
    ) {
      dispatch(openModal());
    }
  }, [location.pathname, dispatch]);

  const closeModalHandler = () => {
    dispatch(closeModal());
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {isModalOpened && backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Описание ингредиента'} onClose={closeModalHandler}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Заказ'} onClose={closeModalHandler}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Заказ'} onClose={closeModalHandler}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
