import { Background } from "@react-navigation/elements";
import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  whiteText: { color: 'white'},
  greenText: { color: "rgba(52, 168, 83, 1)" },
  blackText: { color: 'black'},
  ordinaryStandardText: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "SF Pro Display"
  },
  mediumStandardText: {
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "SF Pro Display"
  },
  ordinaryCustomText: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Apercu Pro"
  },
  mediumCustomText: {
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "Apercu Pro"
  },
  largeCustomText: {
    fontSize: 36,
    fontWeight: 400,
    fontFamily: "Apercu Pro"
  },
  boldCustomText: {
    fontWeight: 700,
    fontFamily: "Apercu Pro"
  },
  errorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "rgba(237, 7, 7, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  fieldForm: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "rgba(244, 235, 235, 0.45)"
  },
  element: {
    height: 45,
    borderRadius: 10,
  },
  field: {
    padding: 18,
    borderWidth: 1,
  },
  mainBackground: { 
    height: "100%",
    width: "100%",
    backgroundColor: "black" 
  },
  imageBackgroundImageStyle: {
    flex: 1,
    backgroundColor: "rgba(156, 148, 148, 0.5)"
  },
  imageBackgroundStyle: {
    flex: 1, // Растягивает на весь экран
    paddingHorizontal: 20,
  },
  blurColor: {
    backgroundColor: "rgba(25,25,25,0.4)" 
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-around"
  },
  socialNetworkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  centerPosition: {
    justifyContent: "center",
    alignItems: "center"
  },
  //
  button: {
    color: "rgba(52, 168, 83, 1)",
    backgroundColor: "white",
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9", // Серый для неактивной
    opacity: 0.7,
    color: "white",
  },
  registerButton: {
    backgroundColor: "rgba(52, 168, 83, 1)",
  },
  disableButtonText: {
    color: "rgba(74, 5, 5, 0.45)",
    fontSize: 18,
    fontFamily: "Apercu Pro",
  },
  forgetPassword: {
    fontSize: 14,
    fontFamily: "Apercu Pro",
    fontWeight: 700,
    textDecorationLine: "underline",
    color: "white",
    textAlign: "right",
    paddingBottom: 18,
  },
   loginwith: {
    fontSize: 14,
    fontFamily: "Apercu Pro",
    fontWeight: 700,
    color: "white",
    textAlign: "center",
    paddingBottom: 18,
    paddingVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  bluebutton: {
    backgroundColor: "rgba(59, 89, 153, 1)",
    borderRadius: 10,
  },
  whitebutton: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  socialNetworkButton: {
    height: 45,
    width: 145,
    justifyContent: "center",
    alignItems: "center",
  },
});