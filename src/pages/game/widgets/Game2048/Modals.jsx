import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '~/core/styles/theme';

export const GameOverModal = ({ visible, onRestart, onClose }) => (
  <Modal statusBarTranslucent={true} visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Вы проиграли!</Text>
        <View style={styles.modalButtons}>
        <TouchableOpacity onPress={onRestart} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Начать заново</Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export const GameWonModal = ({ visible, onRestart, onClose }) => (
  <Modal statusBarTranslucent={true} visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Вы победили!</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onRestart} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Начать заново</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons:{
    display: 'flex',
    flexDirection:'row',
    gap:16
  },
  modalText: {
    fontSize: 24,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: COLORS.primary.main,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});