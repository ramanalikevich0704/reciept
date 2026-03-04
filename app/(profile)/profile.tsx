import { AppBackground } from "@/components/AppBackground";
import { FormError } from "@/components/FormError";
import { fieldStyle, Styles } from "@/components/login/LoginStyles";
import { useAuth } from "@/src/auth/services/AuthService";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
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
import { formatPhoneMask, PHONE_REGEX } from "@/app/(auth)/static/static";

interface ProfileForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
}

const profileSchema = yup.object({
  email: yup
    .string()
    .test("check-empty", "", (v) => (v?.length ?? 0) > 0)
    .min(2, "Введите более двух символов")
    .max(256, "Максимально доступная длина 256 символов")
    .matches(/[@]/, "Необходимо написать @")
    .matches(/[.]/, "Допишите почтовый домен")
    .email("Поле email не соответствует формату"),
  name: yup
    .string()
    .test("check-empty", "", (v) => (v?.length ?? 0) > 0)
    .min(1, "Поле является обязательным")
    .max(256, "Максимально доступная длина 256 символов")
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Имя может содержать только буквы, пробелы и дефис"),
  surname: yup
    .string()
    .test("check-empty", "", (v) => (v?.length ?? 0) > 0)
    .min(1, "Поле является обязательным")
    .max(256, "Максимально доступная длина 256 символов")
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Фамилия может содержать только буквы, пробелы и дефис"),
  phonenumber: yup
    .string()
    .test("check-empty", "", (v) => (v?.length ?? 0) > 0)
    .matches(PHONE_REGEX, "Введите номер в формате +375 (44) 516-80-98"),
});

export default function ProfileView() {
  const router = useRouter();
  const { AuthService } = useAuth();
  const user = useAuthStore((s) => s.user);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ProfileForm>({
    mode: "onChange",
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? "",
      name: "",
      surname: "",
      phonenumber: "",
    },
  });

  const onSave = (data: ProfileForm) => {
    AuthService.updateProfile({
      email: data.email,
      name: data.name,
      surname: data.surname,
      phoneNumber: data.phonenumber,
    }).then(() => {
      router.replace("/(main)/main");
    });
  };

  return (
    <AppBackground>
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
                Профиль
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
              <FormError message={errors.email?.message} />

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
              <FormError message={errors.name?.message} />

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
              <FormError message={errors.surname?.message} />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, styles.input]}
                    placeholder="+375 (44) 516-80-98"
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(formatPhoneMask(text))}
                    value={value}
                    keyboardType="phone-pad"
                    maxLength={19}
                  />
                )}
                name="phonenumber"
              />
              <FormError message={errors.phonenumber?.message} />

              <TouchableOpacity
                style={[
                  Styles.button,
                  Styles.centerPosition,
                  Styles.element,
                  !isValid && Styles.buttonDisabled,
                ]}
                disabled={!isValid}
                onPress={handleSubmit(onSave)}
              >
                <Text
                  style={[Styles.greenText, isValid && Styles.disableButtonText]}
                >
                  Сохранить
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </SafeAreaView>
    </AppBackground>
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
  scrollContent: { paddingBottom: 40 },
  header: { marginTop: 44, marginBottom: 24 },
  form: { marginBottom: 24 },
  input: { marginBottom: 12 },
});
