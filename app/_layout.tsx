import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/src/auth/store/useAuthStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.user?.token);
  const inAuth = path.includes("login");//сомнительно

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const authenticated = !!user;

    if (!authenticated && !inAuth) {
      router.replace("/(auth)/login");
    } else if (authenticated && inAuth) {
      router.replace("/(main)/main");
    }

  }, [isInitialized, user, path, token]);

  if (!isInitialized) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
