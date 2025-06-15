import { useState, useCallback } from 'react';

export const useSnackbar = () => {
  const [snackbarData, setSnackbarData] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  const showSnackbar = useCallback((message, type = 'success') => {
    setSnackbarData({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbarData((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    showSnackbar,
    hideSnackbar,
    snackbarData,
  };
};
