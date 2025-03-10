import { z } from 'zod';

export const validateField = (schema, fieldName, value) => {
  // Create a partial schema for just this field
  const fieldSchema = z.object({ [fieldName]: schema.shape[fieldName] });

  try {
    fieldSchema.parse({ [fieldName]: value });
    return null;
  } catch (error) {
    const fieldError = error.errors.find((err) => err.path[0] === fieldName);
    return fieldError ? fieldError.message : null;
  }
};

export const validateForm = (schema, formData) => {
  try {
    schema.parse(formData);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
