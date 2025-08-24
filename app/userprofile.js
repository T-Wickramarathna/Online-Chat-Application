import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function userprofile() {

    const [getImage, setImage] = useState(null);


    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getFirstName, setFirstName] = useState("");
    const [getLastName, setLastName] = useState("");
    const [getAvatarImage, setAvatarImage] = useState("");
    const [getNameLetters, setNameLetters] = useState("");
    const [getDate, setDate] = useState();

    const [getSearchUser, setSearchUser] = useState("");

    const [loaded, error] = useFonts(
        {
            "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
            "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        },

    );

    useEffect(
        () => {
            async function clearCache() {
                await Image.clearDiskCache();
                await Image.clearMemoryCache();
            }
            clearCache();
        }, []
    );

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    useEffect(
        () => {
            async function fetchUserDetails() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch("https://3dde-112-134-184-33.ngrok-free.app/WeChat/UserProfileDetails?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                        let searchUser = json.userDetails;
                        // setSearchUser(searchUser);
                        // console.log(searchUser);
                        // console.log(getUserDetails.user_first_name);
                        setFirstName(searchUser.user_first_name);
                        setLastName(searchUser.user_last_name);
                        setPassword(searchUser.password);
                        setMobile(searchUser.mobile);
                        setAvatarImage(searchUser.avatar_image_found);
                        setNameLetters(searchUser.user_avatar_letters);
                        setDate(searchUser.dateTime);
                    }
                }
            }

            fetchUserDetails();
        }, []
    );

    const profileBackgroundPath = require("../assets/images/chatBackground.png");

    return (
        <ImageBackground source={profileBackgroundPath} style={styles.view1}>

            <View style={styles.view2}>
                <View style={styles.view3}>
                    <Text style={styles.text1}>Settings</Text>
                    <FontAwesome6 name={"gear"} color={"black"} size={30} />
                </View>
            </View>

            <ScrollView style={styles.bodyView}>

                <View style={styles.view4}>

                    <Pressable style={styles.avatar1} onPress={
                        async () => {
                            let result = await ImagePicker.launchImageLibraryAsync();

                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }
                        }
                    }>
                        {
                            getImage ?
                                (<Image source={getImage} style={styles.avatar1} contentFit="contain" />)

                                :
                                getAvatarImage
                                    ?
                                    (<Image
                                        source={{ uri: "https://3dde-112-134-184-33.ngrok-free.app/WeChat/AvatarImages/" + getMobile + ".png" }}
                                        contentFit="contain"
                                        style={styles.avatar1}
                                    />)
                                    :
                                    (<Text style={styles.text5}>{getNameLetters}</Text>)
                        }
                    </Pressable>

                    <View style={styles.view5}>
                        <Text style={styles.text1}>Hi! Welcome to WeChat,</Text>
                        <Text style={styles.text2}>{getFirstName + " " + getLastName}</Text>
                    </View>
                </View>

                <View style={styles.view6}>

                    <Text style={styles.text3}>First Name</Text>
                    <TextInput style={styles.input1} inputMode={"text"} value={getFirstName} onChangeText={
                        (text) => {
                            setFirstName(text);
                        }
                    }
                    />

                    <Text style={styles.text3}>Last Name</Text>
                    <TextInput style={styles.input1} inputMode={"text"} value={getLastName} onChangeText={
                        (text) => {
                            setLastName(text);
                        }
                    }
                    />

                    <Text style={styles.text3}>Registered Date</Text>
                    <TextInput style={styles.input1} inputMode={"text"} value={getDate} editable={false} />

                    <Text style={styles.text3}>Password</Text>
                    <TextInput style={styles.input1} maxLength={20} value={getPassword} onChangeText={
                        (text) => {
                            setPassword(text);
                        }
                    }
                    />

                    <Pressable style={styles.pressable2} onPress={
                        async () => {

                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let formData = new FormData();
                            formData.append("userId", user.id);
                            formData.append("firstName", getFirstName);
                            formData.append("lastName", getLastName);
                            formData.append("password", getPassword);

                            if (getImage != null) {
                                formData.append("avatarImage", {
                                    name: "avatar.png",
                                    type: "image/png",
                                    uri: getImage
                                });
                            };

                            let response = await fetch(
                                "https://3dde-112-134-184-33.ngrok-free.app/WeChat/UserProfileUpdate",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            );

                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    Alert.alert("Success", json.message);
                                    router.push("/home");
                                } else {
                                    Alert.alert("Error", json.message);
                                }
                            }
                        }
                    }>
                        <Text style={styles.text6}>Update Profile</Text>
                    </Pressable>

                    <Pressable style={styles.pressable1} onPress={
                        () => {
                            AsyncStorage.clear();
                            router.replace("/");
                        }
                    }>
                        <Text style={styles.text4}>Log Out</Text>
                        <FontAwesome6 name={"arrow-right-from-bracket"} color={"white"} size={30} />
                    </Pressable>

                </View>

            </ScrollView>

        </ImageBackground>
    );
}

const styles = StyleSheet.create(
    {
        view1: {
            flex: 1,
        },

        bodyView: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 20
        },

        view2: {
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
        },

        view3: {
            flexDirection: "row",
            columnGap: 5,
            backgroundColor: "#c4c5ffc4",
            borderRadius: 5,
            padding: 5,
            marginTop: 10
        },

        view4: {
            flexDirection: "row",
            columnGap: 10,
            padding: 5,
            alignItems: "center",
            borderStyle: "solid",
            borderBottomWidth: 2,
            borderBottomColor: "#9d9d9d",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
        },

        view5: {
            flex: 1,
        },

        view6: {
            flex: 1,
            rowGap: 10,
            marginTop: 20,
        },

        avatar1: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#dcddfe",
            justifyContent: 'center',
            alignSelf: "center",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "#384B70"
        },

        pressable1: {
            height: 50,
            width: "100%",
            backgroundColor: "#5c5eb6",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            marginTop: 2,
            flexDirection: "row",
            columnGap: 10,
            alignItems: "center",
        },

        pressable2: {
            height: 50,
            width: "100%",
            backgroundColor: "#c4c5fd",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            marginTop: 10,
            flexDirection: "row",
            columnGap: 10,
            alignItems: "center",
        },

        input1: {
            width: "100%",
            height: 45,
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 15,
            paddingStart: 10,
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
            borderColor: "#5c5eb6",
        },

        text1: {
            fontSize: 18,
            fontFamily: "Montserrat-Bold",
            color: "black",
        },

        text2: {
            fontFamily: "Montserrat-Bold",
            fontSize: 16
        },

        text3: {
            fontFamily: "Montserrat-Regular",
            fontSize: 18,
            color: "black"
        },

        text4: {
            fontSize: 18,
            fontFamily: "Montserrat-Bold",
            color: "white",
        },

        text5: {
            fontSize: 30,
            fontFamily: "Montserrat-Bold",
            color: "#797bfa",
            alignSelf:"center"
        },

        text6: {
            fontSize: 18,
            fontFamily: "Montserrat-Bold",
            color: "black",
        },
    }
);