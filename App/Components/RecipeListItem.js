import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { AppContext } from "./AppContextProvider";

export default function RecipeListItem({ item, onPress }) {
  const { theme } = useContext(AppContext);
  return (
    <TouchableOpacity
      style={{
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
      }}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <Image
        style={{
          height: 100,
          aspectRatio: 1,
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 10,
        }}
        source={{
          uri: item.strMealThumb, // add category image
        }}
      />
      <View
        style={[
          {
            alignSelf: "stretch",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#96bdc6",
            borderTopRightRadius: 13,
            borderBottomRightRadius: 13,
          },
          { ...theme.interactableAccent },
        ]}
      >
        <Text
          style={[
            {
              fontSize: 21,
              marginHorizontal: 10,
              fontWeight: "bold",
              color: "white",
            },
            { ...theme.interactableText },
          ]}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {item.strMeal}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
