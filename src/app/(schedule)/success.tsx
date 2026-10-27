
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { useBookingCompany } from "@/contexts/booking-company";
import { router, useFocusEffect } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Image,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

    scroll: {
      width: "100%",
      flex: 1,
    },

    content: {
      alignItems: "center",
      paddingTop: height * 0.09,
      paddingBottom: 30,
    },

    onContent: {
      width: "100%",
      alignItems: "center",
      marginBottom: height * 0.045,
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
      width: "70%",
      height: 2,
      backgroundColor: "#C7C7C7",
      marginTop: height * 0.035,
    },

    card: {
      width: "100%",
      minHeight: height * 0.42,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      padding: width * 0.06,
      elevation: 3,
    },

    successCircle: {
      width: width * 0.29,
      height: width * 0.29,
      borderRadius: width * 0.145,
      backgroundColor: Colors.primaria3,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },

    successTitle: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.07,
      textAlign: "center",
    },

    smallLine: {
      width: "40%",
      height: 2,
      backgroundColor: "#C7C7C7",
      marginVertical: height * 0.025,
    },

    successDescription: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.051,
      textAlign: "center",
      lineHeight: width * 0.075,
    },

    details: {
      alignSelf: "stretch",
      marginTop: 20,
      gap: 12,
    },

    detailLabel: {
      color: Colors.secundaria5,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.032,
    },

    detailValue: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.035,
    },

    buttonBack: {
      width: "100%",
      height: 45,
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      elevation: 3,
    },

    buttonBackText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.036,
    },
  });
}

function SuccessContent() {
  const { width, height } = useDimension();
  const style = styleContent(width, height);
  const { appointmentState, setAppointmentState, setCustomerDraft, setBookingCompany, setSelectedSlot } = useBookingCompany();

  const voltar = React.useCallback(() => {
    if (appointmentState.status === "created") {
      setCustomerDraft(null);
      setSelectedSlot(null);
      setBookingCompany(null);
      setAppointmentState({ status: "idle" });
    }
    router.dismissTo("/(schedule)/link-page");
  }, [appointmentState.status, setAppointmentState, setBookingCompany, setCustomerDraft, setSelectedSlot]);

  useFocusEffect(React.useCallback(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      voltar();
      return true;
    });
    return () => subscription.remove();
  }, [voltar]));

  const confirmation = appointmentState.status === "created" ? appointmentState : null;
  const formatInstant = (instant: string, timeZone: string) => new Intl.DateTimeFormat("pt-BR", {
    timeZone, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(instant));

  return (
    <View style={style.background}>
      <ScrollView
        style={style.scroll}
        contentContainerStyle={style.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={style.onContent}>
          <Image
            style={style.logo}
            source={require("@/assets/images/logo.png")}
            resizeMode="contain"
          />

          <Text style={style.title}>
            Agendei.com
          </Text>

          <View style={style.line} />
        </View>

        <View style={style.card}>
          {confirmation ? (
            <>
              <View style={style.successCircle}>
                <Check size={width * 0.19} color="#FFFFFF" strokeWidth={1.5} />
              </View>
              <Text style={style.successTitle}>Tudo certo!</Text>
              <View style={style.smallLine} />
              <Text style={style.successDescription}>Seu agendamento foi criado.</Text>
              <View style={style.details}>
                <View><Text style={style.detailLabel}>Empresa</Text><Text style={style.detailValue}>{confirmation.companyName}</Text></View>
                <View><Text style={style.detailLabel}>Serviço</Text><Text style={style.detailValue}>{confirmation.serviceName}</Text></View>
                <View><Text style={style.detailLabel}>Início</Text><Text style={style.detailValue}>{formatInstant(confirmation.appointment.startAt, confirmation.timeZone)}</Text></View>
                <View><Text style={style.detailLabel}>Término</Text><Text style={style.detailValue}>{formatInstant(confirmation.appointment.endAt, confirmation.timeZone)}</Text></View>
                <View><Text style={style.detailLabel}>Fuso horário</Text><Text style={style.detailValue}>{confirmation.timeZone}</Text></View>
                <View><Text style={style.detailLabel}>Situação</Text><Text style={style.detailValue}>Agendado</Text></View>
                <View><Text style={style.detailLabel}>Código do agendamento</Text><Text selectable style={style.detailValue}>{confirmation.appointment.id}</Text></View>
              </View>
            </>
          ) : (
            <>
              <Text style={style.successTitle}>Confirmação indisponível</Text>
              <View style={style.smallLine} />
              <Text style={style.successDescription}>Não há confirmação de agendamento disponível nesta sessão.</Text>
            </>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            style.buttonBack,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={voltar}
        >
          <Text style={style.buttonBackText}>
            Voltar ao início
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function Success() {
  return (
    <MainLayout>
      <SuccessContent />
    </MainLayout>
  );
}
