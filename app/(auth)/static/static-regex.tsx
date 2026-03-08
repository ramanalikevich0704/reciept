import * as yup from "yup";
import { PHONE_REGEX, SMS_CODE_LENGTH } from "@/app/(auth)/static/static";

type SchemaInterface = yup.StringSchema<
  string | undefined,
  yup.AnyObject,
  undefined,
  ""
>;
export function getEmailRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .min(2, "Введите более двух символов")
    .matches(/[@]/, "Необходимо написать @")
    .matches(/[.]/, "Допишите почтовый домен")
    .email("Поле email не соответствует формату");
}

export function getPasswordRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .min(8, "Введите 8 и более символов в пароле")
    .matches(/(?=.*\d)/, "Введите хотя бы одну цифру")
    .matches(/(?=.*[A-Za-z])/, "Введите хотя бы одну букву")
    .matches(/[@$!%*?&)()]/, "Введите хотя бы один символ")
    .max(
      256,
      "Максимальное количество символов в пароле 256, уберите лишние символы",
    );
}

export function getConfirmPasswordRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Пароли не совпадают");
}

export function getNameRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .min(1, "Поле является обязательным, нужно ввести данные")
    .max(256, "Максимально доступная длинная 256 символов")
    .matches(
      /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
      "Имя может содержать только буквы, пробелы и дефис",
    );
}

export function getSurnameRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .min(1, "Поле является обязательным, нужно ввести данные")
    .max(256, "Максимально доступная длинная 256 символов")
    .matches(
      /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
      "Фамилия может содержать только буквы, пробелы и дефис",
    );
}

export function getPhoneNumberRules(): SchemaInterface {
  return yup
    .string()
    .required()
    .matches(PHONE_REGEX, "Введите номер в формате +375 (XX) XXX-XX-XX");
}

export function getSmsRules(): SchemaInterface {
    return yup
        .string()
        .required()
        .length(SMS_CODE_LENGTH, `Введите ${SMS_CODE_LENGTH} цифр`)
        .matches(/^\d+$/, "Только цифры")
}