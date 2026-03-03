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
import { string } from "yup";

export default function AuthRouter() {
  const setUser = useAuthStore((state) => state.setUser);
  const isColdStart = useAuthStore((state) => state.isInitialized);
  const path = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const inAuth = path.includes("login");

  useEffect(() => {
    const subscriber = onAuthStateChanged(authInstance, handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (!isColdStart) return;
    let num: number
    checkUserProfileService
      .checkUserProfile(getCurrentUid())
      .then((isProfileFull) => {
        const onLogin = path.includes("login");
        const onProfile = path.includes("profile");
        const onMain = path.includes("main");
        console.log("НАВИГАААААЦИЯ");
        console.log(isProfileFull, onLogin, onProfile);
        // Нет пользователя → логин (только если ещё не на экране логина)
        // login -> main
        // login -> profile -> main
        if (isProfileFull && onLogin) {
          console.log("1");
          router.replace("/(main)/main");
          console.log(1);
          let numbrt = 1;
          
        } else if (
          !isProfileFull &&
          (user?.phoneNumber ?? user?.email) &&
          onLogin
        ) {
          console.log("2");
          router.replace("/(profile)/profile");
        } else if (onMain || onProfile) {
          console.log("3");
          router.replace("/(auth)/login");
        }
      });
  }, [isColdStart, user]);

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
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
