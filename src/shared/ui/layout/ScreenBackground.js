import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';

import Theme, { COLORS, SPACING } from '~/core/styles/theme';
import Typo from '~/shared/ui/typo';

const ScreenBackground = ({
  children,
  title,
  backIcon = 'back',
  onBackPress,
  showHeader = true,
  style,
  contentStyle,
  headerStyle,
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

  const renderBackButton = () => {
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

  return (
    <View style={[styles.container, style]} {...props}>
      <SafeAreaView style={styles.safeArea}>
        {showHeader && (
          <View style={[styles.header, headerStyle]}>
            <View style={styles.headerContent}>
              {renderBackButton()}
              {title && (
                <View>
                  <Typo variant="body0"  style={styles.headerTitle} align="center">
                    {title}
                  </Typo>
                </View>
              )}
              <View style={styles.backButton} />
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
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: SPACING.md,
  },
  backButton: {
    position: 'relative',
    left: -12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle:{
    fontSize: Theme.fontSizes.xl,
    lineHeight: Theme.fontSizes.xl *1.5,
  }
});

export default ScreenBackground;
