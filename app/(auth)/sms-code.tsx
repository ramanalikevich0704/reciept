import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import {
  createFormFields,
  FieldType,
} from "@/components/FormFieldFactory";
import { FormButton } from "@/components/FormButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/styles/LoginStyles";
import { LABELS, SMS_CODE_TEXT } from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import {
  SmsCodeForm,
  smsCodeSchema,
} from "@/src/auth/services/validation/scheme/SmsCodeValidationScheme";
import { useValidation } from "@/src/auth/services/validation/ValidationService";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SmsCodeView() {
  const router = useRouter();
  const { AuthService, confirmation } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useValidation<SmsCodeForm>(smsCodeSchema, {
    defaultValues: { code: "" },
  });

  const onConfirm = (data: SmsCodeForm) => {
    AuthService.confirmCode(data.code);
  };

  if (!confirmation) {
    return (
      <ScreenTransition>
        <AppBackground>
          <SafeAreaView style={Styles.safeArea}>
            <Text style={[Styles.whiteText, { padding: 20 }]}>
              {SMS_CODE_TEXT.NO_VERIFICATION}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={Styles.whiteText}>{LABELS.BACK}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </AppBackground>
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={Styles.safeArea}>
          <BackButton onPress={() => router.back()} style={Styles.backButton} />
          <View
            style={[Styles.container, Styles.contentPadding, styles.content]}
          >
            <View style={Styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                {SMS_CODE_TEXT.HEADER}
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                {SMS_CODE_TEXT.APP_NAME}
              </Text>
            </View>

            <View style={Styles.form}>
              {createFormFields<SmsCodeForm>([FieldType.SMS_CODE], {
                control,
                errors,
                watch,
              })}

              <FormButton
                label={LABELS.CONFIRM}
                onPress={handleSubmit(onConfirm)}
                disabled={!isValid}
              />
            </View>
          </View>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 44 },
});
