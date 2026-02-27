import {
  PhoneAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { authInstance } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { WebView } from "react-native-webview";
import firestore from "@react-native-firebase/firestore";
import { Alert, View } from "react-native";
//import React, { useState } from "react";
import { StyleSheet } from 'react-native';

export async function confirmCode(
  code: string,
  verificationId: string,
): Promise<boolean> {
  try {
    if (!verificationId) throw new Error("Нет ID верификации");
    const credential = PhoneAuthProvider.credential(verificationId, code);
    
    // Входим в систему!
    const userCredential = await signInWithCredential(authInstance, credential);
    
    console.log('Победа! Пользователь вошел:', userCredential.user.uid);

    if (userCredential.user) {
      // Проверяем, есть ли пользователь в Firestore
      const user = await firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .get()

      if (user.data()) return true;
    }
  } catch (error) {
    Alert.alert("Ошибка", "Неверный код из SMS", []);
  }
  // setShowWebView(false)
  return false;
}

export async function sendVerificationCode(
  phoneNumber: string,
  token: string,
  setVerificationId: React.Dispatch<React.SetStateAction<string>>
){
  // setShowWebView(true)
  const verifier = {
    type: "recaptcha",
    verify: async () => token, // отдаем токен, который поймал WebView
  };
  const provider = new PhoneAuthProvider(authInstance);
  // Вызываем капчу
  const vid = await provider.verifyPhoneNumber(phoneNumber, verifier as any);
  setVerificationId(vid);
  console.log('SMS ушло! Сохранили vId:', vid);
}


const RECAPTCHA_SITE_KEY = "6LfBYHgsAAAAAPG4cy-180UC0RppfX0VrJ0-Fqft";
const BASE_URL = 'https://receipt-92b78.firebaseapp.com';

export const RecaptchaBridge = (({ onVerify, showWebView }) => {
  const html = `
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}"></script>
        <script>
          window.onload = function() {
            grecaptcha.ready(function() {
              grecaptcha.execute('${RECAPTCHA_SITE_KEY}', {action: 'login'}).then(function(token) {
                window.ReactNativeWebView.postMessage(token);
              });
            });
          };
        </script>
      </head>
      <body></body>
    </html>
  `;

  return (
    <View style={showWebView ? styles.webViewContainer : styles.hidden}>
      <WebView
        source={{ html, baseUrl: BASE_URL }}
        style={{ height: 0, width: 0, opacity: 0 }} // Скрываем WebView
        onMessage={(event) => onVerify(event.nativeEvent.data)}
        javaScriptEnabled={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  webViewContainer: {
    flex:1, // Растянуть на весь экран
    zIndex: 999, // Поверх всех элементов
    backgroundColor: 'rgba(0,0,0,0.5)', // Полупрозрачный фон для капчи
  },
  hidden: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  }
});
