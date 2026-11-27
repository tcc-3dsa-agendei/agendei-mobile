import { Tabs } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/colors"
import { useSafeColor } from "@/hooks/useSafeColor";

export default function Layout() {

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

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {display: "none"},
          animation: "shift",
        }}
      >
        <Tabs.Screen name="login"/>
        <Tabs.Screen name="register"/>
      </Tabs>
    </View>
    )
}