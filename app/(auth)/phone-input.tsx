import { formatPhoneMask } from "@/app/(auth)/static/static";
import { getPhoneNumberRules } from "@/app/(auth)/static/static-regex";
import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { FormButton } from "@/components/FormButton";
import { FormError } from "@/components/FormError";
import { ScreenTransition } from "@/components/ScreenTransition";
import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
import {
  LABELS,
  PLACEHOLDERS,
  PHONE_INPUT_TEXT,
} from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

interface PhoneForm {
  phonenumber: string;
}

const phoneSchema = yup.object({
  phonenumber: getPhoneNumberRules(),
});

export default function PhoneInputView() {
  const router = useRouter();
  const { AuthService } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PhoneForm>({
    mode: "onChange",
    resolver: yupResolver(phoneSchema),
  });

  const phonenumberValue = watch("phonenumber");

  const onSendCode = (data: PhoneForm) => {
    AuthService.signInWithPhoneNumber(data.phonenumber)
      .then(() => {
        router.push("/(auth)/sms-code");
      })
      .catch(() => {
        // Ошибка уже показана в AuthService через handleSecureError
      });
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
