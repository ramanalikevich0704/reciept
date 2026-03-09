import {
  FirebaseAuthTypes
} from "@react-native-firebase/auth";
import { Colors } from "@/constants/ColorConstants";
import { authInstance } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { WebView } from "react-native-webview";
import firestore from "@react-native-firebase/firestore";
import { Alert, View } from "react-native";
import { StyleSheet } from "react-native";
import { Dispatch, SetStateAction } from "react";

/**
 * Приводит номер к формату E.164 для Firebase: + и только цифры.
 * Примеры: "375 (44) 516-80-98" → "+375445168098", "375445168098" → "+375445168098"
 */
export function toE164(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return `+${digits}`;
}

export async function confirmCode(
  code: string,
  confirmation: FirebaseAuthTypes.ConfirmationResult | null,
): Promise<boolean> {
  const userCredential = await confirmation?.confirm(code);

  if (userCredential?.user) {
    await firestore()
      .collection("users")
      .doc(userCredential.user.uid)
      .get();
    return true;
  }
  return false;
}

export async function sendVerificationCode(
  phoneNumber: string,
  token: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  const e164 = toE164(phoneNumber);
  const confirmation = await authInstance.signInWithPhoneNumber(e164);
  return confirmation;
}

// const RECAPTCHA_SITE_KEY = "6LfBYHgsAAAAAPG4cy-180UC0RppfX0VrJ0-Fqft";
// const BASE_URL = 'https://receipt-92b78.firebaseapp.com';

// export const RecaptchaBridge = (({ onVerify, showWebView }) => {
//   const html = `
//     <html>
//       <head>
//         <script src="https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}"></script>
//         <script>
//           window.onload = function() {
//             grecaptcha.ready(function() {
//               grecaptcha.execute('${RECAPTCHA_SITE_KEY}', {action: 'login'}).then(function(token) {
//                 window.ReactNativeWebView.postMessage(token);
//               });
//             });
//           };
//         </script>
//       </head>
//       <body></body>
//     </html>
//   `;

//   return (
//     <View style={showWebView ? styles.webViewContainer : styles.hidden}>
//       <WebView
//         source={{ html, baseUrl: BASE_URL }}
//         style={{ height: 0, width: 0, opacity: 0 }} // Скрываем WebView
//         onMessage={(event) => onVerify(event.nativeEvent.data)}
//         javaScriptEnabled={true}
//       />
//     </View>
//   );
// });

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1, // Растянуть на весь экран
    zIndex: 999, // Поверх всех элементов
    backgroundColor: Colors.CAPTCHA_OVERLAY,
  },
  hidden: {
    height: 0,
    width: 0,
    opacity: 0,
    position: "absolute",
  },
});
