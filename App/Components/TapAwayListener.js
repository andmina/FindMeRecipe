import React from "react";
import { ScrollView } from "react-native";

export default function TapAwayListener({ children }) {
  return (
    <ScrollView
      style={{ height: "100%" }}
      contentContainerStyle={{ height: "100%" }}
      keyboardShouldPersistTaps={"handled"}
      scrollEnabled={false}
    >
      {children}
    </ScrollView>
  );
}
