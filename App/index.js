import React from "react";
import { TouchableOpacity, LogBox } from "react-native";
import { AppearanceProvider } from "react-native-appearance";
import firebase from "firebase/app";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

import AppContextProvider from "./Components/AppContextProvider";
import Discover from "./Screens/Discover";
import RecipeBook from "./Screens/RecipeBook";
import MealPlan from "./Screens/MealPlan";
import Sharing from "./Screens/Sharing";
import RecipeList from "./Screens/RecipeList";
import RecipeDetails from "./Screens/RecipeDetails";
import SignIn from "./Screens/SignIn";
import Settings from "./Screens/Settings";
import ThemeSelection from "./Screens/ThemeSelection";
import { firebaseConfig } from "./PrivateKeys";

const Tab = createBottomTabNavigator();
const DiscoverStack = createStackNavigator();
const RecipeBookStack = createStackNavigator();
const MealPlanStack = createStackNavigator();
const SharingStack = createStackNavigator();
const SignInStack = createStackNavigator();

function DiscoverStackNavigator() {
  return (
    <DiscoverStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#333",
          height: 110,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 30,
          marginLeft: 10,
        },
        headerTitleAlign: "left",
      }}
    >
      <DiscoverStack.Screen
        name={"Discover"}
        component={Discover}
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                  name="md-settings"
                  size={28}
                  color={tintColor}
                  style={{ marginRight: 25 }}
                />
              </TouchableOpacity>
            );
          },
        })}
      />
      <DiscoverStack.Screen name={"Recipes"} component={RecipeList} />
      <DiscoverStack.Screen name={"Settings"} component={Settings} />
      <DiscoverStack.Screen name={"Choose Theme"} component={ThemeSelection} />
      <DiscoverStack.Screen name={"Recipe Details"} component={RecipeDetails} />
    </DiscoverStack.Navigator>
  );
}

function RecipeBookStackNavigator() {
  return (
    <RecipeBookStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#333",
          height: 110,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 30,
          marginLeft: 10,
        },
        headerTitleAlign: "left",
      }}
    >
      <RecipeBookStack.Screen
        name={"Recipe Book"}
        component={RecipeBook}
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                  name="md-settings"
                  size={28}
                  color={tintColor}
                  style={{ marginRight: 25 }}
                />
              </TouchableOpacity>
            );
          },
        })}
      />
      <RecipeBookStack.Screen
        name={"Recipe Details"}
        component={RecipeDetails}
      />
      <RecipeBookStack.Screen name={"Settings"} component={Settings} />
      <RecipeBookStack.Screen
        name={"Choose Theme"}
        component={ThemeSelection}
      />
    </RecipeBookStack.Navigator>
  );
}

function MealPlanStackNavigator() {
  return (
    <MealPlanStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#333",
          height: 110,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 30,
          marginLeft: 10,
        },
        headerTitleAlign: "left",
      }}
    >
      <MealPlanStack.Screen
        name={"Meal Plan"}
        component={MealPlan}
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                  name="md-settings"
                  size={28}
                  color={tintColor}
                  style={{ marginRight: 25 }}
                />
              </TouchableOpacity>
            );
          },
        })}
      />
      <MealPlanStack.Screen name={"Settings"} component={Settings} />
      <MealPlanStack.Screen name={"Choose Theme"} component={ThemeSelection} />
      <MealPlanStack.Screen name={"Recipe Details"} component={RecipeDetails} />
    </MealPlanStack.Navigator>
  );
}

function SharingStackNavigation() {
  return (
    <SharingStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#333",
          height: 110,
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 30,
          marginLeft: 10,
        },
        headerTitleAlign: "left",
      }}
    >
      <SharingStack.Screen
        name={"Sharing"}
        component={Sharing}
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                  name="md-settings"
                  size={28}
                  color={tintColor}
                  style={{ marginRight: 25 }}
                />
              </TouchableOpacity>
            );
          },
        })}
      />
      <SharingStack.Screen name={"Recipe Book"} component={RecipeBook} />
      <SharingStack.Screen name={"Recipe Details"} component={RecipeDetails} />
      <SharingStack.Screen name={"Settings"} component={Settings} />
      <SharingStack.Screen name={"Choose Theme"} component={ThemeSelection} />
    </SharingStack.Navigator>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Uncomment on demo day to prevent warnings from appearing
    LogBox.ignoreAllLogs();

    this.state = {
      isSignedIn: false,
    };
  }

  componentDidMount() {
    //Fixes hot reloading bug by preventing Firebase from initializing twice
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      // firebase.auth().signOut();
    }

    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser !== null) {
        this.setState({ isSignedIn: true });
      } else {
        this.setState({ isSignedIn: false });
      }
    });
  }

  //For tab bar options, see https://reactnavigation.org/docs/bottom-tab-navigator/

  render() {
    return (
      <AppearanceProvider>
        <AppContextProvider>
          <NavigationContainer>
            {this.state.isSignedIn ? (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ _, color, size }) => {
                    if (route.name === "Discover") {
                      return (
                        <MaterialCommunityIcons
                          name={"file-document-box-search"}
                          size={size}
                          color={color}
                        />
                      );
                    } else if (route.name === "Recipe Book") {
                      return (
                        <FontAwesome name={"book"} size={size} color={color} />
                      );
                    } else if (route.name === "Meal Plan") {
                      return (
                        <MaterialCommunityIcons
                          name="calendar-clock"
                          size={size}
                          color={color}
                        />
                      );
                    } else if (route.name === "Sharing") {
                      return (
                        <FontAwesome
                          name={"share-alt"}
                          size={size}
                          color={color}
                        />
                      );
                    }
                  },
                })}
                tabBarOptions={{
                  activeTintColor: "white",
                  inactiveTintColor: "#888",
                  style: {
                    backgroundColor: "#333",
                    borderTopWidth: 0,
                  },
                }}
              >
                <Tab.Screen
                  name="Discover"
                  component={DiscoverStackNavigator}
                />
                <Tab.Screen
                  name="Recipe Book"
                  component={RecipeBookStackNavigator}
                />
                <Tab.Screen
                  name="Meal Plan"
                  component={MealPlanStackNavigator}
                />
                <Tab.Screen name="Sharing" component={SharingStackNavigation} />
              </Tab.Navigator>
            ) : (
              <SignInStack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#444",
                    height: 110,
                    shadowColor: "transparent",
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 30,
                    marginLeft: 10,
                  },
                  headerTitleAlign: "left",
                }}
              >
                <SignInStack.Screen name={"Sign In"} component={SignIn} />
              </SignInStack.Navigator>
            )}
          </NavigationContainer>
        </AppContextProvider>
      </AppearanceProvider>
    );
  }
}
