import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';

const howToGif = require('~/shared/assets/images/game2048-howto.gif');

const Game2048InfoModal = ({ visible, onClose }) => {
  const [gifEnlarged, setGifEnlarged] = useState(false);

  return (
    <>
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
                <Typo variant="body1" weight="bold" style={styles.sectionTitle}>Пример игры</Typo>
                <TouchableOpacity activeOpacity={0.9} onPress={() => setGifEnlarged(true)}>
                  <Image source={howToGif} style={styles.gif} resizeMode="contain" />
                  <View style={styles.gifHint}>
                    <MaterialIcons name="zoom-out-map" size={16} color={COLORS.neutral.white} />
                    <Typo variant="body2" color={COLORS.neutral.white} style={styles.gifHintText}>
                      Нажми, чтобы увеличить
                    </Typo>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Typo variant="body1" color={COLORS.neutral.white}>Закрыть</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={gifEnlarged}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGifEnlarged(false)}
      >
        <TouchableOpacity
          style={styles.fullscreenOverlay}
          activeOpacity={1}
          onPress={() => setGifEnlarged(false)}
        >
          <Image source={howToGif} style={styles.fullscreenGif} resizeMode="contain" />
          <View style={styles.fullscreenClose}>
            <MaterialIcons name="close" size={28} color={COLORS.neutral.white} />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
  },
  gif: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral.light,
  },
  gifHint: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  gifHintText: {
    marginLeft: SPACING.xs,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenGif: {
    width: '100%',
    height: '80%',
  },
  fullscreenClose: {
    position: 'absolute',
    top: SPACING.xxl,
    right: SPACING.xl,
  },
});

export default Game2048InfoModal;