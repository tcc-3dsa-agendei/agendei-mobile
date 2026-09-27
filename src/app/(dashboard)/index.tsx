import { StyleSheet, View, Text, Image } from "react-native";
import MainLayout from "./layout";

function HomeContent() {
    return (
        <View style={style.main}>
            <View style={style.top}>
                <View style={style.logoArea}>
                    <Image 
                        style={style.logo}
                        source={require("@/assets/logo.png")}
                        resizeMode="stretch"
                    />
                </View>
                <Text style={{
                    color: "#0B4F4A",
                    textAlign: "justify",
                }}>Bem vindo ao Agendei.com</Text>
            </View>
            <View style={style.bot}>

            </View>
        </View>
    )
}

export default function Home() {
    return (
        <MainLayout>
            <HomeContent/>
        </MainLayout>
    )
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
        alignSelf: "center",
        width: 300,
        height: 200,
        backgroundColor: "",
    },
    bot: {
        backgroundColor: "rgba(5, 245, 5, 0.2)",
        width: 100,
        height: 500,
    },
    logo: {
        position: "absolute",
        alignSelf: "center",
        marginTop: 10,
        width: 117,
        height: 90,
    },
    logoArea: {

    }
})