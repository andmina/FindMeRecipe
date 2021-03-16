import React from "react";
import { StatusBar, ImageBackground, Text, View } from "react-native";
import { Agenda } from "react-native-calendars";
import { useIsFocused } from "@react-navigation/native";
import { Styles } from "../Styling/Styles";
import { AppContext } from "../Components/AppContextProvider";
import firebase from "firebase";
import RecipeListItem from "../Components/RecipeListItem";

class MealPlan extends React.Component {
  static contextType = AppContext;

  firestoreListener = () => {};

  constructor(props) {
    super(props);

    this.state = {
      agendaItems: {},
    };
  }

  componentDidMount() {
    this.firestoreListener = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.email)
      .collection("MealPlan")
      .onSnapshot(
        (querySnapshot) => {
          const agendaItems = this.state.agendaItems;
          querySnapshot.docChanges().forEach((dateChange) => {
            if (dateChange.type === ("added" || "modified")) {
              agendaItems[`${dateChange.doc.id}`] = [
                {
                  ...dateChange.doc.data(),
                  marked: true,
                },
              ];
            }
          });
          this.setState({
            agendaItems: agendaItems,
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  componentWillUnmount() {
    this.firestoreListener();
  }

  render() {
    const { theme } = this.context;
    const { isFocused } = this.props;

    return (
      <ImageBackground
        source={require("../../assets/images/lukas-blazek-f-unsplash.jpg")}
        style={[{ flex: 1, resizeMode: "cover" }, Styles.container]}
        blurRadius={6}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={[Styles.h1, { ...theme.mainText }]}>My Plan</Text>
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
              {isFocused && (
                <Agenda
                  theme={{
                    calendarBackground: theme.backgroundView.backgroundColor,
                    monthTextColor: theme.mainText.color,
                    textMonthFontWeight: "700",
                    textMonthFontSize: 18,
                    dayTextColor: theme.interactableText.color,
                    arrowColor: theme.interactableAccent.backgroundColor,
                    textSectionTitleColor: theme.mainText.color,
                    textDisabledColor: "#808080",
                    todayTextColor: theme.mainText.color,
                    dotColor: theme.mainText.color,
                    selectedDayBackgroundColor:
                      theme.interactableAccent.backgroundColor,
                    selectedDayTextColor: theme.interactableText.color,
                    agendaTodayColor: theme.mainText.color,
                    agendaDayTextColor: "#808080",
                    agendaDayNumColor: "#808080",
                  }}
                  items={this.state.agendaItems}
                  // auto select a day in the calendar with saved items
                  selected={Object.keys(this.state.agendaItems)[0]}
                  renderItem={(item) => {
                    return (
                      <RecipeListItem
                        item={item}
                        onPress={() => {
                          fetch(
                            "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" +
                              item.idMeal
                          )
                            .then((response) => response.json())
                            .then((result) => {
                              this.props.navigation.navigate("Recipe Details", {
                                recipe: result.meals[0], // makes sure the the return gives us 1 object with meal details
                              });
                            });
                        }}
                      />
                    );
                  }}
                  renderEmptyData={() => {
                    return (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#b9b9b9",
                            fontWeight: "600",
                            fontSize: 20,
                          }}
                        >
                          No Meals Scheduled.
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default function (props) {
  const isFocused = useIsFocused();

  return <MealPlan {...props} isFocused={isFocused} />;
}
