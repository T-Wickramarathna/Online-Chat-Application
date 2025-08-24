import { View, StyleSheet, ScrollView, Text, Pressable, Alert } from "react-native";
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

export default function home() {

    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts(
        {
            "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
            "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        },

    );

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();
                    if (json.success) {
                        let chatArray = json.jsonChatArray;
                        //console.log(chatArray);
                        setChatArray(chatArray);
                    }
                }

            }

            fetchData();
        }, []
    )

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const logoPath = require("../assets/images/WeChat.png");
    const homeBackgroundPath = require("../assets/images/chatBackground.png");

    return (
        <ImageBackground source={homeBackgroundPath} style={styles.view1}>

            {/* <StatusBar hidden={true} /> */}

            <View style={styles.view2}>
                <View style={styles.view3}>
                    <Image source={logoPath} style={styles.image2} contentFit={"contain"} />
                </View>

                <View style={styles.view4}>
                    <Text style={styles.text1}>WeChat</Text>
                </View>

                <View style={styles.view9}>
                    <View style={styles.view8}>
                        <Pressable onPress={
                            () => {
                                router.push("/searchuser");
                            }
                        }>
                            <FontAwesome6 name={"magnifying-glass"} color={"white"} size={30} />
                        </Pressable>
                    </View>

                    <View style={styles.view8}>
                        <Pressable onPress={
                            () => {
                                router.push("/userprofile");
                            }
                        }>
                            <FontAwesome name={"bars"} color={"white"} size={30} />
                        </Pressable>
                    </View>
                </View>
            </View>


            <View style={styles.flashlist1}>
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
                                            <Text style={styles.text6}>{item.other_user_avatar_letters}</Text>
                                        }
                                    </View>

                                    <View style={styles.view4}>
                                        <Text style={styles.text7}>{item.other_user_name}</Text>
                                        <Text style={styles.text4} numberOfLines={1}>{item.message}</Text>

                                        <View style={styles.view7}>
                                            <Text style={styles.text5}>{item.dateTime}</Text>
                                            <FontAwesome6 name={"check"} color={item.chat_status_id == 1 ? "green" : "white"} size={18} />
                                        </View>

                                    </View>
                                </View>
                            </Pressable>

                    }
                    estimatedItemSize={200}
                />
            </View>

        </ImageBackground>
    )
}



const styles = StyleSheet.create(
    {
        view1: {
            flex: 1,
        },

        flashlist1: {
            flex: 1,
            paddingHorizontal: 2,
            paddingVertical: 2,
            // backgroundColor: "red"
        },

        view2: {
            flexDirection: "row",
            columnGap: 2,
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 10,
            // borderStyle: "solid",
            // borderBottomWidth: 2,
            // borderBottomColor: "#8b8df4"
        },

        view3: {
            width: 60,
            height: 60,
            // backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center"
        },

        view4: {
            flex: 1,
        },

        text1: {
            fontSize: 22,
            fontFamily: "Montserrat-Bold",
            color: "white"
        },

        text2: {
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
        },

        text3: {
            fontSize: 14,
            fontFamily: "Montserrat-Regular",
            alignSelf: "flex-end",
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

        text4: {
            fontSize: 18,
            fontFamily: "Montserrat-Regular",
        },

        text5: {
            fontSize: 12,
            fontFamily: "Montserrat-Regular",

        },

        scrollview1: {
            marginTop: 20,

        },

        view7: {
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: 'center',
        },

        view8: {
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

        view9:{
            flexDirection:"row",
            columnGap:10,
            alignItems:"center",
            backgroundColor: "#6e6fcb",
            borderRadius: 25,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "#8b8df4b6",
            padding:5
        },

        text6: {
            fontSize: 26,
            fontFamily: "Montserrat-Bold",
            color: "#797bfa"
        },

        text7: {
            fontSize: 20,
            fontFamily: "Montserrat-Bold",
            color: "#797bfa"
        },

        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "white",
            justifyContent: 'center',
            alignSelf: "center",
        },

        image2: {
            width: "100%",
            height: 55,
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
)