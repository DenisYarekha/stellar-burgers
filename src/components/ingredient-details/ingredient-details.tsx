import { FC, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useNavigate, useParams } from 'react-router-dom';
import { selectIngredients } from '../../slices/slices';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ingredients.length) {
      return;
    }
    const ingredientData = ingredients.find((item) => item._id === params.id);
    if (!ingredientData) {
      navigate('/', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [ingredients, params.id, navigate]);

  const ingredientData = ingredients.find((item) => item._id === params.id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
