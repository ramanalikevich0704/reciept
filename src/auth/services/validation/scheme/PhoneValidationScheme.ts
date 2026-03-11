import { getPhoneNumberRules } from "@/app/(auth)/static/static-regex";
import * as yup from "yup";

export interface PhoneForm {
  phonenumber: string;
}

export const phoneSchema = yup.object({
  phonenumber: getPhoneNumberRules(),
});
