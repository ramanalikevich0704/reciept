import {
  getConfirmPasswordRules,
  getEmailRules,
  getNameRules,
  getPasswordRules,
  getPhoneNumberRules,
  getSurnameRules,
} from "@/app/(auth)/static/static-regex";
import * as yup from "yup";

export interface RegisterForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
  password: string;
  confirmPassword: string;
}

export const registerSchema = yup.object({
  email: getEmailRules(),
  name: getNameRules(),
  surname: getSurnameRules(),
  phonenumber: getPhoneNumberRules(),
  password: getPasswordRules(),
  confirmPassword: getConfirmPasswordRules(),
});
