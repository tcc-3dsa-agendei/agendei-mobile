import { useDimension } from "@/hooks/useDimension";
import { Ionicons } from "@expo/vector-icons/";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { Fonts } from "@/constants/fonts";
import { Colors } from "../../constants/colors";
import {MainLayout} from "../../components/layout";

function AboutContent() {
  const router = useRouter();

  const { width, height } = useDimension();

  return (
    <View style={style.main}>
      <Ionicons
        name="arrow-back"
        size={40}
        color={Colors.primaria3}
        style={{
          position: "absolute",
          right: width * -0.2,
          top: 20,
        }}
        onPress={() => router.canGoBack() ? router.back() : router.replace("/(dashboard)/home")}
      />

      <View>
        <Image
          style={{
            position: "absolute",
            right: width * 0.13,
            top: 50,
            width: 117,
            height: 90,
          }}
          source={require("@/assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>
      <Text
        style={{
          top: 140,
          textAlign: "center",
          color: Colors.primaria3,
          fontFamily: Fonts.pBold,
          fontSize: 30,
        }}
      >
        Agendei.com
      </Text>
      {/* Caixa branca */}
      <View
        style={{
          position: "absolute",
          top: height * 0.24,
          justifyContent: "space-between",
          alignSelf: "center",
          width: width * 0.81,
          height: height * 0.7,
          backgroundColor: Colors.clear,
          borderRadius: 5,
          paddingLeft: "6%",
        }}
      >
        <View style={style.upContent}>
          <View>
            <Text
              style={{
                color: Colors.primaria3,
                fontFamily: Fonts.pBold,
                position: "relative",
                top: "50%",
                fontSize: 20,
                marginBottom: "1%",
              }}
            >
              Sobre o Agendei.
              <Text style={{ fontFamily: Fonts.pRegular }}>com</Text>
            </Text>
            <View /* linha */
              style={{
                position: "relative",
                top: "60%",
                width: "57%",
                height: 2,
                backgroundColor: Colors.primaria3,
              }}
            />
          </View>
          <View
            style={{
              position: "relative",
              justifyContent: "space-around",
              width: "100%",
              height: "80%",
            }}
          >
            <Text style={style.text}>
              O Agendei.com é um sistema desenvolvido como Trabalho de Conclusão
              de Curso com o objetivo de facilitar a gestão de agendamentos,
              clientes e informações empresariais.
            </Text>
            <Text style={style.text}>
              Nosso propósito é oferecer uma solução simples, intuitiva e
              eficiente para organizar a rotina de empresas que precisam
              otimizar seu tempo e melhorar o atendimento aos clientes
            </Text>
          </View>
        </View>
        <View style={style.botContent}>
          <Text
            style={{
              color: Colors.primaria3,
              fontFamily: Fonts.pBold,
              position: "relative",
              top: 0,
              fontSize: 20,
              marginBottom: "1%",
            }}
          >
            Nossa equipe
          </Text>
          <View
            style={{
              position: "relative",
              top: "-10%",
              left: "51%",
              width: "49%",
              height: 2,
              backgroundColor: Colors.primaria3,
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              height: "75%",
              borderWidth: 1,
              borderColor: Colors.dark,
            }}
          >
            <Text style={{ textAlign: "justify", width: "50%" }}>
              Onde estarão as informações da equipe
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function About() {
  return (
    <MainLayout>
      <AboutContent />
    </MainLayout>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
  },
  upContent: {
    justifyContent: "space-between",
    width: "100%",
    height: "60%",
  },
  botContent: {
    width: "100%",
    height: "40%",
  },
  text: {
    width: "85%",
    textAlign: "left",
    fontFamily: Fonts.pRegular,
    color: Colors.font,
    fontSize: 13,
  },
});
