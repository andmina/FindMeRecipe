import React from "react";
import { Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { Button } from "./Button";

export const SearchComponent = ({
  headerText,
  onTextChange,
  textValue,
  onPress,
}) => (
  <View style={{ paddingTop: 25, paddingLeft: 25, paddingRight: 25 }}>
    <Text
      style={{
        fontWeight: "400",
        fontSize: 16,
        marginLeft: 8,
        marginBottom: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "gray",
        shadowOpacity: 0.9,
        shadowRadius: 5,
        color: "gray",
      }}
    >
      {headerText}
    </Text>
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#b9b9b9",
        shadowOffset: { width: 3, height: 3 },
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderRadius: 10,
        alignItems: "center",
      }}
    >
      <SearchBar
        placeholder="Type Here..."
        // pass in as functions to our search bar component
        onChangeText={onTextChange}
        value={textValue}
        containerStyle={{
          borderRadius: 10,
          backgroundColor: "#b9b9b9",
          borderBottomColor: "transparent",
          borderTopColor: "transparent",
          flex: 1,
        }}
        inputContainerStyle={{
          borderRadius: 6,
          backgroundColor: "#eee",
          height: 40,
        }}
      />
      <Button
        buttonText={"Search"}
        style={{ width: 70, height: 40, shadowOpacity: 0, marginRight: 8 }}
        onPress={onPress}
      />
    </View>
  </View>
);
