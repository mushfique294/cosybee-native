import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

import "@/src/geofence/geofence.task";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { ThemeProvider, useTheme } from "@/src/theme/ThemeProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

const queryClient = new QueryClient();
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const resolvedTheme = theme === "system" ? colorScheme : theme;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationThemeProvider
          value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(notifications)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="device-discovery"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="geofence-test"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </NavigationThemeProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
