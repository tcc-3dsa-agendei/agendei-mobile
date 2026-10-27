import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { MainLayout } from "../../components/layout";

function HomeContent() {
  const router = useRouter();

  return (
    <View style={style.main}>
      <View style={style.top}>
        <View style={style.logoArea}>
          <Image
            style={style.logo}
            source={require("@/assets/images/logo.png")}
            resizeMode="stretch"
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.pBold,
            width: 190,
            fontSize: 25,
            position: "absolute",
            top: "70%",
            color: Colors.primaria3,
            textAlign: "justify",
            alignSelf: "center",
            letterSpacing: 1,
          }}
        >
          Bem vindo ao Agendei.
          <Text
            style={{
              fontFamily: Fonts.pRegular,
            }}
          >
            com
          </Text>
        </Text>
        <View
          style={{
            position: "absolute",
            width: "75%",
            height: 2,
            backgroundColor: Colors.background,
            bottom: -40,
            alignSelf: "center",
          }}
        />
      </View>

      <View style={style.bot}>
        <Text
          style={{
            top: 40,
            textAlign: "center",
            fontSize: 15,
            fontFamily: Fonts.pRegular,
            color: Colors.secundaria5,
          }}
        >
          O Agendei.com é uma plataforma completa para gerenciar clientes,
          serviços e horários em um só lugar, facilitando o dia a dia da sua
          empresa
        </Text>
      </View>

      <View style={style.bottons}>
        <View style={{
          flex: 0,
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          height: 45,
          gap: 1
        }}>
          <Pressable
            style={style.bnt1}
            onPress={() => router.push("/(login)/login")}
            android_ripple={{
              color: Colors.androidRipple,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.pBold,
                color: Colors.secundaria2,
                fontSize: 12,
              }}
            >
              Agendar
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: "15%",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.primaria1,
              borderRadius: 5,
            }}
            onPress={() => router.push("/(schedule)/link-page")}
          >
            <Text style={{
              fontFamily: Fonts.pBold,
              color: Colors.secundaria2,
              fontSize: 12,
            }}>
              <AntDesign name="link" size={20} color={Colors.secundaria2} />
            </Text>
          </Pressable>
        </View>
        <Pressable
          style={style.bnt2}
          onPress={() => router.push("/(dashboard)/about")}
          android_ripple={{
            color: Colors.androidRipple,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.pBold,
              color: Colors.primaria3,
              fontSize: 12,
            }}
          >
            Saiba Mais
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <HomeContent />
    </MainLayout>
  );
}

const style = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    width: "80%",
  },
  top: {
    position: "relative",
    top: -100,
    alignSelf: "center",
    width: 300,
    height: 200,
    backgroundColor: "",
  },
  bot: {
    position: "relative",
    top: -70,
    alignSelf: "center",
    width: "90%",
    height: "40%",
  },
  logo: {
    position: "absolute",
    top: 30,
    left: 80,
    marginTop: 10,
    width: 117,
    height: 90,
  },
  logoArea: {},
  bottons: {
    position: "absolute",
    justifyContent: "space-between",
    top: "63%",
    width: "100%",
    height: 100,
  },
  bnt1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaria3,
    width: "84%",
    height: 45,
    borderRadius: 5,
  },
  bnt2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secundaria2,
    width: "100%",
    height: 45,
    borderRadius: 5,
  },
  active: {
    opacity: 0.5,
  },
});
