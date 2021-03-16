import React from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  TextInput,
  Share,
} from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/firestore";

import GridItem from "../Components/GridItem";
import { Styles } from "../Styling/Styles";
import { Button } from "../Components/Button";
import { AppContext } from "../Components/AppContextProvider";
import { Calendar } from "react-native-calendars";

export default class RecipeDetails extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      ingredientsArr: [],
      ingredientsWithMeasurements: [],
      fsCategories: [],
      saveModalVisible: false,
      shareModalVisible: false,
      modalPickerCategory: "",
      modalNewCategory: "",
      modalButtonCategory: "",
      modalContentOffset: { x: 0, y: 0 },
      modalButtonDate: `${
        new Date().getMonth() + 1
      }/${new Date().getDate()}/${new Date().getFullYear()}`,
      modalDatesObj: {},
      planModalVisible: false,
      saved: false,
    };
  }

  componentDidMount() {
    const { recipe } = this.props.route.params;
    // console.log(recipe);
    const ingredientsArr = [];
    const ingredientsWithMeasurements = [];
    const fsCategories = [];
    const plannedMeals = {};
    // For each key in the recipe JSON object
    for (let key of Object.keys(recipe)) {
      // If the key is an ingredient and is not empty
      if (
        key.startsWith("strIngredient") &&
        recipe[key] !== "" &&
        recipe[key] != null
      ) {
        // Add it to the ingredients array for fetching images
        ingredientsArr.push(recipe[key]);
        // Get the matching measurement
        ingredientsWithMeasurements.push(
          recipe["strMeasure" + key.slice(13)] + " " + recipe[key] // slice off string ingredient to be left /w actually b measure
        );
      }
    }
    // Get the list of categories to use it dynamically in the Modal
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.email)
      .collection("Categories")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          fsCategories.push(doc.id);
        });
      })
      .catch((e) => {
        console.log(e);
      });

    firebase
      .firestore()
      .collectionGroup("Categories")
      .where("recipes", "array-contains", {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal.trim(),
        strMealThumb: recipe.strMealThumb,
      })
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          this.setState({ saved: true });
        }
      })
      .catch((e) => {
        console.log(e);
      });

    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.email)
      .collection("MealPlan")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          plannedMeals[`${doc.id}`] = {
            ...doc.data(),
            marked: true,
          };
        });
      })
      .then(() => {
        this.setState({
          ingredientsArr: ingredientsArr,
          ingredientsWithMeasurements: ingredientsWithMeasurements,
          fsCategories: fsCategories,
          modalDatesObj: plannedMeals,
          modalPickerCategory: fsCategories[0],
          modalButtonCategory: fsCategories[0],
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { theme } = this.context;
    const { recipe } = this.props.route.params;
    return (
      <SafeAreaView
        style={[
          { flex: 1, backgroundColor: "#b8ce9c" },
          { ...theme.backgroundView },
        ]}
      >
        <Modal
          isVisible={this.state.saveModalVisible}
          onBackdropPress={() => this.setState({ saveModalVisible: false })}
          style={{ alignItems: "center" }}
          backdropOpacity={0.55}
          animationIn={"slideInDown"}
          animationOut={"slideOutUp"}
        >
          <View
            style={[
              {
                backgroundColor: "#b8ce9c",
                width: "85%",
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
                Save Recipe
              </Text>
              <View>
                <Text
                  style={[Styles.h4, { marginLeft: 17 }, { ...theme.mainText }]}
                >
                  Add to Existing Category
                </Text>
                <Picker
                  onValueChange={(itemValue) =>
                    this.setState({
                      modalNewCategory: "",
                      modalPickerCategory: itemValue,
                      modalButtonCategory: itemValue,
                    })
                  }
                  selectedValue={this.state.modalPickerCategory}
                  itemStyle={{ height: 140, fontWeight: "600" }}
                >
                  {this.state.fsCategories.map((category) => {
                    return (
                      <Picker.Item
                        label={category}
                        value={category}
                        key={category}
                        color={"white"}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View>
                <Text
                  style={[
                    Styles.h4,
                    { marginLeft: 17, marginBottom: 4 },
                    { ...theme.mainText },
                  ]}
                >
                  New Category
                </Text>
                <TextInput
                  style={[Styles.textField, { shadowOpacity: 0 }]}
                  onChangeText={(text) => {
                    this.setState({
                      modalNewCategory: text, // save the state of the new category
                      modalButtonCategory: text,
                    });
                  }}
                  value={this.state.modalNewCategory}
                  // focus on the text input when the keyboard pops up
                  onFocus={() => {
                    this.setState({ modalContentOffset: { x: 0, y: 135 } });
                  }}
                  onBlur={() => {
                    this.setState({ modalContentOffset: { x: 0, y: 0 } });
                  }}
                  placeholder={"Holiday"}
                  placeholderTextColor={"#999"}
                />
              </View>
              <Button
                // dynamically change the button label by adding a category to it
                buttonText={`Save to ${this.state.modalButtonCategory}`}
                style={{
                  marginHorizontal: 17,
                  height: 45,
                  marginTop: 12,
                  marginBottom: 17,
                  shadowOpacity: 0,
                }}
                onPress={() => {
                  // save the recipe in firebase
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(firebase.auth().currentUser.email)
                    .collection("Categories")
                    .doc(this.state.modalButtonCategory.trim())
                    // save json data in an array called "recipes"
                    .set(
                      {
                        recipes: firebase.firestore.FieldValue.arrayUnion({
                          idMeal: recipe.idMeal,
                          strMeal: recipe.strMeal.trim(),
                          strMealThumb: recipe.strMealThumb,
                        }),
                      },
                      { merge: true } // merge data so it doesn't override
                    )
                    .then(() => {
                      this.setState({
                        saveModalVisible: false,
                        saved: true,
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              />
            </ScrollView>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.planModalVisible}
          onBackdropPress={() => this.setState({ planModalVisible: false })}
          style={{ alignItems: "center" }}
          backdropOpacity={0.55}
          animationIn={"slideInDown"}
          animationOut={"slideOutUp"}
        >
          <View
            style={[
              {
                backgroundColor: "#b8ce9c",
                width: "85%",
                minHeight: 375,
                borderRadius: 14,
                justifyContent: "space-between",
              },
              { ...theme.backgroundView },
            ]}
          >
            <Text
              style={[
                Styles.h2,
                { shadowOpacity: 0, marginTop: 10 },
                { ...theme.mainText },
              ]}
            >
              Add Recipe to Plan
            </Text>
            <View>
              <Calendar
                enableSwipeMonths={true}
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
                }}
                renderArrow={(direction) => {
                  if (direction === "left") {
                    return (
                      <AntDesign
                        name="caretleft"
                        size={30}
                        color={theme.interactableAccent.backgroundColor}
                      />
                    );
                  } else if (direction === "right") {
                    return (
                      <AntDesign
                        name="caretright"
                        size={30}
                        color={theme.interactableAccent.backgroundColor}
                      />
                    );
                  }
                }}
                onDayPress={(date) => {
                  this.setState({
                    modalButtonDate: `${date.month}/${date.day}/${date.year}`,
                  });
                }}
                markedDates={this.state.modalDatesObj}
              />
            </View>
            <Button
              // dynamically change the button label by adding a category to it
              buttonText={`Save on ${this.state.modalButtonDate}`}
              style={{
                marginHorizontal: 17,
                height: 45,
                marginTop: 12,
                marginBottom: 17,
                shadowOpacity: 0,
              }}
              onPress={() => {
                const dateSplit = this.state.modalButtonDate.split("/");
                const dateStr =
                  dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];

                firebase
                  .firestore()
                  .collection("Users")
                  .doc(firebase.auth().currentUser.email)
                  .collection("MealPlan")
                  .doc(dateStr)
                  .set({
                    strMeal: recipe.strMeal.trim(),
                    strMealThumb: recipe.strMealThumb,
                    idMeal: recipe.idMeal,
                  })
                  .then(() => {
                    this.setState({
                      planModalVisible: false,
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            />
          </View>
        </Modal>
        <ScrollView contentContainerStyle={{ padding: "5%" }}>
          <Image
            style={{
              width: "100%",
              height: 250,
              resizeMode: "cover",
              borderRadius: 12,
            }}
            source={{
              uri: recipe.strMealThumb, // add category image as a header image
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text
              style={[{ maxWidth: "45%" }, Styles.h3, { ...theme.mainText }]}
              numberOfLines={3}
              adjustsFontSizeToFit
            >
              {recipe.strMeal.trim()}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  {
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#96bdc6",
                    marginHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 5,
                  },
                  { ...theme.interactableAccent },
                ]}
                activeOpacity={0.6}
                onPress={() => {
                  this.setState({ saveModalVisible: true });
                }}
                disabled={this.state.saved}
              >
                {this.state.saved ? (
                  <MaterialCommunityIcons
                    name="bookmark-check"
                    size={22}
                    color="white"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="bookmark-plus"
                    size={22}
                    color="white"
                  />
                )}
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                    paddingTop: 1,
                  }}
                >
                  {this.state.saved ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#96bdc6",
                    marginRight: 10,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 5,
                  },
                  { ...theme.interactableAccent },
                ]}
                activeOpacity={0.6}
                onPress={() => {
                  this.setState({ planModalVisible: true });
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-plus"
                  size={22}
                  color="white"
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                    paddingTop: 1,
                  }}
                >
                  Plan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "#96bdc6",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 5,
                  },
                  { ...theme.interactableAccent },
                ]}
                activeOpacity={0.6}
                onPress={() => {
                  Share.share({
                    url:
                      "https://www.themealdb.com/meal.php?c=" + recipe.idMeal,
                  });
                }}
              >
                <FontAwesome name={"share-alt"} size={22} color={"white"} />
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                    paddingTop: 1,
                  }}
                >
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[Styles.h4, { ...theme.mainText }]}>Ingredients</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {this.state.ingredientsArr.map((ingredient, index) => {
              return (
                <GridItem
                  style={{ height: 120, width: 120, margin: 5 }}
                  textViewHeight={"30%"}
                  imageViewHeight={"70%"}
                  fontSize={13}
                  disabled
                  imageURL={
                    "https://www.themealdb.com/images/ingredients/" +
                    ingredient +
                    ".png"
                  }
                  itemName={this.state.ingredientsWithMeasurements[
                    this.state.ingredientsArr.indexOf(ingredient)
                  ].trim()}
                  key={index}
                />
              );
            })}
          </ScrollView>
          <Text
            style={[Styles.h4, { paddingVertical: 5 }, { ...theme.mainText }]}
          >
            Instructions
          </Text>
          <Text style={Styles.h5}>{recipe.strInstructions}</Text>
          {recipe.strYoutube !== "" && recipe.strYoutube != null && (
            <>
              <Text
                style={[
                  Styles.h4,
                  { paddingVertical: 5 },
                  { ...theme.mainText },
                ]}
              >
                YouTube Video
              </Text>
              <Text
                style={[Styles.h5, { textDecorationLine: "underline" }]}
                onPress={() => Linking.openURL(recipe.strYoutube)}
              >
                {recipe.strYoutube}
              </Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
