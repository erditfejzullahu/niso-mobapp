import { AuthProvider } from "@/context/AuthContext";
import { AppToastHost } from "@/components/AppToastHost";
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../assets/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

function AppNavigationShell() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <>
      <GestureHandlerRootView style={styles.flex}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false, gestureEnabled: true }} />
          </QueryClientProvider>
        </AuthProvider>

        <StatusBar style="dark" />
      </GestureHandlerRootView>

      <GestureHandlerRootView style={styles.overlay} pointerEvents="box-none">
        <AppToastHost />
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100000,
    elevation: 100000,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    plight: Poppins_300Light,
    pregular: Poppins_400Regular,
    pmedium: Poppins_500Medium,
    psemibold: Poppins_600SemiBold,
    pbold: Poppins_700Bold,
    pblack: Poppins_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      async function prepare() {
        try {
        } catch (error) {
        } finally {
          await SplashScreen.hideAsync();
        }
      }
      prepare();
    }
  }, [error, loaded]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigationShell />
    </SafeAreaProvider>
  );
}
