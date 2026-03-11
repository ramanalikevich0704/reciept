import {
  getEmailRules,
  getNameRules,
  getPhoneNumberRules,
  getSurnameRules,
} from "@/app/(auth)/static/static-regex";
import * as yup from "yup";

export interface ProfileForm {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
}

export const profileSchema = yup.object({
  email: getEmailRules(),
  name: getNameRules(),
  surname: getSurnameRules(),
  phonenumber: getPhoneNumberRules(),
});
