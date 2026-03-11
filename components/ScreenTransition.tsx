import { Styles } from "@/components/styles/LoginStyles";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 100,
  stiffness: 180,
};

type ScreenTransitionProps = {
  children: React.ReactNode;
  type?: "slide" | "fade";
};

export function ScreenTransition({
  children,
  type = "slide",
}: ScreenTransitionProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(type === "slide" ? 24 : 0);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      translateX.value = type === "slide" ? 24 : 0;
      opacity.value = withTiming(1, { duration: 280 });
      translateX.value = withSpring(0, SPRING_CONFIG);
      return () => {};
    }, [type]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={Styles.container}>
      <Animated.View style={[Styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}
