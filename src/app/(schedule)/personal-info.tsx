import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";
import {
  Alert,
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

  const scrollToInput: NonNullable<
    React.ComponentProps<typeof TextInput>["onFocus"]
  > = (event) => {
    // Also adjust when focus changes while the keyboard is already open.
    scrollRef.current?.scrollToFocusedInput(event.nativeEvent.target, 50);
  };

  const params = useLocalSearchParams<{
    agenda?: string;
    servicoId?: string;
    servico?: string;
    duracao?: string;
    preco?: string;
    data?: string;
    horario?: string;
  }>();

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function limpar() {
    setNome("");
    setEmail("");
    setTelefone("");
  }

  function proximo() {
    if (nome.trim().length < 6) {
      Alert.alert("Atenção", "Digite seu nome completo.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Atenção", "Digite um e-mail válido.");
      return;
    }

    if (telefone.replace(/\D/g, "").length !== 11) {
      Alert.alert("Atenção", "Digite um telefone com DDD e 11 dígitos.");
      return;
    }

    router.push({
      pathname: "./confirmation",
      params: {
        ...params,
        nome: nome.trim(),
        email: email.trim(),
        telefone,
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
        <Pressable style={style.backIcon} onPress={() => router.back()}>
          <ArrowLeft size={29} color={Colors.primaria3} />
        </Pressable>

        <View style={style.progress}>
          {[1, 2, 3, 4].map((etapa) => (
            <React.Fragment key={etapa}>
              {etapa > 1 && (
                <View
                  style={[
                    style.progressLine,
                    etapa <= 3 && style.activeLine,
                  ]}
                />
              )}

              <View
                style={[style.circle, etapa <= 3 && style.activeCircle]}
              />
            </React.Fragment>
          ))}
        </View>

        <Text style={style.title}>
          Informe seus dados{"\n"}
          pessoais
        </Text>

        <Text style={style.description}>
          Para a criação do seu agendamento, informe seus dados pessoais
          abaixo.
        </Text>

        <View style={style.card}>
          <View style={style.field}>
            <View style={style.secTitle}>
              <Text style={style.secText}>Digite seu nome</Text>
              <View style={style.secLine} />
            </View>

            <Text style={style.hint}>Mínimo 6 caracteres</Text>

            <TextInput
              style={style.input}
              placeholder="Ex: João Silva"
              placeholderTextColor="#888888"
              value={nome}
              onChangeText={setNome}
              onFocus={scrollToInput}
              autoCapitalize="words"
            />
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
              value={email}
              onChangeText={setEmail}
              onFocus={scrollToInput}
            />
          </View>

          <View style={style.field}>
            <View style={style.secTitle}>
              <Text style={style.secText}>Digite seu número</Text>
              <View style={style.secLine} />
            </View>

            <Text style={style.hint}>Mínimo 11 dígitos</Text>

            <TextInput
              style={style.input}
              placeholder="Ex: (19) 99999-9999"
              placeholderTextColor="#888888"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
              onFocus={scrollToInput}
              maxLength={15}
            />
          </View>

          <Pressable style={style.reset} onPress={limpar}>
            <Text style={style.resetText}>Limpar</Text>
          </Pressable>
        </View>

        <View style={style.buttons}>
          <Pressable style={style.buttonBack} onPress={() => router.back()}>
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
