import { ChangeEvent, FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import {
  fetchLoginUser,
  selectLoading,
  selectErrorText,
  removeErrorText,
  getUserThunk
} from '../../slices/slices';
import { useDispatch, useSelector } from '../../services/store';
import { useForm } from '../../utils/useForm';
import { Preloader } from '@ui';
import { setCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  const error = useSelector(selectErrorText);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(removeErrorText());
    try {
      await dispatch(fetchLoginUser(values))
        .unwrap()
        .then((payload) => {
          localStorage.setItem('refreshToken', payload.refreshToken);
          setCookie('accessToken', payload.accessToken);
          dispatch(getUserThunk());
          navigate(-1);
        });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={values.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
