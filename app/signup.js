import { View, StyleSheet, Text, TextInput, Pressable, Alert, Button, ScrollView } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageBackground } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function signup() {

  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

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
          <Text style={style.text1}>Create Account</Text>
          <Text style={style.text2}>Welcome to We Chat! Connect with your loved ones safe and secure.</Text>

          <Pressable style={style.avatar} onPress={
            async () => {
              let result = await ImagePicker.launchImageLibraryAsync();

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }
          }>
            <Image source={getImage} style={style.avatar} contentFit="contain" />
          </Pressable>



          <Text style={style.text3}>Mobile</Text>
          <TextInput style={style.input1} inputMode={"numeric"} maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }
          } />

          <Text style={style.text3}>First Name</Text>
          <TextInput style={style.input1} inputMode={"text"} onChangeText={
            (text) => {
              setFirstName(text);
            }
          } />

          <Text style={style.text3}>Last Name</Text>
          <TextInput style={style.input1} inputMode={"text"} onChangeText={
            (text) => {
              setLastName(text);
            }
          } />

          <Text style={style.text3}>Password</Text>
          <TextInput style={style.input1} secureTextEntry={true} maxLength={20} onChangeText={
            (text) => {
              setPassword(text);
            }
          } />

          <Pressable style={style.pressable1} onPress={
            async () => {

              let formData = new FormData();
              formData.append("mobile", getMobile);
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
                "https://3dde-112-134-184-33.ngrok-free.app/WeChat/SignUp",
                {
                  method: "POST",
                  body: formData
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {

                  router.replace("/");

                } else {
                  Alert.alert("Error", json.message);
                }

              } 

            }
          }>
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
            <Text style={style.text4}>Sign Up</Text>
          </Pressable>

          <Pressable style={style.pressable2} onPress={
            () => {
              router.replace("/");
            }}
          >
            <Text style={style.text5}>Already Registered? Go to SignIn</Text>
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
      padding:5
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

    avatar: {
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
    }
  }
);