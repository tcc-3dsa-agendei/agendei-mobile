import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { Redirect, router, useIsFocused, useLocalSearchParams } from "expo-router";
import { useBookingCompany } from "@/contexts/booking-company";
import {
  emptyPersonalInfo,
  personalInfoSchema,
  type PersonalInfo as PersonalInfoFields,
  type PersonalInfoErrors,
} from "@/services/personal-info";
import { firstIncompleteStep } from "@/services/booking-guard";
import { backOrReplace } from "@/services/navigation";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
      marginBottom: 24,
    },

    card: {
      width: "100%",
      backgroundColor: "#E9E9E9",
      borderRadius: 9,
      padding: width * 0.05,
    },

    field: {
      marginBottom: 22,
    },

    secTitle: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },

    secText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.04,
    },

    secLine: {
      flex: 1,
      height: 1.5,
      backgroundColor: Colors.primaria3,
      marginLeft: 9,
    },

    hint: {
      color: Colors.secundaria5,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.03,
      marginBottom: 5,
    },

    input: {
      width: "100%",
      height: 43,
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
      paddingHorizontal: 15,
      fontFamily: Fonts.pRegular,
      fontSize: width * 0.034,
      color: "#333333",
    },

    error: { color: "#b42318", fontFamily: Fonts.pRegular, fontSize: 13, marginTop: 6 },

    reset: {
      width: "100%",
      height: 37,
      borderWidth: 1,
      borderColor: Colors.primaria3,
      borderRadius: 6,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
    },

    resetText: {
      color: Colors.primaria3,
      fontFamily: Fonts.pBold,
      fontSize: width * 0.034,
    },

    buttons: {
      flexDirection: "row",
      gap: 7,
      marginTop: 14,
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

function PersonalInfoContent() {
  const { width, height } = useDimension();
  const style = styleContent(width, height);
  const scrollRef = React.useRef<KeyboardAwareScrollView>(null);
  const scrollToInput: NonNullable<React.ComponentProps<typeof TextInput>["onFocus"]> = (event) => {
    scrollRef.current?.scrollToFocusedInput(event.nativeEvent.target, 50);
  };

  const params = useLocalSearchParams<{
    servicoId?: string;
  }>();

  const { bookingCompany, selectedSlot, customerDraft, setCustomerDraft } = useBookingCompany();
  const isFocused = useIsFocused();
  const [errors, setErrors] = React.useState<PersonalInfoErrors>({});
  const step = firstIncompleteStep(bookingCompany, params.servicoId, selectedSlot, customerDraft);
  if (step === "link" || !bookingCompany)
    return isFocused ? <Redirect href="/(schedule)/link-page" /> : null;
  if (step === "services") return isFocused ? <Redirect href="/(schedule)/services" /> : null;
  if (step === "datetime")
    return isFocused ? (
      <Redirect
        href={{ pathname: "/(schedule)/datetime", params: { servicoId: params.servicoId } }}
      />
    ) : null;
  const companyId = bookingCompany.id;
  const fields = customerDraft?.companyId === companyId ? customerDraft.fields : emptyPersonalInfo;

  function updateField(field: keyof PersonalInfoFields, value: string) {
    setCustomerDraft((previous) => ({
      companyId,
      fields: {
        ...(previous?.companyId === companyId ? previous.fields : emptyPersonalInfo),
        [field]: value,
      },
    }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function limpar() {
    setCustomerDraft(null);
    setErrors({});
  }

  function proximo() {
    const result = personalInfoSchema.safeParse(fields);
    if (!result.success) {
      const nextErrors: PersonalInfoErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if ((field === "name" || field === "email" || field === "phone") && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    router.push({
      pathname: "/(schedule)/confirmation",
      params: {
        servicoId: params.servicoId,
      },
    });
  }

  return (
    <View style={style.background}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={style.scroll}
        contentContainerStyle={style.content}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          <Pressable
            style={style.backIcon}
            onPress={() =>
              backOrReplace({
                pathname: "/(schedule)/datetime",
                params: { servicoId: params.servicoId },
              })
            }
          >
            <ArrowLeft size={29} color={Colors.primaria3} />
          </Pressable>

          <View style={style.progress}>
            {[1, 2, 3, 4].map((etapa) => (
              <React.Fragment key={etapa}>
                {etapa > 1 && <View style={[style.progressLine, etapa <= 3 && style.activeLine]} />}

                <View style={[style.circle, etapa <= 3 && style.activeCircle]} />
              </React.Fragment>
            ))}
          </View>

          <Text style={style.title}>
            Informe seus dados{"\n"}
            pessoais
          </Text>

          <Text style={style.description}>
            Para a criação do seu agendamento, informe seus dados pessoais abaixo.
          </Text>

          <View style={style.card}>
            <View style={style.field}>
              <View style={style.secTitle}>
                <Text style={style.secText}>Digite seu nome</Text>
                <View style={style.secLine} />
              </View>

              <Text style={style.hint}>De 1 a 150 caracteres</Text>

              <TextInput
                style={style.input}
                placeholder="Ex: João Silva"
                placeholderTextColor="#888888"
                value={fields.name}
                onChangeText={(value) => updateField("name", value)}
                onFocus={scrollToInput}
                autoCapitalize="words"
              />
              {errors.name && (
                <Text accessibilityRole="alert" style={style.error}>
                  {errors.name}
                </Text>
              )}
            </View>

            <View style={style.field}>
              <View style={style.secTitle}>
                <Text style={style.secText}>Digite seu e-mail</Text>
                <View style={style.secLine} />
              </View>

              <Text style={style.hint}>Informe um e-mail válido</Text>

              <TextInput
                style={style.input}
                placeholder="Ex: joaosilva@gmail.com"
                placeholderTextColor="#888888"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={fields.email}
                onChangeText={(value) => updateField("email", value)}
                onFocus={scrollToInput}
              />
              {errors.email && (
                <Text accessibilityRole="alert" style={style.error}>
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={style.field}>
              <View style={style.secTitle}>
                <Text style={style.secText}>Digite seu número</Text>
                <View style={style.secLine} />
              </View>

              <Text style={style.hint}>Telefone brasileiro com DDD, fixo ou celular</Text>

              <TextInput
                style={style.input}
                placeholder="Ex: (19) 99999-9999"
                placeholderTextColor="#888888"
                keyboardType="phone-pad"
                value={fields.phone}
                onChangeText={(value) => updateField("phone", value)}
                onFocus={scrollToInput}
              />
              {errors.phone && (
                <Text accessibilityRole="alert" style={style.error}>
                  {errors.phone}
                </Text>
              )}
            </View>

            <Pressable style={style.reset} onPress={limpar}>
              <Text style={style.resetText}>Limpar</Text>
            </Pressable>
          </View>

          <View style={style.buttons}>
            <Pressable
              style={style.buttonBack}
              onPress={() =>
                backOrReplace({
                  pathname: "/(schedule)/datetime",
                  params: { servicoId: params.servicoId },
                })
              }
            >
              <Text style={style.buttonBackText}>Voltar</Text>
            </Pressable>

            <Pressable style={style.buttonNext} onPress={proximo}>
              <Text style={style.buttonNextText}>Próximo</Text>
            </Pressable>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default function PersonalInfo() {
  return (
    <MainLayout>
      <PersonalInfoContent />
    </MainLayout>
  );
}
