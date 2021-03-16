import React, { useContext } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { themes } from "../Styling/Themes";
import { AppContext } from "../Components/AppContextProvider";
import { Styles } from "../Styling/Styles";

export default function ThemeSelection({ navigation: { goBack } }) {
  const { changeTheme } = useContext(AppContext);
  return (
    <View style={{ height: "100%" }}>
      <FlatList
        data={themes}
        keyExtractor={(theme) => theme.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              ...item.backgroundView,
              height: 75,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              changeTheme(themes[themes.indexOf(item)]);
              goBack();
            }}
          >
            <Text
              style={[
                Styles.h2,
                {
                  ...item.mainText,
                  paddingLeft: 0,
                  marginBottom: 0,
                  shadowOpacity: 0,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
