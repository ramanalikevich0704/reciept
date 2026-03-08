import { formatPhoneMask } from "@/app/(auth)/static/static";
import {
  getConfirmPasswordRules,
  getEmailRules,
  getNameRules,
  getPasswordRules,
  getPhoneNumberRules,
  getSurnameRules,
} from "@/app/(auth)/static/static-regex";
import { AdaptiveContainer } from "@/components/AdaptiveContainer";
import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { FormButton } from "@/components/FormButton";
import { FormError } from "@/components/FormError";
import { ScreenTransition } from "@/components/ScreenTransition";
import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
import {
  LABELS,
  PLACEHOLDERS,
  REGISTER_TEXT,
} from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

interface RegisterForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object({
  email: getEmailRules(),
  name: getNameRules(),
  surname: getSurnameRules(),
  phonenumber: getPhoneNumberRules(),
  password: getPasswordRules(),
  confirmPassword: getConfirmPasswordRules(),
});

export default function RegisterView() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<RegisterForm>({
    mode: "onChange",
    resolver: yupResolver(registerSchema),
  });
  const { AuthService } = useAuth();

  const emailValue = watch("email");
  const nameValue = watch("name");
  const surnameValue = watch("surname");
  const phonenumberValue = watch("phonenumber");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const onRegister = (data: RegisterForm) => {
    AuthService.register(
      {
        uid: null, //нужно ли здесь генерить?
        email: data.email,
        firstName: data.name,
        surname: data.surname,
        phoneNumber: data.phonenumber,
      },
      data.password,
    );
  };

  return (
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={Styles.safeArea}>
          <BackButton onPress={() => router.back()} style={Styles.backButton} />
          <AdaptiveContainer
            style={Styles.container}
            contentContainerStyle={Styles.scrollContent}
            scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
          >
            <View style={Styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                {REGISTER_TEXT.HEADER}
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                {REGISTER_TEXT.APP_NAME}
              </Text>
            </View>

            <View style={Styles.form}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.EMAIL_RU}
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
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.NAME}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
                name="name"
              />
              <FormError
                message={
                  (nameValue?.trim() ?? "") !== ""
                    ? errors.name?.message
                    : undefined
                }
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.SURNAME}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
                name="surname"
              />
              <FormError
                message={
                  (surnameValue?.trim() ?? "") !== ""
                    ? errors.surname?.message
                    : undefined
                }
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.PHONE}
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
              <FormError
                message={
                  (phonenumberValue?.trim() ?? "") !== ""
                    ? errors.phonenumber?.message
                    : undefined
                }
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.PASSWORD_RU}
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

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="confirmPassword"
              />
              <FormError
                message={
                  (confirmPasswordValue?.trim() ?? "") !== ""
                    ? errors.confirmPassword?.message
                    : undefined
                }
              />

              <FormButton
                label={LABELS.REGISTER}
                onPress={handleSubmit(onRegister)}
                disabled={!isValid}
              />

              <Text
                style={[
                  Styles.forgetPassword,
                  { textAlign: "center", paddingTop: 16 },
                ]}
                onPress={() => router.back()}
              >
                {REGISTER_TEXT.HAVE_ACCOUNT}
              </Text>
            </View>
          </AdaptiveContainer>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}
