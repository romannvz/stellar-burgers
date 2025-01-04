import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { ingredientsSelector } from '../../slices/ingredientsSlice';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const location = useLocation();
  const ingredientData = useSelector(ingredientsSelector).find(
    (item) => item._id === location.pathname.slice(13)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
