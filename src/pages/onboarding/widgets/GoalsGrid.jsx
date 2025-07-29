import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import ToggleGoalButton from './ToggleGoalButton';
import { COLORS, SPACING } from '~/core/styles/theme';

const GoalsGrid = ({
                     goals,
                     selectedGoals,
                     onToggleGoal,
                     maxSelection = 10,
                   }) => {
  const handleToggle = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      onToggleGoal(selectedGoals.filter(id => id !== goalId));
    } else if (selectedGoals.length < maxSelection) {
      onToggleGoal([...selectedGoals, goalId]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.grid}>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.buttonWrapper}>
            <ToggleGoalButton
              key={goal.id}
              title={goal.value}
              // icon={goal.icon}
              isSelected={selectedGoals.includes(goal.id)}
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
    marginBottom: SPACING.md,
    width: '100%',
    backgroundColor: COLORS.neutral.white,

  },
  buttonWrapper: {
    width: '48%', // Approximately half the width minus margins
  }
});

export default GoalsGrid;