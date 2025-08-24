import { View, StyleSheet, ScrollView, Text, Pressable, Alert, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Image, ImageBackground } from "expo-image";

SplashScreen.preventAutoHideAsync();

export default function searchuser() {

    const searchBackgroundPath = require("../assets/images/chatBackground.png");
    const [getSeatchText, setSearchText] = useState();
    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts(
        {
            "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
            "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        },

    );

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ImageBackground source={searchBackgroundPath} style={styles.view1}>

            <View style={styles.view2}>
                <TextInput style={styles.input1} inputMode={"text"} onChangeText={
                    (text) => {
                        setSearchText(text);
                    }
                } />

                <View style={styles.view3}>
                    <Pressable onPress={
                        async () => {

                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/SearchUser?id=" + user.id + "&text=" + getSeatchText);

                            if (response.ok) {
                                let json = await response.json();
                                if (json.success) {
                                    let chatArray = json.jsonChatArray;
                                    console.log(chatArray);
                                    setChatArray(chatArray);
                                }
                            }
                        }
                    }>
                        <FontAwesome6 name={"magnifying-glass"} color={"white"} size={30} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.view4}>
                { }
                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <Pressable style={styles.view5} onPress={
                                () => {
                                    //Alert.alert("View Chat","User:"+item.other_user_id);
                                    // router.push("/chat?other_user_id="+item.other_user_id);

                                    router.push(
                                        {
                                            pathname: "/chat",
                                            params: item
                                        }
                                    );
                                }
                            }>
                                <View style={styles.chatView}>
                                    <View style={item.other_user_status == 1 ? styles.view6_2 : styles.view6_1}>

                                        {item.avatar_image_found ?
                                            <Image
                                                source={{ uri: "https://3dde-112-134-184-33.ngrok-free.app/WeChat/AvatarImages/" + item.other_user_mobile + ".png" }}
                                                contentFit="contain"
                                                style={styles.image1}
                                            />
                                            :
                                            <Text style={styles.text1}>{item.other_user_avatar_letters}</Text>
                                        }
                                    </View>

                                    <View style={styles.view7}>
                                        <Text style={styles.text2}>{item.other_user_name}</Text>
                                        <Text style={styles.text3} numberOfLines={1}>{item.message}</Text>

                                        <View style={styles.view8}>
                                            <Text style={styles.text4}>{item.dateTime}</Text>
                                            <FontAwesome6 name={"check"} color={item.chat_status_id == 1 ? "green" : "white"} size={18} />
                                        </View>

                                    </View>
                                </View>
                            </Pressable>
                    }
                    estimatedItemSize={200} />

            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create(
    {
        view1: {
            flex: 1
        },

        view2: {
            flexDirection: "row",
            columnGap: 2,
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 15,
        },

        view3: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#8b8df45b",
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "#8b8df4b6"
        },

        view4: {
            flex: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },

        view5: {
            flexDirection: "row",
            marginVertical: 5,
            columnGap: 5,
        },

        view6_1: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#dadada",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "red",
            justifyContent: "center",
            alignItems: "center",
        },

        view6_2: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#dadada",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
        },

        view7: {
            flex: 1
        },

        view8: {
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: 'center',
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
            backgroundColor: "white"
        },

        text1: {
            fontSize: 26,
            fontFamily: "Montserrat-Bold",
            color: "#797bfa"
        },

        text2: {
            fontSize: 20,
            fontFamily: "Montserrat-Bold",
            color: "#797bfa"
        },

        text3: {
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
        },

        text4: {
            fontSize: 12,
            fontFamily: "Montserrat-Regular",
        },

        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "white",
            justifyContent: 'center',
            alignSelf: "center",
        },

        chatView: {
            flex: 1,
            flexDirection: "row",
            columnGap: 10,
            paddingHorizontal: 5,
            paddingVertical: 8,
            backgroundColor: "#8b8df45b",
            borderRadius: 25,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "#8b8df4b6"
        }
    }
);