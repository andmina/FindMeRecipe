import React from "react";
import {
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Styles } from "../Styling/Styles";
import { Button } from "../Components/Button";
import TapAwayListener from "../Components/TapAwayListener";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  render() {
    return (
      <TapAwayListener>
        <ImageBackground
          source={require("../../assets/images/lukas-blazek-f-unsplash.jpg")}
          style={[{ flex: 1, resizeMode: "cover" }, Styles.container]}
          blurRadius={6}
        >
          <StatusBar barStyle="light-content" />
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: "stretch",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Text style={Styles.h1}>Sign In to{"\n"}Find Me Recipe</Text>
            <Text
              style={[
                Styles.h4,
                { marginTop: 20, marginLeft: 32, marginBottom: 4 },
              ]}
            >
              Email Address
            </Text>
            <TextInput
              style={Styles.textField}
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
              value={this.state.email}
              placeholder={"john.doe@example.com"}
              placeholderTextColor={"#999"}
              autoCapitalize="none"
              keyboardType={"email-address"}
            />
            <Text
              style={[
                Styles.h4,
                { marginTop: 10, marginLeft: 32, marginBottom: 4 },
              ]}
            >
              Password
            </Text>
            <TextInput
              secureTextEntry
              style={Styles.textField}
              onChangeText={(text) => {
                this.setState({ password: text });
              }}
              value={this.state.password}
              placeholder={"P@$$w0rd"}
              placeholderTextColor={"#999"}
              autoCapitalize="none"
            />
            <Button
              buttonText={"Sign In..."}
              onPress={() => {
                //Sign in user
                this.setState({ isLoading: true }, () => {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(
                      this.state.email.toLowerCase().trim(),
                      this.state.password.trim()
                    )
                    .catch((error) => {
                      console.log(error);
                      this.setState({ isLoading: false });
                      Alert.alert("Error Signing In", error.message, [
                        {
                          text: "Dismiss",
                          style: "cancel",
                        },
                      ]);
                    });
                });
              }}
              loading={this.state.isLoading}
              style={{
                marginHorizontal: 25,
                height: 50,
                marginTop: 15,
                backgroundColor: "#96bdc6",
              }}
            />
            <Button
              buttonText={"Create Account..."}
              onPress={() => {
                //Create account for user and sign them in
                this.setState({ isLoading: true }, () => {
                  firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                      this.state.email.trim(),
                      this.state.password.trim()
                    )
                    .then((user) => {
                      console.log(user.user.email);
                      firebase
                        .firestore()
                        .collection("Users")
                        .doc(user.user.email)
                        .set({})
                        .catch((e) => {
                          console.log(e);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      this.setState({ isLoading: false });
                    });
                });
              }}
              loading={this.state.isLoading}
              style={{
                marginHorizontal: 25,
                height: 50,
                marginVertical: 15,
                backgroundColor: "#96bdc6",
              }}
            />
          </SafeAreaView>
        </ImageBackground>
      </TapAwayListener>
    );
  }
}
