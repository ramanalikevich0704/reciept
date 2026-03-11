import { getSmsRules } from "@/app/(auth)/static/static-regex";
import * as yup from "yup";

export interface SmsCodeForm {
  code: string;
}

export const smsCodeSchema = yup.object({
  code: getSmsRules(),
});
