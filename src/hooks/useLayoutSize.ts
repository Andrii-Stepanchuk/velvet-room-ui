import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

export function useLayoutSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  }, []);
  return { size, onLayout };
}
