import React from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import { Typo } from '../../shared/ui/typo';
import Button from '../../shared/ui/button';
import { BORDER_RADIUS, COLORS, SPACING } from '../../core/styles/theme';

const InfoModal = ({
                     visible,
                     title,
                     text,
                     onClose,
  image,
                     buttonText = 'Закрыть'
                   }) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
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
          {image && <Image source={image} style={styles.image} />}


          <Button
            title={buttonText}
            onPress={onClose}
            style={styles.modalButton}
          />
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
  image:{
    width: 240, // В 2 раза больше контейнера для эффекта зума
    height: 200, // В 2 раза больше контейнера для эффекта зума
    alignSelf: 'center',
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  modalButton: {
    alignSelf: 'center',
    minWidth: 120,
  },
});

export default InfoModal;