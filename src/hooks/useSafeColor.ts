import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

export function useSafeColor() {
    const insets = useSafeAreaInsets();
    NavigationBar.setVisibilityAsync('hidden');

    return insets;
}