import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useDimension } from "@/hooks/useDimension";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";
import {
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
      justifyContent: "center",
    },
    key: {
      flexGrow: 1,
      justifyContent: "center",
      alignContent: "center",
      width: width * 0.9,
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
      color: "black",
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

  function continuar() {
    if (link.trim() === "") {
      return;
    }

    // Futuramente, consultar a agenda pelo link.
    console.log("Link informado:", link);
  }

  return (
    <View style={style.background}>
      <KeyboardAwareScrollView
        contentContainerStyle={style.key}
        enableOnAndroid={true}
        extraScrollHeight={5}
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          style={{ width: "100%",
            height: height * 0.5,
           }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 0,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={style.onContent}>
            <Pressable
              onPress={() => router.push("/(dashboard)")}
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
              onChangeText={setLink}
            />

            <Pressable
              style={({ pressed }) => [
                style.btContinue,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={continuar}
            >
              <Text style={style.txtBtContinue}>Continuar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
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
