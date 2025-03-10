import { useCallback, useEffect, useState } from 'react';
import { validateField, validateForm } from '~/core/lib/zod.validation';

const useZodForm = (schema, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Update form values
  const handleChange = useCallback(
    (field, value) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // If field is already touched, validate it immediately
      if (touched[field]) {
        const error = validateField(schema, field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [touched]
  );

  // Mark field as touched on blur and validate it
  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      const error = validateField(schema, field, values[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    [values]
  );

  // Check form validity whenever errors change
  useEffect(() => {
    setIsValid(Object.values(errors).every((error) => !error));
  }, [errors]);

  // Validate all fields ignoring touch state
  const validateAll = useCallback(() => {
    const result = validateForm(schema, values);
    setErrors(result.errors);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return result.success;
  }, [values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit) => {
      setIsSubmitting(true);

      // Validate all fields before submission
      const isValid = validateAll();

      // If validation passes, call the onSubmit callback
      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
      return isValid;
    },
    [values, validateAll]
  );

  // Reset form to initial state
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateAll,
  };
};

export default useZodForm;
