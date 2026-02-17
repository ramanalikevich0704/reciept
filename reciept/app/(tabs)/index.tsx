import { Styles } from "@/components/login/LoginStyles";
import { yupResolver } from '@hookform/resolvers/yup';  
import * as yup from 'yup';

import {
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useForm,
  Controller,
} from "react-hook-form";

interface LoginForm { email: string; password: string; } 

export default function LoginView() {
  const bgImage = require("@/assets/images/login-background.jpg");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const loginSchema = yup.object({  
    email: yup.string()
           .min(2, 'Введите более двух символов')
           .matches(/[@]/, "Необходимо написать @")  
           .matches(/[.]/, "Допишите почтовый домен")
           .email('Поле email не соответствует формату'), 
    password: yup.string()
              .required()
              .min(8, 'Введите 8 и более символов в пароле')
              .matches(/(?=.*\d)/, "Введите хотя бы одну цифру")  
              .matches(/(?=.*[A-Za-z])/, "Введите хотя бы одну букву")  
              .matches(/[@$!%*?&)()]/, "Введите хотя бы один символ") 
              .max(256, 'Максимальное количество символов в пароле 256, уберите лишние символы') 
  }).required();  

  const { control, handleSubmit, formState: { isValid, errors } } = useForm<LoginForm>({ 
    mode: "onChange", 
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = () => console.log("dsd");

  return (
    <View style={Styles.mainBackground}>
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={Styles.imageBackgroundStyle}
        imageStyle={Styles.imageBackgroundImageStyle}
      >
        <View style={[
          StyleSheet.absoluteFillObject,
          Styles.blurColor
        ]} />
        <SafeAreaView style={Styles.safeArea}>
          <View style={{ marginTop: 44 }}>
            <View>
              <Text style={[
                Styles.whiteText,
                Styles.mediumStandardText
                ]}>
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
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                            Styles.field,
                            Styles.element,
                            Styles.ordinaryCustomText,
                            Styles.fieldForm,
                            {marginBottom: 12}
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
              {errors['email'] && errors['email'].message && (
                <Text style={[Styles.errorText]}>
                  {errors.email.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                            Styles.field,
                            Styles.element,
                            Styles.ordinaryCustomText,
                            Styles.fieldForm
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
              {errors['password'] && errors['password'].message && (
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
                Styles.element
              ]}
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
              // onPress={() => alert("Текст нажат!")}
            >
              <Text
                style={[
                  Styles.greenText,
                  isValid && Styles.disableButtonText
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <Text style={Styles.loginwith}>Login with</Text>
            <View style={Styles.socialNetworkContainer}>
              <TouchableOpacity
                style={[
                  Styles.socialNetworkButton, 
                  Styles.whitebutton
                ]}
                onPress={() => console.log("Нажато!")}
              >
                <Image
                  source={require("@/assets/images/google.png")}
                  style={Styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  Styles.socialNetworkButton,
                  Styles.bluebutton
                ]}
                onPress={() => console.log("Нажато!")}
              >
                <Image
                  source={require("@/assets/images/facebook.png")}
                  style={Styles.icon}
                />
              </TouchableOpacity>
            </View>
            <Text style={Styles.loginwith}>or</Text>
            <TouchableOpacity 
            style={[
              Styles.registerButton, 
              Styles.centerPosition,
              Styles.element
            ]}>
              <Text style={[Styles.mediumCustomText, Styles.boldCustomText, Styles.whiteText]}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

//react hook form почитать
// react/react-native под капотом
// Максимилян Шварцмюллер коурсера курс react native, курс по js
// как работает рендер ререндер, проксы, hook-и
// state manager, редакс и цустант
