import { useEffect } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

export const useSwipeHandler = (handleMove) => {
  const swipeThreshold = 50;

  // Add keyboard input for web platform only
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'ArrowLeft':
            handleMove('left');
            break;
          case 'ArrowRight':
            handleMove('right');
            break;
          case 'ArrowUp':
            handleMove('up');
            break;
          case 'ArrowDown':
            handleMove('down');
            break;
          default:
            return;
        }
      };

      // Adding event listener
      document.addEventListener('keydown', handleKeyDown);

      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleMove]);

  const gestureHandler = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > swipeThreshold) {
          handleMove('right');
        } else if (translationX < -swipeThreshold) {
          handleMove('left');
        }
      } else {
        if (translationY > swipeThreshold) {
          handleMove('down');
        } else if (translationY < -swipeThreshold) {
          handleMove('up');
        }
      }
    }
  };

  return gestureHandler;
};