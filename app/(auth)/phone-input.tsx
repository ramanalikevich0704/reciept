import { AppBackground } from "@/components/AppBackground";
import { fieldStyle, Styles } from "@/components/login/LoginStyles";
import { useAuth } from "@/src/auth/services/AuthService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { formatPhoneMask } from "@/app/(auth)/static/static";
import { getPhoneNumberRules } from "@/app/(auth)/static/static-regex";

interface PhoneForm {
  phonenumber: string;
}

const phoneSchema = yup.object({
  phonenumber: getPhoneNumberRules()
});



export default function PhoneInputView() {
  const router = useRouter();
  const { AuthService } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneForm>({
    mode: "onChange",
    resolver: yupResolver(phoneSchema),
  });

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
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={[Styles.whiteText, Styles.mediumStandardText]}>
                Вход по номеру телефона
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
                    placeholder="+375 (44) 516-80-98"
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
              {errors.phonenumber?.message && (
                <Text style={Styles.errorText}>
                  {errors.phonenumber.message}
                </Text>
              )}

              <TouchableOpacity
                style={[Styles.button, Styles.centerPosition, Styles.element]}
                onPress={handleSubmit(onSendCode)}
              >
                <Text style={[Styles.greenText, Styles.disableButtonText]}>
                  Отправить код
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { marginTop: 44, marginBottom: 24 },
  form: { marginBottom: 24 },
  input: { marginBottom: 12 },
});
