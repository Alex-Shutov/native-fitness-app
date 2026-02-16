import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './core/providers/navigation';
import RecoilProvider from './core/providers/recoil';
import { useFonts } from '~/core/hooks/useFonts';
import { SnackbarProvider } from '~/core/providers/snackbar';
import { NavigationContainer } from '@react-navigation/native';
import { setNavigationRef } from './shared/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoScreen from './pages/onboarding/VideoScreen';
import * as Sentry from '@sentry/react-native';
// import { SENTRY_DSN } from './shared/api/const';

SplashScreen.preventAutoHideAsync();


const VIDEO_STORAGE_KEY = '@has_watched_intro_video';


const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { fontsLoaded, error } = useFonts();


  useEffect(() => {
    async function prepare() {
      try {
        const value = await AsyncStorage.getItem(VIDEO_STORAGE_KEY);
        // setShowVideo(value !== 'true');
        setAppReady(true);
      } catch (e) {
        console.error('Error reading video watch status:', e);
        // setShowVideo(true);
        setAppReady(true);
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const handleVideoComplete = () => {
    setShowVideo(false);
  };

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady && !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RecoilProvider>
        <SnackbarProvider>
          <NavigationContainer ref={(ref) => setNavigationRef(ref)}>
            {showVideo ? (
              <VideoScreen onComplete={handleVideoComplete} skippable={true} />
            ) : (
              <>
                <Navigation />
                <StatusBar style="auto" />
              </>
            )}

          </NavigationContainer>
        </SnackbarProvider>
      </RecoilProvider>
    </SafeAreaProvider>
  );
};

export default App;
