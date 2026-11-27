import { router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { MainLayout } from "@/components/layout";

type Props = { title: string };

export function AuthUnavailable({ title }: Props) {
  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>Agendei.com</Text>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            Esta função ainda não está disponível. Para agendar, use o link da empresa.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={() => router.replace("/(schedule)/link-page")}
          >
            <Text style={styles.buttonText}>Agendar com link</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  logo: { width: 100, height: 85 },
  brand: { color: Colors.primaria3, fontFamily: Fonts.pBold, fontSize: 28, marginBottom: 24 },
  card: { width: "100%", maxWidth: 420, padding: 20, borderRadius: 10, backgroundColor: Colors.secundaria7 },
  title: { color: Colors.primaria3, fontFamily: Fonts.pBold, fontSize: 21, marginBottom: 12 },
  description: { color: Colors.secundaria5, fontFamily: Fonts.pRegular, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  button: { minHeight: 44, backgroundColor: Colors.primaria3, borderRadius: 6, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  buttonText: { color: Colors.secundaria1, fontFamily: Fonts.pBold, fontSize: 15 },
});
