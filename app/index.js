import { View, StyleSheet, Text, TextInput, Pressable, Alert, Button, ScrollView } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageBackground } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {

    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getName, setName] = useState("");

    const [loaded, error] = useFonts(
        {
            'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
            'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
            'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf'),
        },

    );

    useEffect(
        () => {
            async function checkUserInasyncStorage() {
                try {

                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson != null) {
                        router.replace("/home");
                        // AsyncStorage.clear();
                    }

                } catch (e) {
                    console.log(e);
                }
            }
            checkUserInasyncStorage();
        }, []
    );

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const logoPath = require("../assets/images/wechatlogo.png");
    const backgroundPath = require("../assets/images/background.png");

    return (

        <ImageBackground source={backgroundPath} style={style.view1}>

            {/* <StatusBar hidden={true} /> */}

            <ScrollView style={style.scrollview1}>

                <View style={style.view2}>
                    <Image source={logoPath} style={style.image1} contentFit="contain" />
                    <Text style={style.text1}>Account SignIn</Text>
                    <Text style={style.text2}>Welcome to We Chat! Connect with your loved ones safe and secure.</Text>

                    <View style={style.avatar1}>
                        <Text style={style.text6}>{getName}</Text>
                    </View>

                    <Text style={style.text3}>Mobile</Text>
                    <TextInput style={style.input1} inputMode={"numeric"} maxLength={10} onChangeText={
                        (text) => {
                            setMobile(text);
                        }
                    } onEndEditing={
                        async () => {
                            if (getMobile.length == 10) {
                                let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/GetLetters?mobile=" + getMobile);

                                if (response.ok) {
                                    let json = await response.json();
                                    setName(json.letters);
                                }

                            }
                        }
                    }
                    />

                    <Text style={style.text3}>Password</Text>
                    <TextInput style={style.input1} secureTextEntry={true} maxLength={20} onChangeText={
                        (text) => {
                            setPassword(text);
                        }
                    } />

                    <Pressable style={style.pressable1} onPress={async () => {

                        let response = await fetch(
                            "https://3dde-112-134-184-33.ngrok-free.app/WeChat/SignIn",
                            {
                                method: "POST",
                                body: JSON.stringify(
                                    {
                                        mobile: getMobile,
                                        password: getPassword,
                                    }
                                ),
                                headers: {
                                    "Content_Type": "application/json"
                                }
                            }
                        );

                        if (response.ok) {
                            let json = await response.json();

                            if (json.success) {

                                let user = json.user;
                                Alert.alert("Success", json.message);

                                try {
                                    await AsyncStorage.setItem("user", JSON.stringify(user));
                                    router.replace("/home");
                                } catch (e) {

                                    Alert.alert("Error", e.message);

                                }

                            } else {
                                Alert.alert("Error", json.message);
                            }

                        } else {
                            const errorResponse = await response.json(); // Attempt to parse the error response
                            const errorMessage = errorResponse.message || "Failed to login. Please try again."; // Default message if none provided
                            Alert.alert("Error", errorMessage);
                        }

                    }}>
                        <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
                        <Text style={style.text4}>SignIn</Text>
                    </Pressable>

                    <Pressable style={style.pressable2} onPress={() => {
                        router.replace("/signup");
                    }}>
                        <Text style={style.text5}>New Member? Go to SignUp</Text>
                    </Pressable>

                </View>

            </ScrollView>
        </ImageBackground >
    )
}



const style = StyleSheet.create(
    {
        view1: {
            flex: 1,
            justifyContent: "center",

        },
        text1: {
            fontSize: 30,
            fontFamily: "Montserrat-Bold",
            color: "black",
            marginTop: 25,
            backgroundColor:"#c4c5ffc4",
            borderRadius:5,
            padding:5
        },
        text2: {
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
            marginBottom: 10,
            backgroundColor:"#c4c5ffc4",
            borderRadius:5,
            padding:5,
        },
        text3: {
            fontSize: 16,
            fontFamily: "Montserrat-Bold",
            color: "black"
        },
        text4: {
            fontSize: 20,
            fontFamily: "Montserrat-Bold",
            color: "white",
        },
        input1: {
            width: "100%",
            height: 50,
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 15,
            paddingStart: 10,
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
            borderColor: "#5c5eb6",
        },
        pressable1: {
            height: 50,
            width: "100%",
            backgroundColor: "#5c5eb6",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            marginTop: 10,
            flexDirection: "row",
            columnGap: 10,
            alignItems: "center",
        },

        pressable2: {
            height: 25,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginTop: 5,
        },

        text5: {
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
        },
        image1: {
            width: "100%",
            height: 70,
        },
        avatar1: {
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#dcddfe",
            justifyContent: 'center',
            alignSelf: "center",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "#384B70"
        },

        scrollview1: {
            rowGap: 10,
            paddingHorizontal: 20,
        },
        view2: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 40,
            rowGap: 10,
        },
        text6: {
            fontSize: 40,
            fontFamily: "Montserrat-Bold",
            color: "#384B70",
            alignSelf: "center",
        },
    }
);