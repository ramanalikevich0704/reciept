import { Styles } from "@/components/login/LoginStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/src/auth/services/AuthService";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

// Формат телефона: 375 (44) 516-80-98
const PHONE_REGEX = /^375\s*\(\d{2}\)\s*\d{3}-\d{2}-\d{2}$/;

interface RegisterForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object({
  email: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .min(2, "Введите более двух символов")
    .max(256, "Максимально доступная длинная 256 символов")
    .matches(/[@]/, "Необходимо написать @")
    .matches(/[.]/, "Допишите почтовый домен")
    .email("Поле email не соответствует формату"),
  name: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .min(1, "Поле является обязательным, нужно ввести данные")
    .max(256, "Максимально доступная длинная 256 символов")
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Имя может содержать только буквы, пробелы и дефис"),
  surname: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .min(1, "Поле является обязательным, нужно ввести данные")
    .max(256, "Максимально доступная длинная 256 символов")
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Фамилия может содержать только буквы, пробелы и дефис"),
  phonenumber: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .matches(PHONE_REGEX, "Введите номер в формате 375 (44) 516-80-98"),
  password: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .min(8, "Введите 8 и более символов в пароле")
    .matches(/(?=.*\d)/, "Введите хотя бы одну цифру")
    .matches(/(?=.*[A-Za-z])/, "Введите хотя бы одну букву")
    .matches(/[@$!%*?&)()]/, "Введите хотя бы один символ")
    .max(256, "Максимальное количество символов в пароле 256"),
  confirmPassword: yup
    .string()
    .test("check-empty", "", function (value) {
      if (value?.length === 0) return false;
      return true;
    })
    .oneOf([yup.ref("password")], "Пароли не совпадают"),
});

const fieldStyle = [
  Styles.field,
  Styles.element,
  Styles.ordinaryCustomText,
  Styles.fieldForm,
];

export default function RegisterView() {
  const router = useRouter();
  const bgImage = require("@/assets/images/login-background.jpg");

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<RegisterForm>({
    mode: "onChange",
    resolver: yupResolver(registerSchema),
  });
  const { AuthService } = useAuth();

  const onRegister = (data: RegisterForm) => {
    AuthService.register({
      uid: null,
      email: data.email,
      firstName: data.name,
      surname: data.surname,
      phoneNumber: data.phonenumber
    }, data.password)
  };

  return (
    <View style={Styles.mainBackground}>
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={Styles.imageBackgroundStyle}
        imageStyle={Styles.imageBackgroundImageStyle}
      >
        <View style={[StyleSheet.absoluteFillObject, Styles.blurColor]} />
        <SafeAreaView style={Styles.safeArea}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                Create account
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                Recipe Book
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Введите email"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
              {errors.email?.message && (
                <Text style={Styles.errorText}>{errors.email.message}</Text>
              )}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Введите имя"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
                name="name"
              />
              {errors.name?.message && (
                <Text style={Styles.errorText}>{errors.name.message}</Text>
              )}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Введите фамилию"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
                name="surname"
              />
              {errors.surname?.message && (
                <Text style={Styles.errorText}>{errors.surname.message}</Text>
              )}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Введите номер телефона"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                  />
                )}
                name="phonenumber"
              />
              {errors.phonenumber?.message && (
                <Text style={Styles.errorText}>
                  {errors.phonenumber.message}
                </Text>
              )}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Введите пароль"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors.password?.message && (
                <Text style={Styles.errorText}>{errors.password.message}</Text>
              )}

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="Подтвердите пароль"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword?.message && (
                <Text style={Styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  Styles.button,
                  Styles.centerPosition,
                  Styles.element,
                  !isValid && Styles.buttonDisabled,
                ]}
                disabled={!isValid}
                onPress={handleSubmit(onRegister)}
              >
                <Text
                  style={[Styles.greenText, isValid && Styles.disableButtonText]}
                >
                  Зарегистрироваться
                </Text>
              </TouchableOpacity>

              <Text
                style={[Styles.forgetPassword, { textAlign: "center", paddingTop: 16 }]}
                onPress={() => router.back()}
              >
                Уже есть аккаунт? Войти
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 48,
    left: 8,
    zIndex: 10,
    padding: 8,
    marginLeft: 4,
  },
  scroll: { flex: 1 },
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
});
