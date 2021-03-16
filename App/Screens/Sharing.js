import React from "react";
import {
  StatusBar,
  ImageBackground,
  ScrollView,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Styles } from "../Styling/Styles";
import { AppContext } from "../Components/AppContextProvider";
import { Button } from "../Components/Button";
import Modal from "react-native-modal";
import firebase from "firebase";

export default class Sharing extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalNewShareEmail: "",
      modalContentOffset: { x: 0, y: 0 },
      sharedWithMeArr: [],
      sharingWithArr: [],
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.email)
      .collection("SharedWithMe")
      .get()
      .then((querySnapshot) => {
        const newArr = [];
        querySnapshot.forEach((doc) => {
          newArr.push(doc.id);
        });
        newArr.sort(function (a, b) {
          if (a > b) {
            return 1; // a goes ahead of b
          }
          if (a < b) {
            return -1; // this stays the way it is
          }
          return 0; // if they're equal
        });
        this.setState({ sharedWithMeArr: newArr });
      })
      .catch((e) => {
        console.log(e);
      });
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.email)
      .collection("SharingWith")
      .get()
      .then((querySnapshot) => {
        const newArr = [];
        querySnapshot.forEach((doc) => {
          newArr.push(doc.id);
        });
        newArr.sort(function (a, b) {
          if (a > b) {
            return 1; // a goes ahead of b
          }
          if (a < b) {
            return -1; // this stays the way it is
          }
          return 0; // if they're equal
        });
        this.setState({ sharingWithArr: newArr });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { theme } = this.context;

    return (
      <ImageBackground
        source={require("../../assets/images/lukas-blazek-f-unsplash.jpg")}
        style={[{ flex: 1, resizeMode: "cover" }, Styles.container]}
        blurRadius={6}
      >
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          style={{ alignItems: "center" }}
          backdropOpacity={0.55}
          animationIn={"slideInDown"}
          animationOut={"slideOutUp"}
        >
          <View
            style={[
              {
                backgroundColor: "#b8ce9c",
                width: "90%",
                height: "55%",
                minHeight: 375,
                borderRadius: 14,
              },
              { ...theme.backgroundView },
            ]}
          >
            <ScrollView
              scrollEnabled={false}
              contentOffset={this.state.modalContentOffset}
              contentInsetAdjustmentBehavior={"never"}
              contentContainerStyle={{
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  Styles.h2,
                  { shadowOpacity: 0, marginTop: 10 },
                  { ...theme.mainText },
                ]}
              >
                Shared with:
              </Text>
              <View>
                {this.state.sharingWithArr.map((item) => {
                  return (
                    <Text
                      style={[
                        Styles.h4,
                        { marginLeft: 17 },
                        { ...theme.mainText },
                      ]}
                      key={item}
                    >
                      {item}
                    </Text>
                  );
                })}
              </View>
              <View>
                <Text
                  style={[
                    Styles.h4,
                    { marginLeft: 17, marginBottom: 4 },
                    { ...theme.mainText },
                  ]}
                >
                  Share your book with:
                </Text>
                <TextInput
                  style={[Styles.textField, { shadowOpacity: 0 }]}
                  onChangeText={(text) => {
                    this.setState({
                      modalNewShareEmail: text,
                    });
                  }}
                  value={this.state.modalNewShareEmail}
                  // focus on the text input when the keyboard pops up
                  onFocus={() => {
                    this.setState({ modalContentOffset: { x: 0, y: 135 } });
                  }}
                  onBlur={() => {
                    this.setState({ modalContentOffset: { x: 0, y: 0 } });
                  }}
                  placeholder="fcougar17@apu.edu"
                  placeholderTextColor={"#999"}
                  autoCapitalize={"none"}
                />
              </View>
              <Button
                // dynamically change the button label by adding a category to it
                buttonText={`Share with ${this.state.modalNewShareEmail}`}
                style={{
                  marginHorizontal: 17,
                  height: 55,
                  marginTop: 12,
                  marginBottom: 17,
                  shadowOpacity: 0,
                }}
                onPress={() => {
                  (async () => {
                    const otherUserDoc = await firebase
                      .firestore()
                      .collection("Users")
                      .doc(this.state.modalNewShareEmail.trim())
                      .get()
                      .catch((e) => {
                        console.log(e);
                      });
                    if (otherUserDoc.exists) {
                      firebase
                        .firestore()
                        .collection("Users")
                        .doc(firebase.auth().currentUser.email)
                        .collection("SharingWith")
                        .doc(this.state.modalNewShareEmail.trim())
                        .set({})
                        .then(() => {
                          firebase
                            .firestore()
                            .collection("Users")
                            .doc(this.state.modalNewShareEmail.trim())
                            .collection("SharedWithMe")
                            .doc(firebase.auth().currentUser.email)
                            .set({})
                            .then(() => {
                              Alert.alert(
                                "Share Successful",
                                `Your recipe book was successfully shared with ${this.state.modalNewShareEmail.trim()}.`,
                                [
                                  {
                                    text: "Dismiss",
                                    style: "cancel",
                                    onPress: () => {
                                      this.setState({
                                        modalVisible: false,
                                        saved: true,
                                      });
                                    },
                                  },
                                ]
                              );
                              //TODO - add pretty checkmark animation
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    } else {
                      Alert.alert(
                        "User Not Found",
                        `${this.state.modalNewShareEmail.trim()} was not found as a Find Me Recipe user.`,
                        [
                          {
                            text: "Dismiss",
                            style: "cancel",
                          },
                        ]
                      );
                    }
                  })();
                }}
              />
            </ScrollView>
          </View>
        </Modal>
        <View style={{ flex: 1, width: "100%", alignItems: "flex-start" }}>
          <StatusBar barStyle="light-content" />
          <Text style={[Styles.h1, { ...theme.mainText }]}>
            Shared{"\n"}With Me
          </Text>
          <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
            <View
              style={[
                {
                  flex: 1,
                  width: "90%",
                  marginBottom: 25,
                  marginTop: 15,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: "#b8ce9c",
                },
                { ...theme.backgroundView },
              ]}
            >
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={[
                  Styles.scrollContainer,
                  {
                    width: "100%",
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    paddingTop: 8,
                  },
                ]}
              >
                {this.state.sharedWithMeArr.map((item) => {
                  return (
                    <TouchableOpacity
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 5,
                          marginHorizontal: 10,
                          backgroundColor: "#fff",
                          borderRadius: 14,
                          shadowOffset: { width: 3, height: 3 },
                          shadowColor: "black",
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          height: 60,
                        },
                        { ...theme.interactableAccent },
                      ]}
                      activeOpacity={0.6}
                      onPress={() => {
                        this.props.navigation.navigate("Recipe Book", {
                          userEmail: item,
                        });
                      }}
                      key={item}
                    >
                      <View
                        style={[
                          {
                            alignSelf: "stretch",
                            justifyContent: "center",
                            flex: 1,
                            backgroundColor: "#96bdc6",
                            borderRadius: 13,
                          },
                          { ...theme.interactableAccent },
                        ]}
                      >
                        <Text
                          style={[
                            {
                              fontSize: 21,
                              marginHorizontal: 20,
                              fontWeight: "bold",
                              color: "white",
                            },
                            { ...theme.interactableText },
                          ]}
                          numberOfLines={3}
                          adjustsFontSizeToFit
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Button
                buttonText={"Share My Recipe Book..."}
                style={{ height: 50, marginHorizontal: 15, marginVertical: 15 }}
                onPress={() => {
                  this.setState({ modalVisible: true });
                }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
