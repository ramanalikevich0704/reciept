import {
  ALLOWED_TRANSITIONS,
  getNavigationEvent,
  pathToScreenId,
  SCREENS,
} from "@/app/router/navigationGraph";
import checkUserProfileService from "@/src/auth/services/firebase/CheckUserProfileRepository";
import {
  authInstance,
  getCurrentUid,
} from "@/src/auth/services/firebase/FirebaseConfiguration";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import {
  FirebaseAuthTypes,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function AuthRouter() {
  const setUser = useAuthStore((state) => state.setUser);
  const isColdStart = useAuthStore((state) => state.isInitialized);
  const path = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const subscriber = onAuthStateChanged(authInstance, handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (!isColdStart) return;
    checkUserProfileService
      .checkUserProfile(getCurrentUid())
      .then((isProfileFull) => {
        const currentScreen = pathToScreenId(path);
        if (currentScreen === null) return;

        const event = getNavigationEvent(currentScreen, user, !!isProfileFull);
        const nextScreen = event
          ? ALLOWED_TRANSITIONS[currentScreen]?.[event]
          : undefined;

        if (nextScreen) {
          router.replace(SCREENS[nextScreen]);
        }
      });
  }, [isColdStart, user, path]);

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
  }

  if (!isColdStart) return; // add loader or splash

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
}
