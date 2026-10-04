import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Typo } from '../../shared/ui/typo';
import Button from '../../shared/ui/button';
import { BORDER_RADIUS, COLORS, SPACING } from '../../core/styles/theme';

const ConfirmModal = ({
  visible,
  title,
  text,
  confirmText = 'Да',
  cancelText = 'Нет',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {title && (
            <Typo variant="hSub" style={styles.modalTitle}>
              {title}
            </Typo>
          )}

          {text && (
            <Typo variant="body1" style={styles.modalText}>
              {text}
            </Typo>
          )}

          <View style={styles.buttonRow}>
            <Button
              title={cancelText}
              variant="outlined"
              onPress={onCancel}
              disabled={loading}
              style={styles.modalButton}
            />
            <Button
              title={confirmText}
              onPress={onConfirm}
              loading={loading}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    minWidth: 0,
  },
});

export default ConfirmModal;
