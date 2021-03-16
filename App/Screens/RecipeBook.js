import React from "react";
import {
  StatusBar,
  ImageBackground,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import firebase from "firebase/app";
import "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { Styles } from "../Styling/Styles";
import RecipeListItem from "../Components/RecipeListItem";
import { AppContext } from "../Components/AppContextProvider";

const screenWidth = Dimensions.get("window").width;

class RecipeBook extends React.Component {
  static contextType = AppContext;

  firestoreListener = () => {};

  constructor(props) {
    super(props);

    this.state = {
      categoriesWRecipes: [],
    };
  }

  componentDidMount() {
    if (
      this.props.route.params == null ||
      this.props.route.params.userEmail == null
    ) {
      this.firestoreListener = firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.email)
        .collection("Categories")
        .onSnapshot(
          (querySnapshot) => {
            const catsWRepsArr = this.state.categoriesWRecipes;
            querySnapshot.docChanges().forEach((categoryChange) => {
              // listen for changes: add/remove recipe
              if (categoryChange.type === "added") {
                catsWRepsArr.push({
                  // find the json obj of category change and return the index of it
                  category: categoryChange.doc.id,
                  recipes: categoryChange.doc.data().recipes,
                });
              } else if (categoryChange.type === "modified") {
                let index = catsWRepsArr.findIndex(function (item) {
                  // boolean returns true if the item (has an index)
                  return item.category === categoryChange.doc.id;
                });
                // as long as there are items that have an index then we return it
                if (index !== -1) {
                  catsWRepsArr.splice(index, 1);
                  catsWRepsArr.push({
                    // find the json obj of category change and return the index of it
                    category: categoryChange.doc.id,
                    recipes: categoryChange.doc.data().recipes,
                  });
                }
              }
            });
            catsWRepsArr.sort(function (a, b) {
              if (a.category > b.category) {
                return 1; // a goes ahead of b
              }
              if (a.category < b.category) {
                return -1; // this stays the way it is
              }
              return 0; // if they're equal
            });
            this.setState({ categoriesWRecipes: catsWRepsArr });
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      //For shared recipe books
      this.firestoreListener = firebase
        .firestore()
        .collection("Users")
        .doc(this.props.route.params.userEmail)
        .collection("Categories")
        .onSnapshot(
          (querySnapshot) => {
            const catsWRepsArr = this.state.categoriesWRecipes;
            querySnapshot.docChanges().forEach((categoryChange) => {
              // listen for changes: add/remove recipe
              if (categoryChange.type === "added") {
                catsWRepsArr.push({
                  // find the json obj of category change and return the index of it
                  category: categoryChange.doc.id,
                  recipes: categoryChange.doc.data().recipes,
                });
              } else if (categoryChange.type === "modified") {
                let index = catsWRepsArr.findIndex(function (item) {
                  // boolean returns true if the item (has an index)
                  return item.category === categoryChange.doc.id;
                });
                // as long as there are items that have an index then we return it
                if (index !== -1) {
                  catsWRepsArr.splice(index, 1);
                  catsWRepsArr.push({
                    // find the json obj of category change and return the index of it
                    category: categoryChange.doc.id,
                    recipes: categoryChange.doc.data().recipes,
                  });
                }
              }
            });
            catsWRepsArr.sort(function (a, b) {
              if (a.category > b.category) {
                return 1; // a goes ahead of b
              }
              if (a.category < b.category) {
                return -1; // this stays the way it is
              }
              return 0; // if they're equal
            });
            this.setState({ categoriesWRecipes: catsWRepsArr });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  componentWillUnmount() {
    //Remove firestore listener
    this.firestoreListener();
  }

  render() {
    const { theme } = this.context;
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
            justifyContent: "flex-start",
          }}
        >
          {this.props.route.params != null &&
          this.props.route.params.userEmail != null ? (
            <Text style={[Styles.h1, { ...theme.mainText }]}>Shared Menu</Text>
          ) : (
            <Text style={[Styles.h1, { ...theme.mainText }]}>My Menu</Text>
          )}
          {this.props.isFocused && (
            <Carousel
              containerCustomStyle={{ marginBottom: 25, marginTop: 15 }}
              inactiveSlideOpacity={0.8}
              layout={"default"}
              data={this.state.categoriesWRecipes}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.8}
              renderItem={({ item }) => {
                return (
                  <View
                    style={[
                      {
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                        overflow: "hidden",
                        backgroundColor: "#b8ce9c",
                      },
                      { ...theme.backgroundView },
                    ]}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 45,
                      }}
                    >
                      <Text
                        style={[
                          Styles.h2,
                          { marginTop: 8, shadowOpacity: 0 },
                          { ...theme.mainText },
                        ]}
                      >
                        {item.category}
                      </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {item.recipes.map((recipe) => {
                        console.log(recipe);
                        return (
                          <RecipeListItem
                            item={recipe}
                            key={recipe.idMeal}
                            onPress={() => {
                              fetch(
                                "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" +
                                  recipe.idMeal
                              )
                                .then((response) => response.json())
                                .then((result) => {
                                  this.props.navigation.navigate(
                                    "Recipe Details",
                                    {
                                      recipe: result.meals[0], // makes sure the the return gives us 1 object with meal details
                                    }
                                  );
                                });
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ImageBackground>
    );
  }
}

export default function (props) {
  const isFocused = useIsFocused();

  return <RecipeBook {...props} isFocused={isFocused} />;
}
