import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
// import getTokenRepository from "@/src/auth/services/getTokenRepository";
import { useAuthStore } from "@/src/auth/store/useAuthStore";

export default function RootLayout() {
  console.log("RootLayout: ->")
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState("");
  const path = usePathname();
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);
  const token = useAuthStore((state) => state.user?.token);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      console.log("checkAuth: ->");
      console.log(token);
      setHasToken(token);
      setIsReady(true);
    }
    if (!isInitialized) return;
    console.log("isInitialized: ->")
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) {
      console.log("Ждем готовности...");
      return;
    }
    // console.log("isReady: ->")
    // console.log("=== CHECK START ===");
    // console.log("isReady:", isReady);
    // console.log("hasToken:", hasToken);
    // console.log("Current Path:", path);

    const authenticated = !!hasToken;
    const inAuth = path.includes("login");

    // 2. Логика перенаправления без лишних веток
    if (!authenticated && !inAuth) {
      // console.log("ДЕЙСТВИЕ: Гоним на логин");
      router.replace("/(auth)/login");
    } else if (authenticated && inAuth) {
      // console.log("ДЕЙСТВИЕ: Гоним в приложение");
      router.replace("/(main)/main");
    } else {
      // console.log("ДЕЙСТВИЕ: Ничего не делаем, всё ок");
    }

    // console.log("=== CHECK END ===");
  }, [hasToken, isReady, path]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
