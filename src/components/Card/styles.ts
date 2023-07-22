import { StyleSheet } from "react-native";

export const HEIGHT = 44;
export const MARGINBOTTOM = 12;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#666",
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 8,
  }
});
