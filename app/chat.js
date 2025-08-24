import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TextInput, Pressable, Alert } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //get Parameters
    const item = useLocalSearchParams();
    // console.log(parameters.other_user_id);

    //store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");

    const [loaded, error] = useFonts(
        {
            "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
            "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        },

    );

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    //fetch chat array from server
    useEffect(
        () => {
            async function fetchChatArray() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
                if (response.ok) {
                    let chatArray = await response.json();
                    //console.log(chatArray);
                    setChatArray(chatArray);
                }
            }
            fetchChatArray();

            setInterval(
                () => {
                    fetchChatArray();
                }, 2000);
        }, []
    );


    if (!loaded && !error) {
        return null;
    }

    const chatBackgroundPath = require("../assets/images/chatBackground.png");

    return (
        <ImageBackground source={chatBackgroundPath} style={styles.view1}>

            {/* <StatusBar hidden={true} /> */}

            <View style={styles.view2}>
                <View style={styles.view3}>
                    {
                        item.avatar_image_found == "true"
                            ? <Image style={styles.image1} source={"https://3dde-112-134-184-33.ngrok-free.app/WeChat/AvatarImages/" + item.other_user_mobile + ".png"} contentFit="contain" />
                            : <Text style={styles.text1}>{item.other_user_avatar_letters}</Text>

                    }
                </View>
                <View style={styles.view4}>
                    <Text style={styles.text2} >{item.other_user_name}</Text>
                    <Text style={styles.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={styles.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? styles.view5_1 : styles.view5_2}>
                                <Text style={styles.text3}>{item.message}</Text>
                                <View style={styles.view6}>
                                    <Text style={styles.text4}>{item.datetime}</Text>
                                    {
                                        item.side == "right"
                                            ? <FontAwesome6 name={"check"} color={item.status == 1 ? "green" : "white"} size={18} />
                                            : null
                                    }
                                </View>
                            </View>

                    }
                    estimatedItemSize={200}

                />

            </View>

            <View style={styles.view7}>
                <TextInput style={styles.input1} value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={styles.pressable1} onPress={
                    async () => {
                        if (getChatText.length == 0) {
                            Alert.alert("Error", "Please Enter Your Message");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                            let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText)
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    // console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }
                    }
                }>
                    <FontAwesome6 name={"paper-plane"} color={"white"} size={20} />

                </Pressable>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create(
    {
        view1: {
            flex: 1,
        },

        view2: {
            marginTop: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            columnGap: 15,
            justifyContent: "center",
            alignItems: "center",
        },

        view3: {
            backgroundColor: "white",
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "dotted",
            borderColor: "red",
            borderWidth: 2,
        },

        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
        },

        text1: {
            fontSize: 35,
            fontFamily: "Montserrat-Bold",
        },

        view4: {
            rowGap: 5,
            backgroundColor: "#c4c5ffc4",
            borderRadius: 5,
            padding: 5
        },

        text2: {
            fontSize: 20,
            fontFamily: "Montserrat-Bold",
        },

        text3: {
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
            color: "white"
        },

        view5_1: {
            backgroundColor: "#5c5eb6",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,
        },

        view5_2: {
            backgroundColor: "#979797",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
        },

        view6: {
            flexDirection: "row",
            columnGap: 10,

        },

        text4: {
            fontSize: 12,
            fontFamily: "Montserrat-Regular",
            color: "white"
        },

        view7: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 10,
            paddingHorizontal: 20,
            marginVertical: 20,

        },

        input1: {
            flex: 1,
            height: 50,
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 45,
            paddingStart: 10,
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
            borderColor: "#5c5eb6",
        },

        pressable1: {
            backgroundColor: "#5c5eb6",
            borderRadius: 20,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
        },

        center_view: {
            flex: 1,
            marginVertical: 20,
        }
    }
)