/* The LoginScreen class is a React Native component that allows users to log in with their email and
password using Firebase authentication. */


import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import firebase from "firebase";

const bgImage = require("../assets/background1.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

 /* `handleLogin` is a method that is called when the user presses the "Login" button. It takes in the
 user's email and password as parameters. */
  handleLogin = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        /* `this.props.navigation.navigate("BottomTab");` is navigating the user to the "BottomTab"
        screen/component. It is likely that "BottomTab" is a tab navigator component that contains
        multiple screens/components that the user can navigate to. */
        this.props.navigation.navigate("BottomTab");
      })
      /* `.catch(error => {
              Alert.alert(error.message);
            });` is a catch block that is executed if there is an error during the Firebase
      authentication process. It displays an alert message with the error message to the user. */
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  render() {
    const { email, password } = this.state;
    return (
     /* The `KeyboardAvoidingView` component is a built-in component in React Native that adjusts its
     height and position when the keyboard is displayed, in order to avoid the keyboard overlapping
     with the content. The `behavior` prop is set to "padding", which means that the view will
     adjust its padding to avoid the keyboard. */
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <ImageBackground source={bgImage} style={styles.bgImage}>

          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>

          <View style={styles.lowerContainer}>
            {/* `<TextInput>` is a built-in component in React Native that allows users to input text.
            In this code, it is creating a text input field for the user to enter their email. */}
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ email: text })}
              placeholder={"Enter Email"}
              placeholderTextColor={"#FFFFFF"}
              autoFocus
            />

            {/* `<TextInput>` is a built-in component in React Native that allows users to input text.
            In this code, it is creating a text input field for the user to enter their password. */}
            <TextInput
              style={[styles.textinput, { marginTop: 20 }]}
              onChangeText={text => this.setState({ password: text })}
              placeholder={"Enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />


            {/* `<TouchableOpacity>` is a built-in component in React Native that creates a touchable
            button. In this code, it is creating a button with the text "Login" that the user can
            press to log in. */}
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => this.handleLogin(email, password)}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>

        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },

  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 280,
    height: 280,
    resizeMode: "contain",
    marginTop: 80
  },
  appName: {
    width: 130,
    height: 130,
    resizeMode: "contain"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textinput: {
    width: "75%",
    height: 55,
    padding: 10,
    borderColor: "#FFFFFF",
    borderWidth: 4,
    borderRadius: 10,
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold",
    backgroundColor: "#5653D4"
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold"
  }
});
