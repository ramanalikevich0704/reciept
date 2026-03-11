import { Colors } from "@/constants/ColorConstants";
import { StyleSheet } from "react-native";

const PADDING_HORIZONTAL = 20;

export const Styles = StyleSheet.create({
  whiteText: { color: Colors.WHITE },
  darkGrayText: { color: Colors.MUTED_TEXT },
  greenText: { color: Colors.GREEN_PRIMARY },
  blackText: { color: Colors.BLACK },
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
  smallCustomText: {
    fontSize: 12,
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
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: Colors.ERROR_BG,
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  fieldForm: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.FIELD_BG,
  },
  searchFieldForm: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.WHITE,
  },
  element: {
    height: 45,
    borderRadius: 10,
  },
  field: {
    padding: 18,
    borderWidth: 1,
  },
  /** Меньше вертикальный padding, чтобы текст в поле высотой 45 не обрезался */
  inputPadding: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  mainBackground: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.BLACK,
  },
  imageBackgroundImageStyle: {
    flex: 1,
    backgroundColor: Colors.IMAGE_OVERLAY,
  },
  imageBackgroundStyle: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  blurColor: {
    backgroundColor: Colors.OVERLAY_DARK,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginTop: 44,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  contentPadding: {
    paddingHorizontal: PADDING_HORIZONTAL,
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
    color: Colors.GREEN_PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  buttonDisabled: {
    backgroundColor: Colors.BUTTON_DISABLED,
    opacity: 0.7,
    color: Colors.WHITE,
  },
  registerButton: {
    backgroundColor: Colors.GREEN_PRIMARY,
  },
  disableButtonText: {
    color: Colors.DISABLED_TEXT,
    fontSize: 18,
    fontFamily: "Apercu Pro",
  },
  forgetPassword: {
    fontSize: 14,
    fontFamily: "Apercu Pro",
    fontWeight: 700,
    textDecorationLine: "underline",
    color: Colors.WHITE,
    textAlign: "right",
    paddingBottom: 18,
  },
  loginwith: {
    fontSize: 14,
    fontFamily: "Apercu Pro",
    fontWeight: 700,
    color: Colors.WHITE,
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
    backgroundColor: Colors.BLUE_SOCIAL,
    borderRadius: 10,
  },
  whitebutton: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  socialNetworkButton: {
    height: 45,
    width: 145,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 28,
    zIndex: 10,
    padding: 5
  },
});

export const fieldStyle = [
  Styles.field,
  Styles.element,
  Styles.ordinaryCustomText,
  Styles.fieldForm,
  Styles.inputPadding,
];

export const searchInput = [
  Styles.field,
  Styles.element,
  Styles.ordinaryCustomText,
  Styles.searchFieldForm
]