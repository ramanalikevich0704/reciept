import { SMS_CODE_LENGTH } from "@/app/(auth)/static/static";
import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { FormError } from "@/components/FormError";
import { ScreenTransition } from "@/components/ScreenTransition";
import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
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
              Нет данных верификации. Вернитесь и отправьте код снова.
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={Styles.whiteText}>Назад</Text>
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
                Введите код из SMS
              </Text>
              <Text style={[Styles.whiteText, Styles.largeCustomText]}>
                Recipe Book
              </Text>
            </View>

            <View style={Styles.form}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[...fieldStyle, Styles.input]}
                    placeholder="123456"
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

              <TouchableOpacity
                style={[
                  Styles.button,
                  Styles.centerPosition,
                  Styles.element,
                  !isValid && Styles.buttonDisabled,
                ]}
                disabled={!isValid}
                onPress={handleSubmit(onConfirm)}
              >
                <Text
                  style={[
                    Styles.greenText,
                    isValid && Styles.disableButtonText,
                  ]}
                >
                  Подтвердить
                </Text>
              </TouchableOpacity>
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
