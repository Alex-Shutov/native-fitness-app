import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import {Typo}from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';

const Game2048InfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Typo variant="body0" weight="bold" style={styles.modalTitle}>Как играть в 2048</Typo>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={COLORS.neutral.darkest} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Typo variant="body1" weight="bold" style={styles.sectionTitle}>Правила игры</Typo>
              <Typo variant="body2" style={styles.sectionText}>
                2048 — это игра-головоломка, в которой вы объединяете плитки с одинаковыми числами, чтобы получить плитку со значением 2048.
              </Typo>
            </View>

            <View style={styles.section}>
              <Typo variant="body1" weight="bold" style={styles.sectionTitle}>Управление</Typo>
              <Typo variant="body2" style={styles.sectionText}>
                Свайпайте влево, вправо, вверх или вниз, чтобы сдвинуть все плитки в соответствующем направлении. Когда две плитки с одинаковыми числами соприкасаются, они объединяются в одну плитку с удвоенным значением.
              </Typo>
            </View>

            <View style={styles.section}>
              <Typo variant="body1" weight="bold" style={styles.sectionTitle}>Баллы</Typo>
              <Typo variant="body2" style={styles.sectionText}>
                За каждое объединение плиток вы получаете очки, равные значению новой плитки. Ваша цель — набрать как можно больше очков до заполнения всей доски.
              </Typo>
              <Typo variant="body2" style={[styles.sectionText, styles.bonusInfo]}>
                За каждые 100 очков в игре вы получаете 1 балл для магазина!
              </Typo>
            </View>

            <View style={styles.section}>
              <Typo variant="body1" weight="bold" style={styles.sectionTitle}>Советы</Typo>
              <Typo variant="body2" style={styles.sectionText}>
                • Старайтесь держать самые большие значения в углах доски.
              </Typo>
              <Typo variant="body2" style={styles.sectionText}>
                • Сосредоточьтесь на одном направлении для основного перемещения плиток.
              </Typo>
              <Typo variant="body2" style={styles.sectionText}>
                • Избегайте беспорядочных перемещений, чтобы не заблокировать себя.
              </Typo>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Typo variant="body1" color={COLORS.neutral.white}>Закрыть</Typo>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: SPACING.lg,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalBody: {
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.xs,
    color: COLORS.primary.main,
  },
  sectionText: {
    marginBottom: SPACING.sm,
    lineHeight: SPACING.xl,
  },
  bonusInfo: {
    backgroundColor: COLORS.primary.light,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    color: COLORS.neutral.darkest,
    fontWeight: 'bold',
  },
  closeButtonBottom: {
    backgroundColor: COLORS.primary.main,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  }
});

export default Game2048InfoModal;