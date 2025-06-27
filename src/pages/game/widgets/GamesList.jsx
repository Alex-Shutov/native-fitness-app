import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '~/core/styles/theme';
import {Typo}from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';
import InfoCard from '~/widgets/InfoCard/InfoCard';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';

const GamesList = ({ navigation, points }) => {
  // Mock image for 2048 game card
  const game2048Image = require('~/shared/assets/images/game2048.png');

  const handleNavigateToGame = () => {
    navigation.navigate('Game2048');
  };

  const handleNavigateToStore = () => {
    navigation.navigate('GameStore');
  };

  return (
    <ScreenTransition>
      <ScreenBackground title={ <Typo variant="hSub" style={styles.title}>Игры</Typo>}>
    <View style={styles.container}>

      <View style={styles.balanceContainer}>
        <InfoCard
          innerStyles={styles.innerStyles}
          value={<Typo> {points}</Typo>}
          label={'Баланс: '}
        />
        <InfoCard
          onPress={handleNavigateToStore}
          innerStyles={styles.innerStyles}
          value={<MaterialIcons name="shopping-cart" size={24} color={COLORS.neutral.darkest} />}
          label={'Магазин'}
        />


      </View>

      <View style={styles.gamesListContainer}>
        <DietOptionCard
          title="2048"
          subtitle="Собирай одинаковые числа"
          image={game2048Image}
          onPress={handleNavigateToGame}
        />
      </View>

      <View style={styles.comingSoonContainer}>
        <Typo
          variant="subtitle1"
          color={COLORS.primary.main}
          style={styles.comingSoonText}
        >
          Скоро добавим новые!
        </Typo>
      </View>

    </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: SPACING.xl * 1.2,
  },
  innerStyles:{
    display:'flex',
    flexDirection: 'row',
  },
  balanceContainer: {
    gap: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  balanceCard: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.md,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  storeButton: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
  },
  gamesListContainer: {
    marginVertical: SPACING.xl,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  comingSoonText: {
    fontStyle: 'italic',
  }
});

export default GamesList;