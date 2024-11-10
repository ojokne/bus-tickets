import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { RootProvider, useRoot } from "../context";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useRoot();
  const segments = useSegments();
  const router = useRouter();

  // Handle navigation based on auth status
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
  

    // if (!isAuthenticated && !inAuthGroup ) {
    //   router.replace('/(auth)/login');
    // } else if (isAuthenticated && inAuthGroup) {
    //   router.replace('/(protected)');
    // }
  }, [isAuthenticated, isLoading, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootProvider>
      <ProtectedLayout />
    </RootProvider>
  );
}
