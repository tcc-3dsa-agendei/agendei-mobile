import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider} from "react-native-safe-area-context";
import { useSafeColor } from "@/hooks/useSafeColor";

import { Colors } from "@/constants/colors";
import { BookingCompanyProvider } from "@/contexts/booking-company";


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
        <Stack.Screen name="link-page" />
        <Stack.Screen name="services" />
        <Stack.Screen name="datetime" />
        <Stack.Screen name="personal-info" />
        <Stack.Screen name="confirmation" />
        <Stack.Screen name="success" options={{ gestureEnabled: false }} />
      </Stack>
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <BookingCompanyProvider>
        <LayoutContent />
      </BookingCompanyProvider>
    </SafeAreaProvider>
  );
}
