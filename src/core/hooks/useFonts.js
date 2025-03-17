import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const customFonts = {
  'Lobster-Regular': require('~/shared/assets/fonts/Lobster-Regular.ttf'),
  'Catamaran-SemiBold': require('~/shared/assets/fonts/Catamaran-SemiBold.ttf'),
  'Catamaran-Regular': require('~/shared/assets/fonts/Catamaran-Regular.ttf'),
  'Catamaran-Medium': require('~/shared/assets/fonts/Catamaran-Medium.ttf'),
  'Catamaran-ExtraBold': require('~/shared/assets/fonts/Catamaran-ExtraBold.ttf'),
  'Catamaran-Bold': require('~/shared/assets/fonts/Catamaran-Bold.ttf'),
  'AlegreyaSansSC-Regular': require('~/shared/assets/fonts/AlegreyaSansSC-Regular.ttf'),
  'AlegreyaSansSC-Medium': require('~/shared/assets/fonts/AlegreyaSansSC-Medium.ttf'),
  'AlegreyaSansSC-Bold': require('~/shared/assets/fonts/AlegreyaSansSC-Bold.ttf'),
};

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(customFonts);
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
        setError(e);
        // Even if we have an error, we should set fonts as "loaded" 
        // to prevent the app from getting stuck at the loading screen
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  return { fontsLoaded, error };
};