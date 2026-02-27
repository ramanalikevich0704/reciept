import React, { useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, currentUid } from "@/src/auth/services/firebase/FirebaseConfiguration";
import checkUserProfileService from "@/src/auth/services/firebase/CheckUserProfileRepository";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { Stack, usePathname, useRouter } from "expo-router";

export default function AuthRouter() {
  const setUser = useAuthStore((state) => state.setUser);
  const isColdStart = useAuthStore((state) => state.isInitialized);
  const path = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const inAuth = path.includes("login"); 

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (!isColdStart) return;

    checkUserProfileService.checkUserProfile(currentUid).then((isNotFullUser) => {
      console.log("прошла проверка");
      if (isNotFullUser == null && !inAuth) {
        router.replace("/(auth)/login");
      } else if (!isNotFullUser && user?.email && inAuth) {
        router.replace("/(profile)/profile");
      } else if (isNotFullUser && inAuth) {
        router.replace("/(main)/main");
      }
    });
  }, [isColdStart, user, path]);

  function handleAuthStateChanged(user: User | null) {
    console.log("user:" + user);
    setUser(user);
  }

  if (!isColdStart) return; //add loader or splash

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
}
