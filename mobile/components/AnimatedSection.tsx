import { PropsWithChildren, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedSectionProps {
  animation?: 'fadeIn' | 'slideInUp' | 'slideInLeft' | 'slideInRight';
  style?: ViewStyle | ViewStyle[];
}

export default function AnimatedSection({
  children,
  animation = 'fadeIn',
  style,
}: PropsWithChildren<AnimatedSectionProps>) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 500 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value;
    switch (animation) {
      case 'slideInUp':
        return {
          opacity,
          transform: [{ translateY: (1 - opacity) * 50 }],
        };
      case 'slideInLeft':
        return {
          opacity,
          transform: [{ translateX: (1 - opacity) * -50 }],
        };
      case 'slideInRight':
        return {
          opacity,
          transform: [{ translateX: (1 - opacity) * 50 }],
        };
      default:
        return { opacity };
    }
  });

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
