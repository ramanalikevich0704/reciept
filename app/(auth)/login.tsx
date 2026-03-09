import { ScreenTransition } from "@/components/ScreenTransition";
import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
import { LABELS, LOGIN_TEXT, PLACEHOLDERS } from "@/constants/constants";

import {
  getEmailRules,
  getPasswordRules,
} from "@/app/(auth)/static/static-regex";
import { AppBackground } from "@/components/AppBackground";
import { CreateAccountButton } from "@/components/CreateAccountButton";
import { FormButton } from "@/components/FormButton";
import { FormError } from "@/components/FormError";
import { useAuth } from "@/src/auth/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as yup from "yup";

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
//пят типов функций
// прото vs прототайп
// Object.create
// методы изменения массива
// состояния Промиса
// статические методы для объекдинения промисов all all seteled raise
//spread vs rest спред копирует,
// utility type
//reconciliation
//useEffect замменяет все методы ЖЦ, подписки, сайд эффекты, работа с таймерами
// useLayout vs useEffect
// useCallBack vs useMemo
// React memo
// shadow three yoga
//Fabric turbo module CodeGen
//Flash
//virtual List
// оптимизации списков RN
// Context API vs Redux/Zustand

//как происходит рендеринг компонентов
// про дом в RN почитать

// План：
//
// адаптация экранов под все девайсе ???
// Предусмотреть ошибки все возможные
// При тапе вне поля ввода клава не убирается(TouchableWithoutFeedback очень ломает логику)
// не везде сохраняется токен +++
// профиль открывается тогда, когда не нужен
// Сделать количество попыток ввода пароля или смс?
// Пофиксить навигацию на флоу авторизации +(вроде все ок)
// область видимости поля ввода в text input слишком узкое +(вроде все ок)
// Проверить что все ошибки отображаются в качестве алертов
// сделать детали рецепта
// сделать логику популярные блюда
// плохая навигация при старте и анимации переходов очень резки
//  и иногда экран логина сначала видно, хотя должен быть сразу main screeen
//Worklets
//Какие бывают нативные модули?
// глаз вью
// structureClone
// как определить что у объекта есть метод?
// какие есть методы обхекта
// методы массива
// let изменяемая переменная
// области видимости
// виды функций
// функциональные и классовые компоненты React
// компонент vs элемент React
// мемоизация
// как передаются пропсы
// методы ЖЦ компонента
// Самоорганизованность необходима в компании
// Какие есть способы создания анимации?

// Ответы:
// Примитивы: string, number, boolean, undefined, null, symbol, bigint
// Виды функций:
// Function Declaration(Поднимаются (hoisting), можно вызывать до объявления),
// Function Expression(Функция — значение, её можно передавать, присваивать),
// Arrow Function(Нет своего this (берётся из окружения), нет arguments, нельзя использовать как конструктор.)
// Конструктор(инитит объект как функцию через this)
// IIFE (сразу вызываемая функция)(Объявление и вызов в одном выражении, часто для изоляции области видимости.)
// Генератор(Возвращает итератор, по шагам через yiel)
// Async-функция(Всегда возвращает Promise, внутри можно использовать await.)

// ES как собирать билды, колд пуш
// FSD
// reanimated
// ЖЦ классовых и функциональных компонентов

const loginSchema = yup.object({
  email: getEmailRules(),
  password: getPasswordRules(),
});

export default function LoginView() {
  const router = useRouter();
  const { AuthService } = useAuth();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const login = (data: LoginForm) => {
    AuthService.login(data.email, data.password);
  };
  const registerUser = () => {
    router.push("/(auth)/register");
  };

  const openPhoneInput = () => {
    router.push("/(auth)/phone-input");
  };

  return (
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={Styles.safeArea}>
          <View style={{ marginTop: 44 }}>
            <View>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                {LOGIN_TEXT.WELCOME}
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                {LOGIN_TEXT.APP_NAME}
              </Text>
            </View>
          </View>
          <View>
            <View style={{ marginBottom: 44 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, { marginBottom: 12 }]}
                    placeholder={PLACEHOLDERS.EMAIL}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              <FormError
                message={
                  (emailValue?.trim() ?? "") !== ""
                    ? errors.email?.message
                    : undefined
                }
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle]}
                    placeholder={PLACEHOLDERS.PASSWORD}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              <FormError
                message={
                  (passwordValue?.trim() ?? "") !== ""
                    ? errors.password?.message
                    : undefined
                }
              />
            </View>
            {/* <Text
              style={Styles.forgetPassword}
              onPress={() => alert("Текст нажат!")}
            >
              Forget password?
            </Text> */}
            <FormButton
              label={LABELS.LOGIN}
              onPress={handleSubmit(login)}
              disabled={!isValid}
            />
            <Text style={Styles.loginwith}>{LOGIN_TEXT.LOGIN_WITH}</Text>
            <View style={Styles.socialNetworkContainer}>
              <TouchableOpacity
                style={[Styles.socialNetworkButton, Styles.whitebutton]}
                onPress={openPhoneInput}
              >
                <Icon name="call" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.socialNetworkButton, Styles.whitebutton]}
                onPress={AuthService.googleIn}
              >
                <Image
                  source={require("@/assets/images/google.png")}
                  style={Styles.iconGoogle}
                />
              </TouchableOpacity>
            </View>
            <Text style={Styles.loginwith}>{LOGIN_TEXT.OR}</Text>
            <CreateAccountButton onPress={registerUser} />
          </View>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}
