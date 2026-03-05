import { Stack, Tabs } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main" />
      <Stack.Screen name="reciept-list" />
    </Stack>
  );
}
