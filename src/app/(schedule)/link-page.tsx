import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { useBookingCompany } from "@/contexts/booking-company";
import { companyIdFromLink, getCompany } from "@/services/company";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MainLayout } from "../../components/layout";

function styleContent(width: number, height: number) {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: width * 0.9,
      alignItems: "center",
    },

    onContent: {
      width: "100%",
      height: height * 0.34,
      alignItems: "center",
      justifyContent: "center",
    },

    logo: {
      width: width * 0.32,
      height: height * 0.13,
    },

    title: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.075,
      marginTop: 5,
    },

    line: {
      width: "75%",
      height: 2,
      backgroundColor: Colors.background,
      marginTop: height * 0.03,
    },

    twContent: {
      width: "82%",
      marginTop: height * 0.005,
    },

    secTitle: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.075,
      lineHeight: width * 0.11,
      marginBottom: height * 0.02,
    },

    description: {
      color: Colors.secundaria5,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.047,
      lineHeight: width * 0.065,
      marginBottom: height * 0.02,
    },

    input: {
      width: "100%",
      height: 43,
      backgroundColor: Colors.secundaria1,
      borderRadius: 6,
      paddingHorizontal: 15,
      fontSize: width * 0.036,
      fontFamily: Fonts.pRegular,
      color: Colors.background,
      elevation: 2,
    },

    btContinue: {
      width: "100%",
      height: 47,
      backgroundColor: Colors.primaria3,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      marginTop: height * 0.03,
      elevation: 2,
    },

    txtBtContinue: {
      color: Colors.secundaria1,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.04,
    },
  });
}

function LinkContent() {
  const router = useRouter();

  const { width, height } = useDimension();
  const style = styleContent(width, height);

  const [link, setLink] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const pending = React.useRef(false);
  const {
    setBookingCompany,
    setSelectedSlot,
    setCustomerDraft,
    appointmentState,
    setAppointmentState,
  } = useBookingCompany();

  async function continuar() {
    if (pending.current) return;
    if (appointmentState.status === "submitting") {
      setError("Aguarde a resposta da reserva em andamento.");
      return;
    }
    if (appointmentState.status === "uncertain") {
      Alert.alert(
        "Resultado da reserva incerto",
        "A reserva anterior pode ter sido criada. Confira com a empresa antes de iniciar outra reserva, pois isso pode gerar duplicidade.",
        [
          { text: "Aguardar", style: "cancel" },
          {
            text: "Habilitar nova reserva",
            onPress: () => setAppointmentState({ status: "idle" }),
          },
        ],
      );
      return;
    }
    pending.current = true;
    setLoading(true);
    setError("");
    setBookingCompany(null);
    setSelectedSlot(null);
    setCustomerDraft(null);
    try {
      const companyId = companyIdFromLink(link);
      const company = await getCompany(companyId);
      setAppointmentState({ status: "idle" });
      setBookingCompany({ id: companyId, company });
      router.push("/(schedule)/services");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível consultar a empresa. Tente novamente.",
      );
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <View style={style.background}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 30,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={style.onContent}>
          <Pressable
            onPress={() => {
              setCustomerDraft(null);
              router.push("/(dashboard)/home");
            }}
            disabled={loading}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={style.logo}
              source={require("@/assets/images/logo.png")}
              resizeMode="contain"
            />

            <Text style={style.title}>Agendei.com</Text>
          </Pressable>
          <View style={style.line} />
        </View>

        <View style={style.twContent}>
          <Text style={style.secTitle}>Agende seu{"\n"}horário</Text>

          <Text style={style.description}>
            Cole o link da agenda da empresa que você recebeu e continue
          </Text>

          <TextInput
            style={style.input}
            placeholder="Cole o link da agenda aqui"
            placeholderTextColor="#808080"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            value={link}
            editable={!loading}
            onChangeText={(value) => {
              setLink(value);
              setError("");
            }}
          />

          {error ? (
            <Text accessibilityRole="alert" style={{ color: "#b42318", marginTop: 8 }}>
              {error}
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              style.btContinue,
              { opacity: loading ? 0.6 : pressed ? 0.8 : 1 },
            ]}
            onPress={continuar}
            disabled={loading}
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            <Text style={style.txtBtContinue}>{loading ? "Consultando..." : "Continuar"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default function LinkPage() {
  return (
    <MainLayout>
      <LinkContent />
    </MainLayout>
  );
}
