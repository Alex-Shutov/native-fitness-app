import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform, ActivityIndicator, Keyboard, ScrollView,
} from 'react-native';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { createTrack, getStartOfWeek } from '~/pages/tracker/lib/utils';
import WeekdaysSelector from '~/pages/tracker/widgets/WeekdaysSelector';
import Button from '~/shared/ui/button';
import CrossIcon from '~/shared/ui/icons/CrossIcon';
import Input from '~/shared/ui/input/input';
import {Typo}from '~/shared/ui/typo';

const AddTrackModal = ({ visible, onClose, onAddTrack }) => {
  const [trackName, setTrackName] = useState('');
  const [selectedDays, setSelectedDays] = useState([0, 0, 0, 0, 0]);
  const [nameError, setNameError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const startDate = getStartOfWeek();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const handleDayToggle = (dayIndex, status) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[dayIndex] = status;
    setSelectedDays(newSelectedDays);
  };

  const validateInput = () => {
    if (!trackName.trim()) {
      setNameError('Введите название трека');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleAddTrack = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      await onAddTrack({
        title: trackName,
        completionStatus: selectedDays,
      });

      // Сбрасываем форму только если успешно
      setTrackName('');
      setSelectedDays([0, 0, 0, 0, 0]);
      onClose();
    } catch (error) {
      console.error('Error adding track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTrackName('');
    setSelectedDays([0, 0, 0, 0, 0]);
    setNameError(null);
    onClose();
  };




  return (
    <Modal statusBarTranslucent={true} visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
              keyboardVerticalOffset={Platform.select({
                ios: 60,
                android: 0
              })}
              enabled={keyboardVisible}
            >
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} style={styles.modalContent}>
                <View style={styles.header}>
                  <Typo variant="body0" weight="medium">
                    Новая цель
                  </Typo>
                  <TouchableOpacity onPress={handleCancel}>
                    <CrossIcon size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <Input
                    placeholder="Название цели"
                    value={trackName}
                    onChangeText={setTrackName}
                    error={nameError}
                    style={styles.input}
                  />

                  <View style={styles.selectorContainer}>
                    <Typo variant="bodyBolder" style={styles.selectorLabel}>
                      Выберите дни
                    </Typo>
                    <WeekdaysSelector
                      selectedDays={selectedDays}
                      onDayToggle={handleDayToggle}
                      startDate={startDate}
                    />
                  </View>
                </View>

                <View style={styles.actions}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.primary.main} />
                  ) : (
                    <Button title="Добавить" onPress={handleAddTrack} style={styles.addButton} />
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
  selectorContainer: {
    marginTop: SPACING.md,
  },
  selectorLabel: {
    textAlign: 'left',
  },
  actions: {
    paddingBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  addButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});

export default AddTrackModal;
