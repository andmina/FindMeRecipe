import React, { useContext } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { AppContext } from "./AppContextProvider";

export default function GridItem({
  imageURL,
  itemName,
  itemObj,
  onTap,
  style,
  disabled = false,
  textViewHeight = "20%",
  imageViewHeight = "80%",
  fontSize = 18,
}) {
  const { theme } = useContext(AppContext);
  return (
    <TouchableOpacity
      style={[
        style,
        {
          backgroundColor: "white",
          borderRadius: 10,
        },
      ]}
      activeOpacity={0.6}
      onPress={() => onTap(itemObj)}
      disabled={disabled}
    >
      <Image
        style={{
          width: "100%",
          height: imageViewHeight,
          resizeMode: "contain",
        }}
        source={{ uri: imageURL }}
      />
      <View
        style={[
          {
            height: textViewHeight,
            backgroundColor: "#96bdc6",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            overflow: "hidden",
            justifyContent: "center",
            paddingHorizontal: 10,
          },
          { ...theme.interactableAccent },
        ]}
      >
        <Text
          style={[
            {
              color: "white",
              fontWeight: "700",
              fontSize: fontSize,
            },
            { ...theme.interactableText },
          ]}
          minimumFontScale={0.7}
          adjustsFontSizeToFit
          numberOfLines={2}
        >
          {itemName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
