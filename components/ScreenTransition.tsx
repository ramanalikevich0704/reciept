import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 180,
};

type ScreenTransitionProps = {
  children: React.ReactNode;
  /** 'slide' = slide from right + fade, 'fade' = fade only */
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
    }, [type])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
