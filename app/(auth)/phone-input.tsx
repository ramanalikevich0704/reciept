import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import {
  createFormFields,
  FieldType,
} from "@/components/FormFieldFactory";
import { FormButton } from "@/components/FormButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/styles/LoginStyles";
import { LABELS, PHONE_INPUT_TEXT } from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import {
  PhoneForm,
  phoneSchema,
} from "@/src/auth/services/validation/scheme/PhoneValidationScheme";
import { useValidation } from "@/src/auth/services/validation/ValidationService";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhoneInputView() {
  const router = useRouter();
  const { AuthService } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useValidation<PhoneForm>(phoneSchema);

  const onSendCode = (data: PhoneForm) => {
    AuthService.signInWithPhoneNumber(data.phonenumber)
      .then(() => {
        router.push("/(auth)/sms-code");
      })
  };

  return (
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={Styles.safeArea}>
          <BackButton onPress={() => router.back()} style={Styles.backButton} />
          <View style={[Styles.container, Styles.scrollContent]}>
            <View style={Styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                {PHONE_INPUT_TEXT.HEADER}
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                {PHONE_INPUT_TEXT.APP_NAME}
              </Text>
            </View>

            <View style={Styles.form}>
              {createFormFields<PhoneForm>([FieldType.PHONE], {
                control,
                errors,
                watch,
              })}

              <FormButton
                label={LABELS.SEND_CODE}
                onPress={handleSubmit(onSendCode)}
              />
            </View>
          </View>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}
