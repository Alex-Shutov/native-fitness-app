import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import Button from '~/shared/ui/button';
import CrossIcon from '~/shared/ui/icons/CrossIcon';
import Input from '~/shared/ui/input/input';
import { Typo } from '~/shared/ui/typo';

const EditTrackModal = ({ visible, onClose, habit, onSave, onDelete }) => {
  const [trackName, setTrackName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setTrackName(habit?.title || '');
    setNameError(null);
  }, [habit, visible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateInput = () => {
    if (!trackName.trim()) {
      setNameError('Введите название трека');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;
    if (!onSave) return;
    setIsLoading(true);
    try {
      await onSave(trackName.trim());
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNameError(null);
    onClose?.();
  };

  return (
    <Modal
      statusBarTranslucent={true}
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
              keyboardVerticalOffset={Platform.select({
                ios: 60,
                android: 0,
              })}
              enabled={keyboardVisible}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.modalContent}>
                <View style={styles.header}>
                  <Typo variant="body0" weight="medium">
                    Редактирование привычки
                  </Typo>
                  <TouchableOpacity onPress={handleCancel}>
                    <CrossIcon size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <Input
                    placeholder="Название привычки"
                    value={trackName}
                    onChangeText={setTrackName}
                    error={nameError}
                    style={styles.input}
                  />
                </View>

                <View style={[styles.actions, isLoading && styles.addBackground]}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.primary.main} />
                  ) : (
                    <>
                      <Button
                        title="Удалить"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                        variant="secondary"
                      />
                      <Button title="Сохранить" onPress={handleSave} style={styles.saveButton} />
                    </>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.neutral.offWhite,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalContent: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.md,
  },
  actions: {
    paddingBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addBackground: {
    backgroundColor: COLORS.page?.background || COLORS.neutral.offWhite,
  },
  deleteButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});

export default EditTrackModal;

