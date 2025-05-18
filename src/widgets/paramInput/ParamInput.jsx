import React, { useState } from 'react';
import Typo from '~/shared/ui/typo';
import { BORDER_RADIUS, COLORS, FONT_FAMILY, SPACING } from '~/core/styles/theme';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import CrossIcon from '~/shared/ui/icons/CrossIcon';

const ParamInput = ({
                      label,
                      value,
                      onChangeText,
                      placeholder = '--',
                      isSelect = false,
                      options = [],
                      selectedElement = null,
                      keyboardType = "default"
                    }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    if (isSelect) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectOption = (option) => {
    onChangeText(option.value);
    handleCloseModal();
  };

  const renderInputField = () => {
    if (isSelect) {
      // For select mode, render a touchable area that opens the modal
      const selectedOption = options.find(option => option.value === value);

      return (
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          {selectedElement ? (
            selectedElement
          ) : (
            <Typo
              style={[
                styles.parameterInput,
                !selectedOption && styles.placeholderText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Typo>
          )}
        </TouchableOpacity>
      );
    } else {
      // Regular input mode
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.parameterInput}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor={COLORS.neutral.medium}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.parameterInputWrapper}>
      {label && (
        <Typo
          variant="caption"
          color={COLORS.neutral.medium}
          style={styles.parameterLabel}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Typo>
      )}

      {renderInputField()}

      {/* Select Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.header}>
                    <Typo
                      variant="body0"
                      weight="medium"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.modalTitle}
                    >
                      {label || 'Выберите значение'}
                    </Typo>
                    <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                      <CrossIcon size={24}/>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          value === item.value && styles.selectedOption
                        ]}
                        onPress={() => handleSelectOption(item)}
                      >
                        <Typo
                          variant="body1"
                          weight={value === item.value ? "bold" : "regular"}
                          color={value === item.value ? COLORS.primary.main : COLORS.neutral.darkest}
                        >
                          {item.label}
                        </Typo>
                      </TouchableOpacity>
                    )}
                    style={styles.optionsList}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  parameterInputWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.extraLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 48,
  },
  parameterInput: {
    fontFamily: FONT_FAMILY.text.bold,
    fontSize: SPACING.md * 1.2,
    color: COLORS.primary.dark,
    fontWeight: '900',
    padding: 0,
    margin: 0,
    textAlign: 'center',
    width: '100%', // Ensure the text has proper width constraint
  },
  placeholderText: {
    color: COLORS.neutral.medium,
  },
  inputUnit: {
    color: COLORS.neutral.medium,
    marginLeft: SPACING.xs,
  },
  parameterLabel: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  // Modal styles
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
  modalTitle: {
    flex: 1,
    textAlign:'left',
    paddingRight: SPACING.md,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.light,
  },
  selectedOption: {
    backgroundColor: COLORS.primary.extraLight,
  }
});

export default ParamInput;