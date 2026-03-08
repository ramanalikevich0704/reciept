import { formatPhoneMask } from "@/app/(auth)/static/static";
import {
  getEmailRules,
  getNameRules,
  getPhoneNumberRules,
  getSurnameRules,
} from "@/app/(auth)/static/static-regex";
import { ALLOWED_TRANSITIONS, SCREENS } from "@/app/router/navigationGraph";
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
  PROFILE_TEXT,
} from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
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

interface ProfileForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
}

const profileSchema = yup.object({
  email: getEmailRules(),
  name: getNameRules(),
  surname: getSurnameRules(),
  phonenumber: getPhoneNumberRules(),
});

export default function ProfileView() {
  const router = useRouter();
  const { AuthService } = useAuth();
  const user = useAuthStore((s) => s.user);

  const {
    control,
    handleSubmit,
    watch,
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

  const emailValue = watch("email");
  const nameValue = watch("name");
  const surnameValue = watch("surname");
  const phonenumberValue = watch("phonenumber");

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
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={Styles.safeArea}>
          <BackButton
            onPress={() => {
              const next = ALLOWED_TRANSITIONS.PROFILE.BACK;
              if (next) {
                AuthService.logout().then(() => router.replace(SCREENS[next]));
              }
            }}
            style={Styles.backButton}
          />
          <AdaptiveContainer
            style={Styles.container}
            contentContainerStyle={Styles.scrollContent}
            scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
          >
            <View style={Styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                {PROFILE_TEXT.HEADER}
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                {PROFILE_TEXT.APP_NAME}
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

              <FormButton
                label={LABELS.SAVE}
                onPress={handleSubmit(onSave)}
                disabled={!isValid}
              />
            </View>
          </AdaptiveContainer>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}
