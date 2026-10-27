import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { useBookingCompany } from "@/contexts/booking-company";
import { backOrReplace } from "@/services/navigation";
import { Redirect, router, useIsFocused } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowLeft, Clock3 } from "lucide-react-native";
import { MainLayout } from "@/components/layout-noimages";

const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

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
    scrollContent: {
      alignItems: "center",
      paddingTop: height * 0.025,
      paddingBottom: 15,
    },
    header: {
      width: "100%",
      height: height * 0.105,
    },
    backIcon: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    progress: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 5,
    },
    progressCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: "#B8B8B8",
    },
    progressActive: {
      backgroundColor: Colors.primaria3,
    },
    progressLine: {
      width: width * 0.12,
      height: 2,
      backgroundColor: "#C5C5C5",
    },
    titleContent: {
      width: "100%",
      paddingHorizontal: width * 0.025,
      marginTop: height * 0.015,
      marginBottom: height * 0.02,
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
      fontSize: width * 0.041,
      lineHeight: width * 0.059,
    },
    card: {
      width: "100%",
      backgroundColor: "#E9E9E9",
      borderRadius: 10,
      padding: width * 0.045,
    },

    company: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 7,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 13,
    },

    companyName: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.041,
    },
    infoContent: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },
    infoCard: {
      flex: 1,
      minHeight: 87,
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      padding: 10,
    },
    infoTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginBottom: 7,
    },
    infoTitleText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.027,
    },
    infoDescription: {
      color: "#666666",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.025,
      lineHeight: 15,
    },
    sectionTitle: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 13,
      paddingHorizontal: 7,
    },
    sectionText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.04,
    },
    sectionLine: {
      flex: 1,
      height: 2,
      backgroundColor: Colors.primaria3,
      marginLeft: 10,
    },
    service: {
      width: "100%",
      minHeight: 43,
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      marginBottom: 7,
      paddingHorizontal: 14,
      paddingVertical: 7,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },
    serviceSelected: {
      borderColor: Colors.primaria3,
      backgroundColor: "#F3FAF8",
    },
    serviceCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#D8D8D8",
      marginRight: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    serviceCircleSelected: {
      backgroundColor: Colors.primaria3,
    },
    serviceName: {
      color: "#111111",
      fontFamily: Fonts.pBold,
      fontSize: width * 0.028,
    },
    serviceDetails: {
      color: "#333333",
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.027,
    },
    buttons: {
      width: "100%",
      flexDirection: "row",
      gap: 7,
      paddingTop: 10,
      paddingBottom: 12,
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

function SelectServiceContent() {
  const { width, height } = useDimension();
  const style = styleContent(width, height);
  const { bookingCompany, setSelectedSlot } = useBookingCompany();
  const isFocused = useIsFocused();
  const [servicoSelecionado, setServicoSelecionado] = React.useState<
    { companyId: string; serviceId: string } | null
  >(null);

  if (!bookingCompany) return isFocused ? <Redirect href="/(schedule)/link-page" /> : null;
  const { company } = bookingCompany;
  const servicos = company.services;
  const servico = servicoSelecionado?.companyId === bookingCompany.id
    ? servicos.find((item) => item.id === servicoSelecionado.serviceId)
    : undefined;

  function proximo() {
    if (!servico) return;

    router.push({
      pathname: "/(schedule)/datetime",
      params: {
        servicoId: servico.id,
      },
    });
  }

  return (
    <View style={style.background}>
      <ScrollView
        style={style.scroll}
        contentContainerStyle={style.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={style.header}>
          <Pressable style={style.backIcon} onPress={() => backOrReplace("/(schedule)/link-page")}>
            <ArrowLeft size={29} color={Colors.primaria3} />
          </Pressable>

          <View style={style.progress}>
            {[1, 2, 3, 4].map((etapa) => (
              <React.Fragment key={etapa}>
                {etapa > 1 && <View style={style.progressLine} />}

                <View
                  style={[
                    style.progressCircle,

                    etapa === 1 && style.progressActive,
                  ]}
                />
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={style.titleContent}>
          <Text style={style.title}>
            Confira as{"\n"}
            informações e{"\n"}
            selecione um serviço
          </Text>

          <Text style={style.description}>
            Confira os detalhes da agenda e selecione um dos serviços
            disponíveis abaixo
          </Text>
        </View>

        <View style={style.card}>
          <View style={style.company}>
            <View>
              <Text style={style.companyName}>{company.name}</Text>
            </View>
          </View>

          <View style={style.infoContent}>
            <View style={style.infoCard}>
              <View style={style.infoTitle}>
                <Clock3 size={15} color={Colors.primaria3} />

                <Text style={style.infoTitleText}>Funcionamento</Text>
              </View>

              <Text style={style.infoDescription}>
                {company.schedules.length === 0
                  ? "Não informado"
                  : company.schedules.map((schedule) =>
                      `${diasSemana[schedule.weekDay]}: ${schedule.startTime} - ${schedule.endTime}`
                    ).join("\n")}
              </Text>
            </View>
          </View>

          <View style={style.sectionTitle}>
            <Text style={style.sectionText}>Serviços disponíveis</Text>

            <View style={style.sectionLine} />
          </View>

          {servicos.length === 0 && <Text style={style.infoDescription}>Nenhum serviço disponível.</Text>}
          {servicos.map((servico) => {
            const selecionado = servicoSelecionado?.companyId === bookingCompany.id &&
              servicoSelecionado.serviceId === servico.id;

            return (
              <Pressable
                key={servico.id}
                style={[style.service, selecionado && style.serviceSelected]}
                onPress={() => {
                  setSelectedSlot(null);
                  setServicoSelecionado({ companyId: bookingCompany.id, serviceId: servico.id });
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: selecionado }}
              >
                <View
                  style={[
                    style.serviceCircle,

                    selecionado && style.serviceCircleSelected,
                  ]}
                >
                  {selecionado && <Text style={{ color: "#FFFFFF" }}>✓</Text>}
                </View>

                <View>
                  <Text style={style.serviceName}>{servico.name}</Text>

                  {servico.description ? (
                    <Text style={style.serviceDetails}>{servico.description}</Text>
                  ) : null}

                  <Text style={style.serviceDetails}>
                    {servico.durationInMinutes} minutos | {servico.price === null ? "Preço não informado" : `Preço: ${servico.price}`}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={style.buttons}>
          <Pressable style={style.buttonBack} onPress={() => backOrReplace("/(schedule)/link-page")}>
            <Text style={style.buttonBackText}>Voltar</Text>
          </Pressable>

          <Pressable
            style={[
              style.buttonNext,

              {
                opacity: !servico ? 0.65 : 1,
              },
            ]}
            onPress={proximo}
            disabled={!servico}
            accessibilityState={{ disabled: !servico }}
          >
            <Text style={style.buttonNextText}>Próximo</Text>
          </Pressable>
        </View>
        {!servico && servicos.length > 0 && (
          <Text style={style.infoDescription}>Selecione um serviço para continuar.</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default function SelectService() {
  return (
    <MainLayout>
      <SelectServiceContent />
    </MainLayout>
  );
}
