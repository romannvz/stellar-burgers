import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { AppDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../slices/ingredientsSlice';
import {
  orderIsSending,
  postOrder,
  lastOrder,
  clearLastOrder,
  userAuthSelector
} from '../../slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(userAuthSelector);
  const navigate = useNavigate();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const bun = useSelector(constructorBunSelector);
  const ingredients = useSelector(constructorIngredientsSelector);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };
  const orderRequest = useSelector(orderIsSending);
  const orderModalData = useSelector(lastOrder);

  const onOrderClick = () => {
    if (!isAuth) return navigate('/login');
    else {
      if (!constructorItems.bun || orderRequest)
        return alert('Обязательно выберите булку!');
      else {
        const orderArray: string[] = [];
        orderArray.push(constructorItems.bun._id);
        constructorItems.ingredients.forEach((item) =>
          orderArray.push(item._id)
        );
        dispatch(postOrder(orderArray)).then(() =>
          dispatch(clearConstructor())
        );
      }
    }
  };

  const closeOrderModal = () => dispatch(clearLastOrder());

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
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
