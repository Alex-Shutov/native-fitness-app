import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * глобальный свайп с левого края экрана для возврата назад
 * работает только в web/pwa, на native ничего не меняет
 */
export const useSwipeBack = ({ enabled = true, onBack } = {}) => {
  const startXRef = useRef(null);
  const startYRef = useRef(null);
  const onBackRef = useRef(onBack);

  // обновляем ref при изменении onBack, чтобы избежать замыканий
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled || !onBackRef.current) {
      return undefined;
    }

    const EDGE_START = 40; // активируем жест только от левого края
    const THRESHOLD_X = 60; // минимальный горизонтальный сдвиг
    const MAX_DELTA_Y = 60; // ограничиваем вертикальный сдвиг

    const handleTouchStart = (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;

      startXRef.current = touch.clientX;
      startYRef.current = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch || startXRef.current == null || startYRef.current == null) {
        startXRef.current = null;
        startYRef.current = null;
        return;
      }

      const deltaX = touch.clientX - startXRef.current;
      const deltaY = Math.abs(touch.clientY - startYRef.current);

      const startedFromEdge = startXRef.current <= EDGE_START;

      if (startedFromEdge && deltaX > THRESHOLD_X && deltaY < MAX_DELTA_Y) {
        // используем ref вместо прямого вызова, чтобы всегда вызывать актуальную функцию
        const currentOnBack = onBackRef.current;
        if (currentOnBack) {
          currentOnBack();
        }
      }

      startXRef.current = null;
      startYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      startXRef.current = null;
      startYRef.current = null;
    };
  }, [enabled]);
};

