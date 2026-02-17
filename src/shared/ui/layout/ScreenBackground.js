import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';

import Theme, { COLORS, SPACING } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';
import { StatusBar } from 'expo-status-bar';
import { useSwipeBack } from '~/shared/hooks/useSwipeBack';

const ScreenBackground = ({
  children,
  title,
  backIcon = 'back',
  onBackPress,
  showHeader = true,
  style,
  contentStyle,
  headerStyle,
  titleStyle,
  onPlusPress,
  hasBackButton = true,
  headerRight,
  ...props
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // свайп назад для web/pwa, на native не влияет
  useSwipeBack({
    enabled: hasBackButton,
    onBack: handleBackPress,
  });

  const renderBackButton = () => {
    if (!hasBackButton) return null
    if (backIcon === 'close') {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          accessibilityLabel="Close">
          <Typo variant="h1">×</Typo>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          accessibilityLabel="Back">
          <MaterialIcons name="arrow-back" size={24} color={COLORS.neutral.darkest} />
        </TouchableOpacity>
      );
    }
  };



  const renderPlusButton = () => {
    if (headerRight) {
      return <View
        style={styles.plusButton}
      >
        {headerRight}
      </View>
    }
    if (onPlusPress) {
      return (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={onPlusPress}
          accessibilityLabel="Add">
          {headerRight ?? <MaterialIcons name="add" size={24} color={COLORS.neutral.darkest} />}
        </TouchableOpacity>
      );
    }
    return <View style={styles.backButton} />; // Пустой элемент для сохранения выравнивания
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <StatusBar
        backgroundColor={COLORS.primary.main}
      // barStyle={statusBarStyle}
      />
      <SafeAreaView style={styles.safeArea}>
        {showHeader && (
          <View style={[styles.header, headerStyle]}>
            <View style={styles.headerContent}>
              {renderBackButton()}
              {title && (
                <View>
                  <Typo variant="body0" style={[styles.headerTitle, titleStyle]} align="center">
                    {title}
                  </Typo>
                </View>
              )}
              {renderPlusButton()}
            </View>
          </View>
        )}

        <View style={[styles.contentContainer, contentStyle]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page.background,
  },
  safeArea: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.md,
  },
  header: {
    // ...StyleSheet.,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,

    // padding: SPACING.md,
  },
  backButton: {
    position: 'relative',
    zIndex: 20,
    left: -12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  plusButton: {
    position: 'relative',
    zIndex: 20,
    // right: 42,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Theme.fontSizes.xl,
    lineHeight: Theme.fontSizes.xl * 1.8,
  }
});

export default ScreenBackground;
