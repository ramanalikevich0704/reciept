import { ALLOWED_TRANSITIONS, SCREENS } from "@/app/router/navigationGraph";
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
import { LABELS, PLACEHOLDERS, PROFILE_TEXT } from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import {
  ProfileForm,
  profileSchema,
} from "@/src/auth/services/validation/scheme/ProfileValidationScheme";
import { useValidation } from "@/src/auth/services/validation/ValidationService";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView() {
  const router = useRouter();
  const { AuthService } = useAuth();
  const user = useAuthStore((s) => s.user);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useValidation<ProfileForm>(profileSchema, {
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
              {createFormFields<ProfileForm>(
                [
                  FieldType.EMAIL,
                  FieldType.NAME,
                  FieldType.SURNAME,
                  FieldType.PHONE,
                ],
                {
                  control,
                  errors,
                  watch,
                  placeholderOverrides: {
                    [FieldType.EMAIL]: PLACEHOLDERS.EMAIL_RU,
                  },
                },
              )}

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
