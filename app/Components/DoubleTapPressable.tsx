import React, { useState, useRef } from 'react';
import { Pressable, GestureResponderEvent } from 'react-native';

interface DoubleTapPressableProps {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  children: React.ReactNode;
}

const DoubleTapPressable: React.FC<DoubleTapPressableProps> = ({
  onSingleTap,
  onDoubleTap,
  children,
}) => {
  const [lastTap, setLastTap] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePress = (event: GestureResponderEvent): void => {
    // Prevent event propagation
    event.stopPropagation();

    const now = Date.now();

    if (lastTap && now - lastTap < 300) {
      if (timerRef.current) clearTimeout(timerRef.current);
      onDoubleTap?.();
      setLastTap(null);
    } else {
      setLastTap(now);
      timerRef.current = setTimeout(() => {
        onSingleTap?.();
      }, 300);
    }
  };

  return <Pressable onPress={handlePress}>{children}</Pressable>;
};

export default DoubleTapPressable;
