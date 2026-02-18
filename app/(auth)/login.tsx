import { Styles } from "@/components/login/LoginStyles";
import getTokenRepository from "@/src/auth/services/getTokenRepository";
import saveTokenRepository from "@/src/auth/services/saveTokenRepository";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginForm {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) {
        return false;
      }
      return true;
    })
    .min(2, "Введите более двух символов")
    .matches(/[@]/, "Необходимо написать @")
    .matches(/[.]/, "Допишите почтовый домен")
    .email("Поле email не соответствует формату"),
  password: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) {
        return false;
      }
      return true;
    })
    .min(8, "Введите 8 и более символов в пароле")
    .matches(/(?=.*\d)/, "Введите хотя бы одну цифру")
    .matches(/(?=.*[A-Za-z])/, "Введите хотя бы одну букву")
    .matches(/[@$!%*?&)()]/, "Введите хотя бы один символ")
    .max(
      256,
      "Максимальное количество символов в пароле 256, уберите лишние символы",
    ),
});

export default function LoginView() {
  const bgImage = require("@/assets/images/login-background.jpg");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = () => {
    console.log("dsd");
    const apiKey = "46ec8567d8a3484895afb7d53572aa5c";
    saveTokenRepository(apiKey);
  };
  console.log(errors["email"]?.message, isValid);
  return getTokenRepository === null ? (
    <View style={{ backgroundColor: "red" }}></View>
  ) : (
    <View style={Styles.mainBackground}>
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={Styles.imageBackgroundStyle}
        imageStyle={Styles.imageBackgroundImageStyle}
      >
        <View style={[StyleSheet.absoluteFillObject, Styles.blurColor]} />
        <SafeAreaView style={Styles.safeArea}>
          <View style={{ marginTop: 44 }}>
            <View>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                Welcome to
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                Recipe Book
              </Text>
            </View>
          </View>
          <View>
            <View style={{ marginBottom: 44 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      Styles.field,
                      Styles.element,
                      Styles.ordinaryCustomText,
                      Styles.fieldForm,
                      { marginBottom: 12 },
                    ]}
                    placeholder={"Enter email"}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors["email"] && errors["email"].message && (
                <Text style={[Styles.errorText]}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      Styles.field,
                      Styles.element,
                      Styles.ordinaryCustomText,
                      Styles.fieldForm,
                    ]}
                    placeholder={"Enter password"}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors["password"] && errors["password"].message && (
                <Text style={[Styles.errorText]}>
                  {errors.password.message}
                </Text>
              )}
            </View>
            <Text
              style={Styles.forgetPassword}
              onPress={() => alert("Текст нажат!")}
            >
              Forget password?
            </Text>
            <TouchableOpacity
              style={[
                Styles.button,
                Styles.centerPosition,
                Styles.element,
                !isValid && Styles.buttonDisabled,
                Styles.centerPosition,
                Styles.element,
              ]}
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                style={[Styles.greenText, isValid && Styles.disableButtonText]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <Text style={Styles.loginwith}>Login with</Text>
            <View style={Styles.socialNetworkContainer}>
              <TouchableOpacity
                style={[Styles.socialNetworkButton, Styles.bluebutton]}
                onPress={() => console.log("Нажато!")}
              >
                <Image
                  source={require("@/assets/images/facebook.png")}
                  style={Styles.iconFacebook}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.socialNetworkButton, Styles.whitebutton]}
                onPress={() => console.log("Нажато!")}
              >
                <Image
                  source={require("@/assets/images/google.png")}
                  style={Styles.iconGoogle}
                />
              </TouchableOpacity>
            </View>
            <Text style={Styles.loginwith}>or</Text>
            <TouchableOpacity
              style={[
                Styles.registerButton,
                Styles.centerPosition,
                Styles.element,
              ]}
            >
              <Text
                style={[
                  Styles.mediumCustomText,
                  Styles.boldCustomText,
                  Styles.whiteText,
                ]}
              >
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
