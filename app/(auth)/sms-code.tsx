import { AppBackground } from "@/components/AppBackground";
import { fieldStyle, Styles } from "@/components/login/LoginStyles";
import { useAuth } from "@/src/auth/services/AuthService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { getSmsRules } from "./static/static-regex";
import { SMS_CODE_LENGTH } from "@/app/(auth)/static/static";

interface SmsCodeForm {
  code: string;
}

const smsCodeSchema = yup.object({
  code: getSmsRules()
});

export default function SmsCodeView() {
  const router = useRouter();
  const { AuthService, confirmation } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<SmsCodeForm>({
    mode: "onChange",
    resolver: yupResolver(smsCodeSchema),
    defaultValues: { code: "" },
  });

  const onConfirm = (data: SmsCodeForm) => {
    AuthService.confirmCode(data.code);
  };

  if (!confirmation) {
    return (
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
    );
  }

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
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                Введите код из SMS
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
              {errors.code?.message && (
                <Text style={Styles.errorText}>{errors.code.message}</Text>
              )}

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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 44 },
  header: { marginBottom: 24 },
  form: { marginBottom: 24 },
  input: { marginBottom: 12 },
});
