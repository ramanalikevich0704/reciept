import { fieldStyle, Styles } from "@/components/styles/LoginStyles";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { Text, TextInput, View } from "react-native";

export interface FormFieldProps<TFormValues extends FieldValues>
  extends Pick<
    TextInputProps,
    "keyboardType" | "autoCapitalize" | "secureTextEntry" | "maxLength"
  > {
  /** Контрол формы из useForm */
  control: Control<TFormValues>;
  /** Имя поля (ключ в форме) */
  name: FieldPath<TFormValues>;
  /** Плейсхолдер */
  placeholder: string;
  /** Преобразование ввода перед записью в форму (например, маска телефона) */
  transform?: (text: string) => string;
  /** Дополнительные стили поля ввода */
  style?: StyleProp<TextStyle>;
  /** Текст ошибки валидации. Если пусто или undefined — блок ошибки не рендерится */
  error?: string | null;
  /** Стиль текста ошибки */
  errorStyle?: StyleProp<TextStyle>;
}

export function FormField<TFormValues extends FieldValues>({
  control,
  name,
  placeholder,
  transform,
  style,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  maxLength,
  error,
  errorStyle,
}: FormFieldProps<TFormValues>) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[fieldStyle, Styles.input, style]}
            placeholder={placeholder}
            placeholderTextColor={Styles.whiteText.color}
            onBlur={onBlur}
            onChangeText={(text) => onChange(transform ? transform(text) : text)}
            value={value}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
          />
        )}
      />
      {error ? (
        <Text style={[Styles.errorText, errorStyle]}>{error}</Text>
      ) : null}
    </View>
  );
}
