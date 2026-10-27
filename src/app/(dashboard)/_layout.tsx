import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useSafeColor } from "@/hooks/useSafeColor";

import { Colors } from "@/constants/colors";


function LayoutContent() {

  const insets = useSafeColor();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: insets.top,
          backgroundColor: Colors.primaria3,
        }}
      />

      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="home"/>
        <Stack.Screen name="about"/>
      </Stack>
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
