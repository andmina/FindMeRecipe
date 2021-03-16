import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AppContext } from "./AppContextProvider";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#96bdc6",
    alignItems: "center", // align  button text
    justifyContent: "center",
    borderRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonLoading: {
    backgroundColor: "#bdd6db",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#fff",
    marginHorizontal: 4,
  },
});

export const Button = function ({
  buttonText,
  onPress,
  loading = false,
  style = {},
}) {
  const { theme } = useContext(AppContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { ...theme.interactableAccent },
        loading && styles.buttonLoading,
        style,
      ]}
      disabled={loading}
      activeOpacity={0.6}
    >
      <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};
