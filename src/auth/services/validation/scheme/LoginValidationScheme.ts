import {
  getEmailRules,
  getPasswordRules,
} from "@/app/(auth)/static/static-regex";
import * as yup from "yup";

export interface LoginForm {
  email: string;
  password: string;
}

export const loginSchema = yup.object({
  email: getEmailRules(),
  password: getPasswordRules(),
});
