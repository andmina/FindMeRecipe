import React from "react";
import { Alert, ImageBackground, SafeAreaView, Text } from "react-native";
import firebase from "firebase/app";
import { Styles } from "../Styling/Styles";
import { Button } from "../Components/Button";
import { AppContext } from "../Components/AppContextProvider";

export default class Settings extends React.Component {
  static contextType = AppContext;

  render() {
    const theme = this.context.theme;

    return (
      <ImageBackground
        source={require("../../assets/images/lukas-blazek-f-unsplash.jpg")}
        style={[{ flex: 1, resizeMode: "cover" }, Styles.container]}
        blurRadius={6}
      >
        <SafeAreaView
          style={{
            ...theme.backgroundView,
            alignSelf: "stretch",
            flex: 1,
            marginVertical: 25,
            marginHorizontal: 15,
            borderRadius: 20,
          }}
        >
          <Text
            style={[
              Styles.h2,
              { marginVertical: 10, shadowOpacity: 0, ...theme.mainText },
            ]}
          >
            App Theme
          </Text>
          <Text
            style={[
              Styles.h3,
              { marginHorizontal: 15, marginTop: 8, marginBottom: 16 },
              { ...theme.mainText },
            ]}
          >
            Current Theme:{"\n"}
            {theme.name}
          </Text>
          <Button
            buttonText={"Select Theme..."}
            style={{ height: 50, marginHorizontal: 15 }}
            onPress={() => this.props.navigation.navigate("Choose Theme")}
          />
          <Text
            style={[
              Styles.h2,
              { marginVertical: 12, shadowOpacity: 0, ...theme.mainText },
            ]}
          >
            App Account
          </Text>
          <Text
            style={[
              Styles.h3,
              { marginHorizontal: 15, marginTop: 8, marginBottom: 16 },
              { ...theme.mainText },
            ]}
          >
            Currently signed in as:{"\n"}
            {firebase.auth().currentUser.email}
          </Text>
          <Button
            buttonText={"Sign Out..."}
            style={{ height: 50, marginHorizontal: 15 }}
            onPress={() => {
              Alert.alert(
                "Sign Out",
                "Are you sure you want to sign out of Find Me Recipe?",
                [
                  {
                    text: "Sign Out",
                    onPress: () => {
                      firebase.auth().signOut();
                    },
                  },
                  { text: "Cancel", style: "cancel" },
                ]
              );
            }}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
