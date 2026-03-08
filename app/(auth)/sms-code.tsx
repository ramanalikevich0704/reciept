import { SMS_CODE_LENGTH } from "@/app/(auth)/static/static";
import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { FormButton } from "@/components/FormButton";
import { FormError } from "@/components/FormError";
import { ScreenTransition } from "@/components/ScreenTransition";
import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
import {
  LABELS,
  PLACEHOLDERS,
  SMS_CODE_TEXT,
} from "@/constants/constants";
import { useAuth } from "@/src/auth/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { getSmsRules } from "./static/static-regex";

interface SmsCodeForm {
  code: string;
}

const smsCodeSchema = yup.object({
  code: getSmsRules(),
});

export default function SmsCodeView() {
  const router = useRouter();
  const { AuthService, confirmation } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<SmsCodeForm>({
    mode: "onChange",
    resolver: yupResolver(smsCodeSchema),
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");

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
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder={PLACEHOLDERS.SMS_CODE}
                    placeholderTextColor={Styles.whiteText.color}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                    maxLength={SMS_CODE_LENGTH}
                  />
                )}
                name="code"
              />
              <FormError
                message={
                  (codeValue?.trim() ?? "") !== ""
                    ? errors.code?.message
                    : undefined
                }
              />

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
