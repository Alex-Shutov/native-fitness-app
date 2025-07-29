import React from 'react';
import { ScrollView, View,StyleSheet } from 'react-native';
import ToggleGoalButton from '~/pages/onboarding/widgets/ToggleGoalButton';
import { COLORS, FONT_SIZES, SPACING } from '~/core/styles/theme';

const PrimaryGoalGrid = ({
                           goals,
                           selectedGoal,
                           onToggleGoal,
                         }) => {
  const handleToggle = (goalId) => {
    onToggleGoal(goalId);
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.buttonWrapper}>
            <ToggleGoalButton
              inGrid={false}
              textStyle={styles.textButton}
              key={goal.id}
              title={goal.value}
              // icon={goal.icon}
              isSelected={selectedGoal === goal.id}
              onPress={() => handleToggle(goal.id)}
              style={styles.goalButton}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalButton: {
    marginBottom: SPACING.sm * 1.2,
    width: '100%',
    backgroundColor: COLORS.neutral.offWhite,

  },
  textButton:{
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * 1.5,
    textAlign: 'center',
    paddingVertical: 'unset',
  },
  buttonWrapper: {
    width: '100%', // Approximately half the width minus margins
  }
});

export default PrimaryGoalGrid;