import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

function LayoutContent() {
  const insets = useSafeAreaInsets();
  NavigationBar.setVisibilityAsync("hidden");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: insets.top,
          backgroundColor: "#0e3f3c",
        }}
      />

      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <LayoutContent />
    </SafeAreaProvider>
  );
}
