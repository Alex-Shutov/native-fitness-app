import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';
import CrossIcon from '~/shared/ui/icons/CrossIcon';

const PWAInstallPrompt = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkStandalone = () => {
        const standalone =
          window.navigator.standalone ||
          window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);
      };
      checkStandalone();
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', checkStandalone);
      }

      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      setIsIOS(isIOSDevice);

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } else {
      setIsStandalone(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (Platform.OS === 'web') {
      localStorage.setItem('pwa_install_dismissed', 'true');
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const wasDismissed = localStorage.getItem('pwa_install_dismissed') === 'true';
      setDismissed(wasDismissed);
    }
  }, []);

  if (Platform.OS !== 'web' || isStandalone || dismissed) {
    return null;
  }

  if (isIOS) {
    return (
      <View style={styles.iosContainer}>
        <View style={styles.iosBanner}>
          <View style={styles.iosContent}>
            <MaterialIcons name="get-app" size={24} color={COLORS.primary.main} />
            <View style={styles.iosTextContainer}>
              <Typo variant="body2" weight="medium" style={styles.iosTitle}>
                Установите приложение
              </Typo>
              <Typo variant="caption" style={styles.iosText}>
                Нажмите кнопку «Поделиться» внизу, затем «На экран «Домой»»
              </Typo>
            </View>
          </View>
          <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <CrossIcon size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.iosArrow}>
          <MaterialIcons name="arrow-downward" size={24} color={COLORS.primary.main} />
        </View>
      </View>
    );
  }

  if (!isIOS) {
    return (
      <View style={styles.androidContainer}>
        <View style={styles.androidBanner}>
          <MaterialIcons name="get-app" size={24} color={COLORS.primary.main} />
          <View style={styles.androidTextContainer}>
            <Typo variant="body2" weight="medium" style={styles.androidTitle}>
              Установить приложение
            </Typo>
            <Typo variant="caption" style={styles.androidText}>
              Для лучшего опыта использования
            </Typo>
          </View>
          {deferredPrompt && (
            <TouchableOpacity
              style={styles.androidButton}
              onPress={async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  setDismissed(true);
                }
                setDeferredPrompt(null);
              }}>
              <Typo variant="body2" weight="bold" style={styles.androidButtonText}>
                Установить
              </Typo>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <CrossIcon size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  iosContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  iosBanner: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  iosTextContainer: {
    flex: 1,
  },
  iosTitle: {
    marginBottom: 2,
  },
  iosText: {
    color: COLORS.neutral.medium,
  },
  iosArrow: {
    marginTop: SPACING.sm,
  },
  androidContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 1000,
  },
  androidBanner: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  androidTextContainer: {
    flex: 1,
  },
  androidTitle: {
    marginBottom: 2,
  },
  androidText: {
    color: COLORS.neutral.medium,
  },
  androidButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  androidButtonText: {
    color: COLORS.neutral.white,
  },
});

export default PWAInstallPrompt;
