import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { COLORS, SPACING } from '~/core/styles/theme';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';
import InfoCard from '~/widgets/InfoCard/InfoCard';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';
import InfoModal from '../../../widgets/modal/InfoModal';
import Button from '../../../shared/ui/button';

const GamesList = ({ navigation, points }) => {
  // Mock image for 2048 game card
  const game2048Image = require('~/shared/assets/images/game2048.png');
  const viktorinaImage = require('~/shared/assets/images/viktorina.jpg');
  const [visible,setVisible] = useState(false);

  const handleNavigateToGame = () => {
    navigation.navigate('Game2048');
  };

  const handleNavigateToStore = () => {
    navigation.navigate('GameStore');
  };

  const handleOpen = () => {
    setTimeout(()=>setVisible(true),50);
  };

  const handleClose = () => {
    setTimeout(()=>setVisible(false),50);

  };

  const handleStartQuiz = () => {
    navigation.navigate('QuizScreen', { fromStartButton: true });
  }

  return (
    <ScreenTransition>
      <ScreenBackground
        headerRight={
          <TouchableWithoutFeedback onPress={handleOpen}>

            <MaterialIcons
              name="help-outline"
              size={24}
              color={COLORS.neutral.dark}
            />
          </TouchableWithoutFeedback>
        }
        hasBackButton={false}
        title={
          <View style={styles.headerContent}>
            <Typo variant="hSub" style={styles.title}>
              Игры
            </Typo>
          </View>
        }>
        <View style={styles.container}>
          {/*<Button title="Начать викторину" onPress={handleStartQuiz} />*/}

          <View style={styles.balanceContainer}>
            <InfoCard
              innerStyles={styles.innerStyles}
              value={<Typo> {points}</Typo>}
              label="Баланс: "
            />
            <InfoCard
              onPress={handleNavigateToStore}
              innerStyles={styles.innerStyles}
              value={
                <MaterialIcons name="shopping-cart" size={24} color={COLORS.neutral.darkest} />
              }
              label="Магазин"
            />
          </View>

          <View style={styles.gamesListContainer}>
            <DietOptionCard
              scale={0.5}
              transformY={-50}
              transformX={-120}
              title={
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Typo variant={'h4'}>Викторина</Typo>
                <MaterialIcons style={{alignSelf:'start'}} name="star-border" size={20} color={COLORS.neutral.dark} />

              </View>
            }
              subtitle="Получайте баллы за ответы"
              image={viktorinaImage}
              onPress={handleStartQuiz}
            />
            <DietOptionCard
              title="2048"
              subtitle="Собирай одинаковые числа"
              image={game2048Image}
              onPress={handleNavigateToGame}
            />
          </View>

          <View style={styles.comingSoonContainer}>
            <Typo variant="subtitle1" color={COLORS.primary.main} style={styles.comingSoonText}>
              Скоро добавим новые!
            </Typo>
          </View>
        </View>
      </ScreenBackground>
      <InfoModal
        text={
          <Typo>Копите баллы
            за активности в играх и викторинах
            и обменивайте их на бонусы у наших партнеров!
            {/*<br></br>*/}
            {' '}Баллы можно получить в играх помеченных Звездочкой
            <MaterialIcons name="star-border" size={18} color={COLORS.neutral.dark} />
          </Typo>
       }
        visible={visible}
        onClose={handleClose}
        title="Зачем мне игры?"
      />
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
  innerStyles: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerContent: {
    display: 'flex',
    width: '100%',
    flex: 1,
  },
  balanceContainer: {
    // marginTop: SPACING.xl,
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
  },
});

export default GamesList;
