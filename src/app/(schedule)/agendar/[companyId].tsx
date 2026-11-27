import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { MainLayout } from "@/components/layout";
import { useBookingCompany } from "@/contexts/booking-company";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { getCompany, uuidV7 } from "@/services/company";

export default function BookingLink() {
  const params = useLocalSearchParams<{ companyId?: string }>();
  const { appointmentState, setAppointmentState, setBookingCompany, setSelectedSlot, setCustomerDraft } = useBookingCompany();
  const status = React.useRef(appointmentState.status);
  React.useEffect(() => {
    status.current = appointmentState.status;
  }, [appointmentState.status]);
  const [attempt, setAttempt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useFocusEffect(React.useCallback(() => {
    // A new attempt restarts the lookup while this screen remains focused.
    void attempt;
    const id = uuidV7.safeParse(params.companyId);
    if (!id.success) {
      setLoading(false);
      setError("O link da agenda é inválido. Confira o endereço recebido.");
      return;
    }
    if (status.current === "submitting" || status.current === "uncertain") {
      setLoading(false);
      setError(status.current === "submitting"
        ? "Aguarde a resposta da reserva em andamento."
        : "O resultado da reserva anterior é incerto. Confira com a empresa antes de iniciar outra reserva.");
      return;
    }
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    getCompany(id.data, controller.signal).then((company) => {
      if (!active) return;
      setSelectedSlot(null);
      setCustomerDraft(null);
      setAppointmentState({ status: "idle" });
      setBookingCompany({ id: id.data, company });
      router.replace("/(schedule)/services");
    }).catch((err: unknown) => {
      if (!active) return;
      setError(err instanceof Error ? err.message : "Não foi possível consultar a empresa. Tente novamente.");
      setLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, [params.companyId, attempt, setAppointmentState, setBookingCompany, setCustomerDraft, setSelectedSlot]));

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text style={styles.title}>{loading ? "Consultando agenda..." : "Não foi possível abrir a agenda"}</Text>
        {error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : null}
        {!loading && (
          <>
            <Pressable accessibilityRole="button" style={styles.button} onPress={() => setAttempt((value) => value + 1)}>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.replace("/(schedule)/link-page")}>
              <Text style={styles.secondaryText}>Voltar ao início</Text>
            </Pressable>
          </>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { width: "85%", padding: 20, borderRadius: 8, backgroundColor: "#FFFFFF", gap: 16 },
  title: { color: Colors.primaria3, fontFamily: Fonts.pBold, fontSize: 20 },
  message: { color: Colors.secundaria5, fontFamily: Fonts.pRegular, fontSize: 15 },
  button: { backgroundColor: Colors.primaria3, borderRadius: 6, padding: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontFamily: Fonts.pBold },
  secondary: { padding: 12, alignItems: "center" },
  secondaryText: { color: Colors.primaria3, fontFamily: Fonts.pBold },
});
