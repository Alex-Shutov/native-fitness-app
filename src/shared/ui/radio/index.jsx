import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Typo } from '../typo';
import { COLORS, SPACING } from '../../../core/styles/theme';

const RadioButtonGroup = ({ options, onValueChange, answerChecked,rightAnswer }) => {
  const [selectedValue, setSelectedValue] = React.useState(null);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      {options.map(({ label, value }) => (
        <View key={value} style={styles.radioButtonContainer}>
          <RadioButton
            value={value}
            status={
              answerChecked
                ? value === rightAnswer
                  ? 'checked'
                  : value === selectedValue
                    ? 'checked'
                    : 'unchecked'
                : selectedValue === value
                  ? 'checked'
                  : 'unchecked'
            }
            color={
              answerChecked
                ? value === rightAnswer
                  ? COLORS.functional.success
                  : value === selectedValue
                    ? COLORS.functional.error
                    : undefined
                : undefined
            }
            onPress={() => !answerChecked && handleValueChange(value)}
          />
          <Typo
            variant="body1"
            style={[styles.text,
              answerChecked && value === rightAnswer && styles.correctAnswer,
              answerChecked && value === selectedValue && value !== rightAnswer && styles.wrongAnswer
            ]}
          >
            {label}
          </Typo>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  text:{
    textAlign: 'left',
  },
  correctAnswer: {
    color: COLORS.functional.success,
    fontWeight: 'bold',
  },
  wrongAnswer: {
    color: COLORS.functional.error,
  }
});

export default RadioButtonGroup;