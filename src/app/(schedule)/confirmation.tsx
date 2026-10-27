
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { useBookingCompany } from "@/contexts/booking-company";
import { personalInfoSchema } from "@/services/personal-info";
import { Redirect, router, useIsFocused, useLocalSearchParams } from "expo-router";
import { AppointmentError, appointmentPayloadSchema, createAppointment, selectedSlotSchema, uncertainAppointmentMessage } from "@/services/appointments";
import { dateInTimeZone, timeInTimeZone } from "@/services/booking-date";
import { getCompany } from "@/services/company";
import { firstIncompleteStep } from "@/services/booking-guard";
import { backOrReplace } from "@/services/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Scissors,
  UserRound,
  Info,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MainLayout } from "../../components/layout-noimages";

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
      paddingTop: height * 0.025,
      paddingBottom: 15,
    },

    backIcon: {
      width: 40,
      height: 40,
      justifyContent: "center",
    },

    progress: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      marginBottom: height * 0.04,
    },

    circle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: Colors.primaria3,
    },

    progressLine: {
      width: width * 0.12,
      height: 2,
      backgroundColor: Colors.primaria3,
    },

    title: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.069,
      lineHeight: width * 0.1,
      marginBottom: 10,
    },

    description: {
      color: Colors.secundaria5,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.039,
      lineHeight: width * 0.058,
      marginBottom: 20,
    },

    card: {
      backgroundColor: "#E9E9E9",
      borderRadius: 9,
      padding: width * 0.035,
      width: "100%",
    },

    company: {
      backgroundColor: Colors.primaria3,
      borderRadius: 6,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: "#E5E5E5",
      marginRight: 10,
    },

    companyInfo: {
      flex: 1,
    },

    companyName: {
      color: "#FFFFFF",
      fontFamily: Fonts.pBold,
      fontSize: width * 0.035,
    },

    companyType: {
      color: "#FFFFFF",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.028,
    },

    companyAddress: {
      width: "43%",
      borderLeftWidth: 1,
      borderColor: "#FFFFFF55",
      paddingLeft: 9,
      flexDirection: "row",
      gap: 5,
    },

    addressText: {
      color: "#FFFFFF",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.019,
      flex: 1,
    },

    divider: {
      height: 1.5,
      backgroundColor: "#CCCCCC",
      marginVertical: 10,
      marginHorizontal: 7,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      padding: 12,
      marginBottom: 7,
      minHeight: 51,
      gap: 10,
    },

    infoContent: {
      flex: 1,
    },

    label: {
      color: "#777777",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.024,
    },

    value: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.029,
    },

    detail: {
      color: Colors.primaria3,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.025,
    },

    notice: {
      backgroundColor: "#D8D8D8",
      borderRadius: 6,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    noticeText: {
      flex: 1,
      color: Colors.primaria3,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.024,
    },

    buttons: {
      flexDirection: "row",
      gap: 7,
      marginTop: 12,
    },

    buttonBack: {
      flex: 1,
      height: 43,
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
    },

    buttonNext: {
      flex: 1,
      height: 43,
      backgroundColor: Colors.primaria3,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 7,
      elevation: 3,
    },

    buttonBackText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.035,
    },

    buttonNextText: {
      color: "#FFFFFF",
      fontFamily: Fonts.pBold,
      fontSize: width * 0.035,
    },
  });
}

function ConfirmationContent() {
  const { width, height } = useDimension();
  const style = styleContent(width, height);
  const {
    bookingCompany, customerDraft, selectedSlot, setSelectedSlot,
    appointmentState, setAppointmentState, setBookingCompany, setCustomerDraft,
  } = useBookingCompany();
  const params = useLocalSearchParams<{ servicoId?: string }>();
  const isFocused = useIsFocused();
  const [error, setError] = React.useState<AppointmentError | null>(null);
  const [recoveryDate, setRecoveryDate] = React.useState<string | undefined>();
  const [recovering, setRecovering] = React.useState(false);
  const pending = React.useRef(false);
  const customer = personalInfoSchema.safeParse(
    customerDraft?.companyId === bookingCompany?.id ? customerDraft?.fields : undefined
  );
  const personalInfo = customer.success ? customer.data : null;
  const selection = selectedSlotSchema.safeParse(selectedSlot);
  const slot = selection.success && selection.data.companyId === bookingCompany?.id &&
    selection.data.serviceId === params.servicoId &&
    dateInTimeZone(new Date(selection.data.startAt), bookingCompany.company.timeZone) === selection.data.date
    ? selection.data : null;
  const servico = bookingCompany?.company.services.find((item) => item.id === slot?.serviceId);
  const enviando = appointmentState.status === "submitting";
  const busy = enviando || recovering;
  const failure = appointmentState.status === "uncertain"
    ? new AppointmentError(uncertainAppointmentMessage, "uncertain") : error;

  async function finalizar() {
    if (pending.current || busy || appointmentState.status !== "idle") return;
    if (!bookingCompany || !servico || !slot || !personalInfo) {
      setError(new AppointmentError("Retorne e preencha todas as etapas antes de finalizar.", "personal-info"));
      return;
    }
    if (Date.parse(slot.startAt) <= Date.now()) {
      setRecoveryDate(slot.date);
      setSelectedSlot(null);
      setError(new AppointmentError("O horário selecionado já passou. Escolha outro horário disponível.", "availability"));
      return;
    }
    const payload = appointmentPayloadSchema.safeParse({
      serviceId: servico.id,
      customerName: personalInfo.name,
      customerEmail: personalInfo.email,
      customerPhone: personalInfo.phone,
      startAt: slot.startAt,
    });
    if (!payload.success) {
      setError(new AppointmentError("Revise seus dados antes de finalizar.", "personal-info"));
      return;
    }
    pending.current = true;
    setError(null);
    setAppointmentState({ status: "submitting" });
    try {
      const appointment = await createAppointment(bookingCompany.id, payload.data);
      setAppointmentState({
        status: "created",
        companyId: bookingCompany.id,
        companyName: bookingCompany.company.name,
        serviceName: servico.name,
        timeZone: bookingCompany.company.timeZone,
        appointment,
      });
      setSelectedSlot(null);
    } catch (err: unknown) {
      const failure = err instanceof AppointmentError ? err : new AppointmentError(
        err instanceof Error ? err.message : "Não foi possível criar a reserva.", "retry"
      );
      if (failure.recovery === "availability" || failure.recovery === "services") {
        setRecoveryDate(slot.date);
        setSelectedSlot(null);
      }
      setError(failure);
      setAppointmentState({ status: failure.recovery === "uncertain" ? "uncertain" : "idle" });
    } finally {
      pending.current = false;
    }
  }

  async function recover() {
    if (!failure || busy) return;
    if (failure.recovery === "uncertain") {
      Alert.alert("Resultado da reserva incerto", uncertainAppointmentMessage, [
        { text: "Aguardar", style: "cancel" },
        { text: "Habilitar nova tentativa", onPress: () => { setAppointmentState({ status: "idle" }); setError(null); } },
      ]);
      return;
    }
    if (failure.recovery === "company") {
      setSelectedSlot(null);
      setCustomerDraft(null);
      setBookingCompany(null);
      router.replace("/(schedule)/link-page");
    } else if (failure.recovery === "availability") {
      const date = recoveryDate ?? slot?.date;
      setSelectedSlot(null);
      router.replace({ pathname: "/(schedule)/datetime", params: { servicoId: params.servicoId, date } });
    } else if (failure.recovery === "services" && bookingCompany) {
      setRecovering(true);
      setSelectedSlot(null);
      try {
        const company = await getCompany(bookingCompany.id);
        setBookingCompany({ id: bookingCompany.id, company });
        router.replace("/(schedule)/services");
      } catch (err: unknown) {
        setError(new AppointmentError(err instanceof Error ? err.message : "Não foi possível atualizar os serviços.", "services"));
      } finally {
        setRecovering(false);
      }
    } else if (failure.recovery === "personal-info") {
      router.replace({ pathname: "/(schedule)/personal-info", params: { servicoId: params.servicoId } });
    } else {
      setError(null);
    }
  }

  if (appointmentState.status === "created") return isFocused ? <Redirect href="/(schedule)/success" /> : null;
  if (isFocused && !failure && !busy) {
    const step = firstIncompleteStep(bookingCompany, params.servicoId, selectedSlot, customerDraft);
    if (step === "link") return <Redirect href="/(schedule)/link-page" />;
    if (step === "services") return <Redirect href="/(schedule)/services" />;
    if (step === "datetime") return <Redirect href={{ pathname: "/(schedule)/datetime", params: { servicoId: params.servicoId } }} />;
    if (step === "personal-info") return <Redirect href={{ pathname: "/(schedule)/personal-info", params: { servicoId: params.servicoId } }} />;
  }
  const dateLabel = slot && bookingCompany ? new Intl.DateTimeFormat("pt-BR", {
    timeZone: bookingCompany.company.timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(slot.startAt)) : "Data não informada";
  const timeLabel = slot && bookingCompany ? timeInTimeZone(slot.startAt, bookingCompany.company.timeZone) : "--";
  const canSubmit = !!(bookingCompany && servico && slot && personalInfo) && !busy && !failure;

  return (
    <View style={style.background}>
      <ScrollView
        style={style.scroll}
        contentContainerStyle={style.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={style.backIcon}
          onPress={() => backOrReplace({ pathname: "/(schedule)/personal-info", params: { servicoId: params.servicoId } })}
          disabled={busy}
        >
          <ArrowLeft size={29} color={Colors.primaria3} />
        </Pressable>

        <View style={style.progress}>
          {[1, 2, 3, 4].map((etapa) => (
            <React.Fragment key={etapa}>
              {etapa > 1 && (
                <View style={style.progressLine} />
              )}
              <View style={style.circle} />
            </React.Fragment>
          ))}
        </View>

        <Text style={style.title}>
          Confira os detalhes{"\n"}
          do seu agendamento
        </Text>

        <Text style={style.description}>
          Veja todas as informações do seu
          agendamento abaixo e finalize com a
          confirmação.
        </Text>

        <View style={style.card}>
          <View style={style.company}>
            <View style={style.avatar} />

            <View style={style.companyInfo}>
              <Text style={style.companyName}>
                {bookingCompany?.company.name ?? "Empresa não informada"}
              </Text>
            </View>
          </View>

          <View style={style.divider} />

          <View style={style.infoRow}>
            <Scissors size={23} color={Colors.primaria3} />

            <View style={style.infoContent}>
              <Text style={style.label}>Serviço</Text>
              <Text style={style.value}>
                {servico?.name ?? "Não informado"}
              </Text>
            </View>

            <Text style={style.detail}>
              {servico ? `${servico.durationInMinutes} minutos` : "--"} |{" "}
              {servico?.price == null ? "Preço não informado" : `Preço: ${servico.price}`}
            </Text>
          </View>

          <View style={style.infoRow}>
            <CalendarDays
              size={23}
              color={Colors.primaria3}
            />

            <View style={style.infoContent}>
              <Text style={style.label}>Data</Text>
              <Text style={style.value}>
                {dateLabel}
              </Text>
            </View>
          </View>

          <View style={style.infoRow}>
            <Clock3 size={23} color={Colors.primaria3} />

            <View style={style.infoContent}>
              <Text style={style.label}>Horário</Text>
              <Text style={style.value}>
                {timeLabel}
              </Text>
            </View>
          </View>

          <View style={style.divider} />

          <View style={style.infoRow}>
            <UserRound
              size={25}
              color={Colors.primaria3}
            />

            <View style={style.infoContent}>
              <Text style={style.label}>Seus dados</Text>
              <Text style={style.value}>
                {personalInfo?.name || "Não informado"}
              </Text>
              <Text style={style.detail}>
                {personalInfo?.email || ""}
              </Text>
              <Text style={style.detail}>
                {personalInfo?.phone || ""}
              </Text>
            </View>
          </View>

          <View style={style.notice}>
            <Info size={17} color={Colors.primaria3} />

            <Text style={style.noticeText}>
              A reserva será concluída quando o servidor confirmar sua criação.
            </Text>
          </View>
        </View>

        {failure && (
          <View style={{ marginTop: 12 }}>
            <Text accessibilityRole="alert" style={style.description}>{failure.message}</Text>
            <Pressable accessibilityRole="button" disabled={busy} onPress={recover}>
              <Text style={style.buttonBackText}>
                {recovering ? "Atualizando..." : failure.recovery === "availability" ? "Escolher outro horário" :
                  failure.recovery === "services" ? "Atualizar serviços" : failure.recovery === "company" ? "Conferir link" :
                  failure.recovery === "personal-info" ? "Revisar dados" : failure.recovery === "uncertain" ? "Sobre uma nova tentativa" : "Revisar e tentar novamente"}
              </Text>
            </Pressable>
          </View>
        )}
        {!failure && !canSubmit && !busy && (
          <Text accessibilityRole="alert" style={style.description}>Retorne e preencha todas as etapas antes de finalizar.</Text>
        )}
        <View style={style.buttons}>
          <Pressable
            style={style.buttonBack}
            onPress={() => backOrReplace({ pathname: "/(schedule)/personal-info", params: { servicoId: params.servicoId } })}
            disabled={busy}
          >
            <Text style={style.buttonBackText}>
              Voltar
            </Text>
          </Pressable>

          <Pressable
            style={[style.buttonNext, { opacity: canSubmit ? 1 : 0.6 }]}
            onPress={finalizar}
            disabled={!canSubmit}
            accessibilityState={{ disabled: !canSubmit, busy: enviando }}
          >
            <Text style={style.buttonNextText}>
              {enviando ? "Enviando..." : "Finalizar"}
            </Text>
            <Check size={17} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default function Confirmation() {
  return (
    <MainLayout>
      <ConfirmationContent />
    </MainLayout>
  );
}
