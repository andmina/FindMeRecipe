import React from "react";
import {
  Text,
  StatusBar,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
} from "react-native";
import { SearchComponent } from "../Components/SearchComponent";
import { Styles } from "../Styling/Styles";
import { Button } from "../Components/Button";
import Grid from "../Components/Grid";
import { AppContext } from "../Components/AppContextProvider";

export default class Discover extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchLoading: false,
      gridItemsArr: [],
    };
  }

  componentDidMount() {
    (async () => {
      fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then((result) => result.json())
        .then((jsonData) => {
          //Sort categories alphabetically
          const sortedArr = jsonData.categories.sort(function (a, b) {
            if (a.strCategory > b.strCategory) {
              return 1; // a goes ahead of b
            }
            if (a.strCategory < b.strCategory) {
              return -1; // this stays the way it is
            }
            return 0; // if they're equal
          });
          this.setState({ gridItemsArr: sortedArr });
        });
    })();
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
        <SafeAreaView>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={Styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[Styles.h1, { ...theme.mainText }]}>
              What's on the{"\n"}menu today?
            </Text>
            <SearchComponent
              headerText="Find Recipe"
              onTextChange={(value) => this.setState({ searchText: value })}
              textValue={this.state.searchText}
              onPress={() => {
                fetch(
                  "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
                    this.state.searchText.trim()
                )
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.meals != null && result.meals.length > 0) {
                      this.props.navigation.navigate("Recipes", {
                        recipeList: result.meals,
                        categoryObj: { strCategory: "Search\nResults" },
                      });
                    } else {
                      Alert.alert(
                        "No Results",
                        "No recipes were found with that name."
                      );
                    }
                  });
              }}
            />
            <Button
              buttonText={"Get Random Recipe"}
              onPress={() => {
                fetch("https://www.themealdb.com/api/json/v1/1/random.php")
                  .then((response) => response.json())
                  .then((result) => {
                    this.props.navigation.navigate("Recipe Details", {
                      recipe: result.meals[0], // makes sure the the return gives us 1 object with meal details
                    });
                  });
              }}
              loading={this.state.searchLoading}
              style={{
                alignSelf: "center",
                marginVertical: 35,
                width: 220,
                height: 55,
              }}
            />
            <Text style={[Styles.h2, { ...theme.mainText }]}>Categories</Text>
            <Grid
              itemsArr={this.state.gridItemsArr}
              onItemTap={(itemContent) => {
                fetch(
                  "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
                    itemContent.strCategory
                )
                  .then((response) => response.json())
                  .then((result) => {
                    this.props.navigation.navigate("Recipes", {
                      recipeList: result.meals,
                      categoryObj: itemContent,
                    });
                  });
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
