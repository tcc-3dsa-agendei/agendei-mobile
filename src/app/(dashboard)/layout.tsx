import { StyleSheet, View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <View style={style.main}>
      <View style={style.mainback}>
      {/* Estrutura do background */}
      <Image
        source={require("@/assets/form.png")}
        style={style.image}
        resizeMode="stretch"
      />
      <Image
        source={require("@/assets/form.png")}
        style={style.imagedown}
        resizeMode="stretch"
      />
      <Image
        source={require("@/assets/fundo.jpg")}
        style={style.back}
        resizeMode="contain"
      />
      <LinearGradient
        colors={["#e9e9e9", "#e9e9e9b2", "#e9e9e970"]}
        locations={[0.1, 0.5, 1]}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "50%",
          zIndex: -1,
        }}
      />
      {/* Fim da estrutura do background */}
    </View>
    <View style={style.content}>
      {children}
    </View>
    </View>
    
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
  },
  mainback: {
    position: "relative",
    backgroundColor: "#e9e9e9",
    flex: 1,
    zIndex: -999,
  },
  before: {
    flex: 1,
  },
  image: {
    position: "absolute",
    left: -25,
    top: -10,
    width: 150,
    height: 100,
  },
  imagedown: {
    position: "absolute",
    right: -25,
    bottom: -10,
    width: 150,
    height: 100,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
  back: {
    position: "absolute",
    bottom: -70,
    right: -50,
    width: 530,
    height: 530,
    zIndex: -2,
  },
  content: {
    position: "absolute",
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center"
  }
});
