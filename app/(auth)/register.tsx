import { AdaptiveContainer } from "@/components/AdaptiveContainer";
import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import {
  createFormFields,
  FieldType,
} from "@/components/FormFieldFactory";
import { FormButton } from "@/components/FormButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/styles/LoginStyles";
import { LABELS, PLACEHOLDERS, REGISTER_TEXT } from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import {
  RegisterForm,
  registerSchema,
} from "@/src/auth/services/validation/scheme/RegisterValidationScheme";
import { useValidation } from "@/src/auth/services/validation/ValidationService";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterView() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useValidation<RegisterForm>(registerSchema);
  const { AuthService } = useAuth();

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
              {createFormFields<RegisterForm>(
                [
                  FieldType.EMAIL,
                  FieldType.NAME,
                  FieldType.SURNAME,
                  FieldType.PHONE,
                  FieldType.PASSWORD,
                  FieldType.CONFIRM_PASSWORD,
                ],
                {
                  control,
                  errors,
                  watch,
                  placeholderOverrides: {
                    [FieldType.EMAIL]: PLACEHOLDERS.EMAIL_RU,
                    [FieldType.PASSWORD]: PLACEHOLDERS.PASSWORD_RU,
                  },
                },
              )}

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
