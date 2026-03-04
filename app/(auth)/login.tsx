import { Styles } from "@/components/login/LoginStyles";

import { useAuth } from "@/src/auth/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
import * as yup from "yup";
import { getEmailRules, getPasswordRules } from "@/app/(auth)/static/static-regex";
import { AppBackground } from "@/components/AppBackground";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginForm {
  email: string;
  password: string;
}

// Прочитать про this?
// смена контекста колл эплай байнд
// ref типы, как копировать или делать ссылку
// ScrollView и FlatList
// флэш лист
// типы копирования
//асинхронность
//use memo, use callback
//custom hook
//методы промиса!!!

//как происходит рендеринг компонентов
// про дом в RN почитать
//Как сделать плавную анимацию?

const loginSchema = yup.object({
  email: getEmailRules(),
  password: getPasswordRules()
});

export default function LoginView() {
  const router = useRouter();
  const { 
    AuthService, 
    showWebView, 
    code, 
    setCode,
    setToken
  } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const login = (data: LoginForm) => {
    AuthService.login(data.email, data.password)
  };
  const registerUser = () => {
    router.push("/(auth)/register");
  };

  const openPhoneInput = () => {
    router.push("/(auth)/phone-input");
  };

  return (
    <AppBackground>
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
                    placeholder="Enter password"
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
              onPress={handleSubmit(login)}
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
                style={[Styles.socialNetworkButton, Styles.whitebutton]}
                onPress={openPhoneInput}
              >
                <Icon name="call" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.socialNetworkButton, Styles.whitebutton]}
                onPress={ AuthService.googleIn }
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
              onPress={registerUser}
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
    </AppBackground>
  );
}
