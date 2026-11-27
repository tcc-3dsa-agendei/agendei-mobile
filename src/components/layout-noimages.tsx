import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { useDimension } from "@/hooks/useDimension";

import { Colors } from "@/constants/colors";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const { width, height } = useDimension();

  return (
    <View style={style.main}>
      <View style={style.mainback}>
        {/* Estrutura do background */}
        <Image
          source={require("@/assets/images/fundo.jpg")}
          style={style.back}
          resizeMode="contain"
        />
        <LinearGradient
          colors={[Colors.secundaria2, Colors.secundaria2, Colors.secundaria2, "#e9e9e970"]}
          locations={[0.1, 0.5, 0.6, 1]}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
        {/* Fim da estrutura do background */}
      </View>
      <View
        style={{
          position: "absolute",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: width,
          height: height,
        }}
      >
        {children}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
  },
  content: {},
  mainback: {
    position: "relative",
    backgroundColor: Colors.secundaria2,
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
});
