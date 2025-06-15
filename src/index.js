import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './core/providers/navigation';
import RecoilProvider from './core/providers/recoil';
import { useFonts } from '~/core/hooks/useFonts';
import { SnackbarProvider } from '~/core/providers/snackbar';
import { NavigationContainer } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const { fontsLoaded, error } = useFonts();


  useEffect(() => {
    async function prepare() {
      try {
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady,fontsLoaded]);

  if (!appReady && !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RecoilProvider>
        <SnackbarProvider>
          <NavigationContainer>

          <Navigation />
          <StatusBar style="auto" />
          </NavigationContainer>
        </SnackbarProvider>
      </RecoilProvider>
    </SafeAreaProvider>
  );
};

export default App;
