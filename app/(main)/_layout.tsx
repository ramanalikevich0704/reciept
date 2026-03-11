import { Stack, Tabs } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 320,
      }}
    >
      <Stack.Screen name="main" />
      <Stack.Screen name="reciept-list" />
      <Stack.Screen name="recipe-detail" />
    </Stack>
  );
}
