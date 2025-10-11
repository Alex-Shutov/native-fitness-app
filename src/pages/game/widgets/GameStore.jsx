import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import {Typo}from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';


const GameStore = ({ navigation, points, onPurchase }) => {
  // Mock images for store items
  const gymImage = require('~/shared/assets/images/breakfast.png');
  const restaurantImage = require('~/shared/assets/images/breakfast.png');

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePurchase = (itemCost) => {
    if (points >= itemCost) {
      onPurchase(itemCost);
      // You could add more feedback here, like an alert
    } else {
      // Not enough points
      Alert.alert(
        "Недостаточно баллов",
        "Играйте в игры, чтобы заработать больше баллов!"
      );
    }
  };

  return (
    <ScreenTransition>
    <ScreenBackground title={ <Typo variant="hSub" style={styles.title}>Магазин</Typo>}>
    <View style={styles.container}>
      <View style={styles.header}>

      </View>

      <View style={styles.storeItemsContainer}>
        {/*<StoreItem*/}
        {/*  title="200 баллов"*/}
        {/*  description="5% скидка в фитнес-зал"*/}
        {/*image={gymImage}*/}
        {/*points={200}*/}
        {/*onPress={() => handlePurchase(200)}*/}
        {/*canPurchase={points >= 200}*/}
        {/*/>*/}

        {/*<StoreItem*/}
        {/*  title="350 баллов"*/}
        {/*  description="15% скидка в сети ресторанов"*/}
        {/*image={restaurantImage}*/}
        {/*points={350}*/}
        {/*onPress={() => handlePurchase(350)}*/}
        {/*canPurchase={points >= 350}*/}
        {/*/>*/}

      </View>
      <View style={styles.comingSoonContainer}>
        <Typo variant="subtitle1" color={COLORS.primary.main} style={styles.comingSoonText}>
          Скоро добавим бонусы от партнеров!
        </Typo>
      </View>
    </View>
    </ScreenBackground>
    </ScreenTransition>
  );
};

const StoreItem = ({ title, description, image, points, onPress, canPurchase }) => {
  return (

      <DietOptionCard
        onPress={onPress}

        disabled={!canPurchase}
        title={title}
        subtitle={description}
        image={image}
        isSelected={false}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page.background,
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: SPACING.xl * 1.2,
  },
  storeItemsContainer: {
    marginTop: SPACING.lg,
  },
  storeItem: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    height: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  disabledItem: {
    opacity: 0.6,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  itemTitle: {
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    color: COLORS.neutral.dark,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'center',
  },

});

export default GameStore;