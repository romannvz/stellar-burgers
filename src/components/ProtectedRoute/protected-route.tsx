import { Preloader } from '@ui';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useSelector, AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import {
  errorSelector,
  userAuthSelector,
  userIsLoading,
  clearErrors
} from '../../slices/userSlice';
import { Modal } from '@components';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(userAuthSelector);
  const isLoading = useSelector(userIsLoading);
  const location = useLocation();
  const error = useSelector(errorSelector);
  const navigate = useNavigate();

  if (isLoading) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return (
      <Modal title={'Пожалуйста, подождите...'} onClose={() => {}}>
        <Preloader />
      </Modal>
    );
  } else {
    if (error) {
      // если есть ошибка от сервера
      return (
        <Modal
          title={`При выполнении запроса возникла ошибка: ${error}`}
          onClose={() => dispatch(clearErrors())}
        />
      );
    } else if (onlyUnAuth && isAuth) {
      // если пользователь на странице авторизации и данные есть в хранилище
      // при обратном редиректе получаем данные о месте назначения редиректа из объекта location.state
      // в случае если объекта location.state?.from нет — а такое может быть, если мы зашли на страницу логина по прямому URL
      // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
      const from = location.state?.from || { pathname: '/' };
      return <Navigate replace to={from} />;
    }
  }

  return children;
};
