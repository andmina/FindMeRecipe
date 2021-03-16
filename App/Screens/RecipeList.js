import React from "react";
import {
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import { Styles } from "../Styling/Styles";
import RecipeListItem from "../Components/RecipeListItem";
import { AppContext } from "../Components/AppContextProvider";

const screenWidth = Dimensions.get("window").width;

export default class RecipeList extends React.Component {
  static contextType = AppContext;

  strCategoryThumb;
  strCategory;
  constructor(props) {
    super(props);

    this.state = {
      backgroundHeight: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.route.params.categoryObj != null &&
      this.props.route.params.categoryObj.strCategoryThumb != null
    ) {
      Image.getSize(
        this.props.route.params.categoryObj.strCategoryThumb,
        (imgWidth, imgHeight) => {
          this.setState({
            backgroundHeight: imgHeight * (screenWidth / imgWidth),
          });
        }
      );
    } else {
      this.setState({ backgroundHeight: 210 });
    }
  }

  render() {
    const { theme } = this.context;
    // if the index is 0 then return a custom component (image with text)
    return (
      <ImageBackground
        source={require("../../assets/images/lukas-blazek-f-unsplash.jpg")}
        style={[{ flex: 1, resizeMode: "cover" }, Styles.container]}
        blurRadius={6}
      >
        <SafeAreaView style={{ width: "100%", height: "100%" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: this.state.backgroundHeight,
            }}
          >
            <AutoHeightImage
              source={{
                uri: this.props.route.params.categoryObj.strCategoryThumb, // add category image as a header image
              }}
              width={screenWidth}
              blurRadius={2.5}
            />
            <Text
              style={[
                {
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "white",
                  position: "absolute",
                  shadowOffset: { width: 5, height: 5 },
                  shadowColor: "gray",
                  shadowOpacity: 0.9,
                  shadowRadius: 5,
                },
                this.props.route.params.categoryObj.strCategory ===
                  "Search\nResults" && { ...theme.mainText },
              ]}
            >
              {this.props.route.params.categoryObj.strCategory}
            </Text>
          </View>
          <ScrollView
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              bottom: 0,
            }}
            contentContainerStyle={[
              Styles.scrollContainer,
              { paddingTop: this.state.backgroundHeight - 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                {
                  width: "100%",
                  height: "100%",
                  borderRadius: 20,
                  paddingVertical: 5,
                  overflow: "hidden",
                  backgroundColor: "#b8ce9c",
                },
                { ...theme.backgroundView },
              ]}
            >
              {this.props.route.params.recipeList.map((item) => {
                return (
                  <RecipeListItem
                    item={item}
                    key={item.idMeal}
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
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
