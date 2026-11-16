export const createValidator = () => {
  const errors: Record<string, string | undefined> = Object.create(null);

  const required = (key: string, value: string, message: string) => {
    if (value.trim() === '') {
      errors[key] = message;
    }
  };

  return { errors, required };
};
