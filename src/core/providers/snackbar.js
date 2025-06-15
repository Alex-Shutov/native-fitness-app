import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useSnackbar } from '~/core/hooks/useSnackbar';

export const SnackbarProvider = ({ children }) => {
  const { snackbarData, hideSnackbar } = useSnackbar();

  return (
    <>
      {children}
      <Snackbar
        visible={snackbarData.visible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: 'OK',
          onPress: hideSnackbar,
        }}
        style={{
          backgroundColor:
            snackbarData.type === 'error'
              ? '#f44336'
              : snackbarData.type === 'warning'
                ? '#ff9800'
                : '#4caf50',
        }}>
        {snackbarData.message}
      </Snackbar>
    </>
  );
};
