import { PLACEHOLDERS } from "@/constants/constants";
import type { Control, FieldErrors, FieldPath, FieldValues, UseFormWatch } from "react-hook-form";
import type { KeyboardTypeOptions } from "react-native";
import type { StyleProp, TextStyle } from "react-native";
import { formatPhoneMask, SMS_CODE_LENGTH } from "@/app/(auth)/static/static";
import { FormField } from "@/components/FormField";
import React from "react";

/** Тип поля формы (ключ в наборе конфигов) */
export enum FieldType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  CONFIRM_PASSWORD = "CONFIRM_PASSWORD",
  NAME = "NAME",
  SURNAME = "SURNAME",
  PHONE = "PHONE",
  SMS_CODE = "SMS_CODE",
}

/** Настройки поля, необходимые для Controller / FormField (без control и error) */
export interface FormFieldConfig {
  /** Имя поля в форме */
  name: string;
  /** Плейсхолдер */
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  /** Преобразование ввода (например, маска телефона) */
  transform?: (text: string) => string;
  maxLength?: number;
}

/** Множество конфигов: ключ — тип поля, значение — настройки для FormField */
export const FIELD_CONFIG: Record<FieldType, FormFieldConfig> = {
  [FieldType.EMAIL]: {
    name: "email",
    placeholder: PLACEHOLDERS.EMAIL,
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  [FieldType.PASSWORD]: {
    name: "password",
    placeholder: PLACEHOLDERS.PASSWORD,
    secureTextEntry: true,
  },
  [FieldType.CONFIRM_PASSWORD]: {
    name: "confirmPassword",
    placeholder: PLACEHOLDERS.CONFIRM_PASSWORD,
    secureTextEntry: true,
  },
  [FieldType.NAME]: {
    name: "name",
    placeholder: PLACEHOLDERS.NAME,
    autoCapitalize: "words",
  },
  [FieldType.SURNAME]: {
    name: "surname",
    placeholder: PLACEHOLDERS.SURNAME,
    autoCapitalize: "words",
  },
  [FieldType.PHONE]: {
    name: "phonenumber",
    placeholder: PLACEHOLDERS.PHONE,
    keyboardType: "phone-pad",
    maxLength: 19,
    transform: formatPhoneMask,
  },
  [FieldType.SMS_CODE]: {
    name: "code",
    placeholder: PLACEHOLDERS.SMS_CODE,
    keyboardType: "number-pad",
    maxLength: SMS_CODE_LENGTH,
  },
};

export interface CreateFormFieldsOptions<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  /** Подстановка плейсхолдеров по типу поля (например, EMAIL_RU вместо EMAIL) */
  placeholderOverrides?: Partial<Record<FieldType, string>>;
  /** Доп. стили поля ввода по типу поля */
  styleOverrides?: Partial<Record<FieldType, StyleProp<TextStyle>>>;
}

/**
 * Фабрика: по списку типов полей создаёт нужное количество FormField с настройками из FIELD_CONFIG.
 * Ошибка показывается только когда поле не пустое (по watch).
 */
export function createFormFields<TFormValues extends FieldValues>(
  fieldTypes: FieldType[],
  options: CreateFormFieldsOptions<TFormValues>,
): React.ReactNode[] {
  const { control, errors, watch, placeholderOverrides, styleOverrides } = options;

  return fieldTypes.map((type) => {
    const config = FIELD_CONFIG[type];
    const placeholder = placeholderOverrides?.[type] ?? config.placeholder;
    const style = styleOverrides?.[type];
    const name = config.name as FieldPath<TFormValues>;
    const value = watch(name);
    const errorMessage =
      String(value ?? "").trim() !== "" ? errors[name]?.message : undefined;

    return (
      <FormField<TFormValues>
        key={type}
        control={control}
        name={name}
        placeholder={placeholder}
        keyboardType={config.keyboardType}
        autoCapitalize={config.autoCapitalize}
        secureTextEntry={config.secureTextEntry}
        transform={config.transform}
        maxLength={config.maxLength}
        error={errorMessage}
        style={style}
      />
    );
  });
}
