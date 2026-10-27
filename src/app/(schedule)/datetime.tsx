
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { Redirect, router, useIsFocused, useLocalSearchParams } from "expo-router";
import { useBookingCompany } from "@/contexts/booking-company";
import { getAvailability, type Slot } from "@/services/availability";
import { dateInTimeZone, timeInTimeZone } from "@/services/booking-date";
import { backOrReplace } from "@/services/navigation";
import { z } from "zod";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react-native";
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

const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

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
      backgroundColor: "#B8B8B8",
    },

    activeCircle: {
      backgroundColor: Colors.primaria3,
    },

    progressLine: {
      width: width * 0.12,
      height: 2,
      backgroundColor: "#B8B8B8",
    },

    activeLine: {
      backgroundColor: Colors.primaria3,
    },

    title: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.073,
      lineHeight: width * 0.105,
      marginBottom: 12,
    },

    description: {
      color: Colors.secundaria5,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.04,
      lineHeight: width * 0.058,
      marginBottom: 20,
    },

    card: {
      width: "100%",
      backgroundColor: "#E9E9E9",
      borderRadius: 9,
      padding: width * 0.045,
    },

    section: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      marginTop: 4,
    },

    sectionText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.039,
    },

    sectionLine: {
      flex: 1,
      height: 1.5,
      backgroundColor: Colors.primaria3,
      marginLeft: 9,
    },

    calendar: {
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      padding: 12,
      marginBottom: 15,
    },

    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    monthText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.035,
      textTransform: "capitalize",
    },

    weekRow: {
      flexDirection: "row",
      marginBottom: 8,
    },

    weekText: {
      width: "14.2857%",
      textAlign: "center",
      fontFamily: Fonts.pBold,
      color: "#666666",
      fontSize: width * 0.028,
    },

    days: {
      flexDirection: "row",
      flexWrap: "wrap",
    },

    day: {
      width: "14.2857%",
      height: 35,
      alignItems: "center",
      justifyContent: "center",
    },

    daySelected: {
      backgroundColor: Colors.primaria3,
      borderRadius: 18,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },

    dayText: {
      color: "#333333",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.032,
    },

    times: {
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      padding: 12,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 10,
    },

    timeButton: {
      width: "30%",
      height: 30,
      borderRadius: 5,
      backgroundColor: "#E9E9E9",
      alignItems: "center",
      justifyContent: "center",
    },

    timeSelected: {
      backgroundColor: Colors.primaria3,
    },

    timeText: {
      color: "#333333",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.029,
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
      elevation: 3,
    },

    buttonText: {
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

function DateTimeContent() {
  const params = useLocalSearchParams<{
    servicoId?: string;
    date?: string;
  }>();
  const { bookingCompany } = useBookingCompany();
  const isFocused = useIsFocused();
  const serviceId = z.uuidv7().safeParse(params.servicoId);
  const service = serviceId.success ? bookingCompany?.company.services.find((item) => item.id === serviceId.data) : undefined;
  if (!bookingCompany) return isFocused ? <Redirect href="/(schedule)/link-page" /> : null;
  if (!service) return isFocused ? <Redirect href="/(schedule)/services" /> : null;
  const date = z.iso.date().safeParse(params.date);
  return <DateTimeSelection key={`${bookingCompany.id}:${service.id}:${date.success ? date.data : ""}`} companyId={bookingCompany.id} serviceId={service.id} timeZone={bookingCompany.company.timeZone} initialDate={date.success ? date.data : undefined} />;
}

type SelectionProps = { companyId: string; serviceId: string; timeZone: string; initialDate?: string };
type AvailabilityState = { key: string; status: "loading" | "ready" | "error"; slots: Slot[]; error?: string };

function DateTimeSelection({ companyId, serviceId, timeZone, initialDate }: SelectionProps) {
  const { width, height } = useDimension();
  const style = styleContent(width, height);
  const { setSelectedSlot } = useBookingCompany();
  const today = dateInTimeZone(new Date(), timeZone);
  const [year, month] = (initialDate ?? today).split("-").map(Number);
  const [mes, setMes] = React.useState(() => new Date(Date.UTC(year, month - 1, 1)));
  const [data, setData] = React.useState(initialDate ?? "");
  const [horario, setHorario] = React.useState("");
  const [attempt, setAttempt] = React.useState(0);
  const [availability, setAvailability] = React.useState<AvailabilityState | null>(null);
  const requestKey = `${companyId}:${serviceId}:${data}:${attempt}`;
  const current = availability?.key === requestKey ? availability : null;

  React.useEffect(() => {
    if (!data) return;
    const controller = new AbortController();
    let active = true;
    setAvailability({ key: requestKey, status: "loading", slots: [] });
    getAvailability(companyId, serviceId, data, controller.signal).then(
      (slots) => { if (active) setAvailability({ key: requestKey, status: "ready", slots }); },
      (error: unknown) => {
        if (active) setAvailability({ key: requestKey, status: "error", slots: [], error: error instanceof Error ? error.message : "Não foi possível consultar os horários." });
      },
    );
    return () => { active = false; controller.abort(); };
  }, [companyId, serviceId, data, requestKey]);

  const primeiroDia = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth(), 1)).getUTCDay();
  const totalDias = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth() + 1, 0)).getUTCDate();
  const dias: (number | null)[] = [
    ...Array<null>(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  function mudarMes(valor: number) {
    setMes(new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth() + valor, 1)));
    setData("");
    setHorario("");
    setSelectedSlot(null);
  }

  function selecionarDia(dia: number) {
    const dataFormatada = `${mes.getUTCFullYear()}-${String(mes.getUTCMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    if (dataFormatada < dateInTimeZone(new Date(), timeZone) || data === dataFormatada) return;
    setData(dataFormatada);
    setAttempt((value) => value + 1);
    setHorario("");
    setSelectedSlot(null);
  }

  function proximo() {
    const slot = current?.status === "ready" ? current.slots.find((item) => item.startAt === horario) : undefined;
    if (!data || !slot) {
      Alert.alert("Atenção", "Selecione uma data e um horário disponível.");
      return;
    }
    setSelectedSlot({ companyId, serviceId, date: data, ...slot });
    router.push({
      pathname: "/(schedule)/personal-info",
      params: { servicoId: serviceId },
    });
  }

  return (
    <View style={style.background}>
      <ScrollView
        style={style.scroll}
        contentContainerStyle={style.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={style.backIcon}
          onPress={() => backOrReplace("/(schedule)/services")}
        >
          <ArrowLeft size={29} color={Colors.primaria3} />
        </Pressable>

        <View style={style.progress}>
          {[1, 2, 3, 4].map((etapa) => (
            <React.Fragment key={etapa}>
              {etapa > 1 && (
                <View
                  style={[
                    style.progressLine,
                    etapa <= 2 && style.activeLine,
                  ]}
                />
              )}

              <View
                style={[
                  style.circle,
                  etapa <= 2 && style.activeCircle,
                ]}
              />
            </React.Fragment>
          ))}
        </View>

        <Text style={style.title}>
          Selecione o horário e{"\n"}
          a data do seu{"\n"}
          agendamento
        </Text>

        <Text style={style.description}>
          Escolha um dia e um horário disponível
          de sua preferência abaixo.
        </Text>

        <View style={style.card}>
          <View style={style.section}>
            <Text style={style.sectionText}>
              Dias disponíveis
            </Text>
            <View style={style.sectionLine} />
          </View>

          <View style={style.calendar}>
            <View style={style.calendarHeader}>
              <Pressable onPress={() => mudarMes(-1)}>
                <ChevronLeft
                  size={22}
                  color={Colors.primaria3}
                />
              </Pressable>

              <Text style={style.monthText}>
                {mes.toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <Pressable onPress={() => mudarMes(1)}>
                <ChevronRight
                  size={22}
                  color={Colors.primaria3}
                />
              </Pressable>
            </View>

            <View style={style.weekRow}>
              {diasSemana.map((dia, index) => (
                <Text key={index} style={style.weekText}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={style.days}>
              {dias.map((dia, index) => {
                if (dia === null) {
                  return (
                    <View key={index} style={style.day} />
                  );
                }

                const dataAtual =
                  `${mes.getUTCFullYear()}-${String(mes.getUTCMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

                const selecionado = data === dataAtual;
                const passado = dataAtual < today;

                return (
                  <Pressable
                    key={index}
                    style={style.day}
                    onPress={() => selecionarDia(dia)}
                    disabled={passado}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: passado, selected: selecionado }}
                  >
                    <View
                      style={
                        selecionado
                          ? style.daySelected
                          : undefined
                      }
                    >
                      <Text
                        style={[
                          style.dayText,
                          passado && { opacity: 0.35 },
                          selecionado && { color: "#FFFFFF" },
                        ]}
                      >
                        {dia}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={style.section}>
            <Text style={style.sectionText}>
              Horários disponíveis
            </Text>
            <View style={style.sectionLine} />
          </View>

          <View style={style.times}>
            {!data && <Text style={style.timeText}>Selecione uma data para consultar os horários.</Text>}
            {data && (!current || current.status === "loading") && <Text style={style.timeText}>Consultando horários...</Text>}
            {current?.status === "error" && (
              <View>
                <Text accessibilityRole="alert" style={style.timeText}>{current.error}</Text>
                <Pressable accessibilityRole="button" onPress={() => { setHorario(""); setSelectedSlot(null); setAttempt((value) => value + 1); }}>
                  <Text style={style.buttonText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}
            {current?.status === "ready" && current.slots.length === 0 && (
              <Text style={style.timeText}>Nenhum horário disponível. Escolha outra data ou serviço.</Text>
            )}
            {current?.status === "ready" && current.slots.map((slot) => {
              const selecionado = horario === slot.startAt;
              return (
                <Pressable
                  key={slot.startAt}
                  style={[style.timeButton, selecionado && style.timeSelected]}
                  onPress={() => { setHorario(slot.startAt); setSelectedSlot(null); }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selecionado }}
                >
                  <Text style={[style.timeText, selecionado && { color: "#FFFFFF" }]}>
                    {timeInTimeZone(slot.startAt, timeZone)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={style.buttons}>
          <Pressable
            style={style.buttonBack}
            onPress={() => backOrReplace("/(schedule)/services")}
          >
            <Text style={style.buttonText}>Voltar</Text>
          </Pressable>

          <Pressable
            style={[style.buttonNext, { opacity: current?.status === "ready" && current.slots.some((slot) => slot.startAt === horario) ? 1 : 0.6 }]}
            onPress={proximo}
            disabled={current?.status !== "ready" || !current.slots.some((slot) => slot.startAt === horario)}
          >
            <Text style={style.buttonNextText}>
              Próximo
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default function DateTime() {
  return (
    <MainLayout>
      <DateTimeContent />
    </MainLayout>
  );
}
