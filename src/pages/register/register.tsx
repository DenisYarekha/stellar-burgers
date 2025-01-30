import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  fetchRegisterUser,
  getUserThunk,
  selectErrorText,
  selectLoading
} from '../../slices/slices';
import { useDispatch, useSelector } from '../../services/store';
import { setCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectErrorText);
  const isLoading = useSelector(selectLoading);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(fetchRegisterUser({ name: userName, email, password }))
        .unwrap()
        .then((payload) => {
          localStorage.setItem('refreshToken', payload.refreshToken);
          setCookie('accessToken', payload.accessToken);
          dispatch(getUserThunk());
        });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
