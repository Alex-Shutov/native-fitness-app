import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './core/providers/navigation';
import RecoilProvider from './core/providers/recoil';
import { useFonts } from '~/core/hooks/useFonts';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const { fontsLoaded, error } = useFonts();


  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
        <Navigation />
        <StatusBar style="auto" />
      </RecoilProvider>
    </SafeAreaProvider>
  );
};

export default App;
