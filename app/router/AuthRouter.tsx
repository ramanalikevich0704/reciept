import React, { useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/auth/services/firebase/FirebaseConfiguration';
import { useAuthStore } from '@/src/auth/store/useAuthStore';
import { Stack, usePathname, useRouter } from "expo-router";

export default function AuthRouter() {
  const setUser = useAuthStore((state) => state.setUser);
  const isColdStart = useAuthStore((state) => state.isInitialized);
  const path = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const inAuth = path.includes("login"); //сомнительно

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    console.log('Начало процесса навигации')
    if (!isColdStart) return;
    console.log('Дальше')
    const authenticated = !!user;

    if (!authenticated && !inAuth) {
      router.replace("/(auth)/login");
    } else if (authenticated && inAuth) {
      router.replace("/(main)/main");
    }
  }, [isColdStart, user, path]);

  function handleAuthStateChanged(user: User | null
  ) {
    console.log('user:' + user)
    setUser(user);
  }

  if (!isColdStart) return//add loader or splash

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}