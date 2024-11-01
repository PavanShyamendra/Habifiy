import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Platform, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HabitProvider } from "./habitContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView>
        <SafeAreaView style={styles.AndroidSafeArea} className="bg-[#151817]">
          <ThemeProvider value={DarkTheme}>
            <HabitProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="[id]" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </HabitProvider>
          </ThemeProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
