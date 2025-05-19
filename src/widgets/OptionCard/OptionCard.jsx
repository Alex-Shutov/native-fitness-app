import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import Typo from '~/shared/ui/typo';
import { BORDER_RADIUS, COLORS, SPACING } from '~/core/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export const DietOptionCard = ({ disabled=false, title, subtitle, image, isSelected, onPress,scale=1,transformX=0,transformY=0,imageFocus = { x: 0.5, y: 0.5 } }) => {

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : styles.cardUnselected
      ]}
    >
      {isSelected && (
        <LinearGradient
          colors={[COLORS.primary.lightSecond, COLORS.neutral.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardGradient}
        />
      )}
      <View style={styles.cardContentContainer}>
        <View style={styles.cardTextContainer}>
          <Typo style={styles.cardText} variant="bodyBolder" weight="bold">
            {title}
          </Typo>
          <Typo style={styles.cardText} variant="body2" color={COLORS.neutral.dark}>{subtitle}</Typo>
        </View>
      </View>
      <View style={styles.cardImageWrapper}>
        <Image
          source={image}
          style={[
            styles.cardImage,
            {
              transform: [
                { translateX: transformX * imageFocus.x },
                { translateY: transformY * imageFocus.y },
                { scale }
              ]
            }
          ]}
          resizeMode="cover"
        />
      </View>
      {disabled && (
        <View style={styles.itemOverlay}>
          <MaterialIcons name="lock" size={24} color={COLORS.neutral.light} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    height: 80,
    flexDirection: 'row',
    position: 'relative',
  },
  cardSelected: {
    backgroundColor: 'transparent',
  },
  cardUnselected: {
    backgroundColor: COLORS.neutral.white,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContentContainer: {
    // flex: 1,
    paddingVertical: SPACING.md,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
    zIndex: 1, // Чтобы текст был поверх градиента
  },
  cardTextContainer: {
  },
  cardText:{
    textAlign: 'left',
  },
  cardImageWrapper: {
    top:-10,
    width: 80,
    height: 100,
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
    borderTopRightRadius: BORDER_RADIUS.lg,
    borderTopLeftRadius: BORDER_RADIUS.lg*3,
    borderBottomLeftRadius: BORDER_RADIUS.lg*3,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  cardImageScaler: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  itemOverlay: {
    borderRadius: BORDER_RADIUS.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: 200, // В 2 раза больше контейнера для эффекта зума
    height: 160, // В 2 раза больше контейнера для эффекта зума
    position: 'absolute',
  },
})