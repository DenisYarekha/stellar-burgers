import { useState } from 'react';

export const useForm = <TForm extends Record<string, any>>(
  inputValues: TForm
) => {
  const [values, setValues] = useState<TForm>(inputValues);

  const handleChange = (
    eventOrName:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: string }
  ) => {
    if ('target' in eventOrName) {
      const { name, value } = eventOrName.target;
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    } else {
      const { name, value } = eventOrName;
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  return { values, handleChange, setValues };
};
