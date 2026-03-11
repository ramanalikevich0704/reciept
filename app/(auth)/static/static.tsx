
export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+${digits}`;
  if (!digits.startsWith("375")) return `+${digits}`;
  const rest = digits.slice(3, 12);
  let out = "+375";
  if (rest.length >= 1) out += ` (${rest.slice(0, 2)})`;
  if (rest.length >= 3) out += ` ${rest.slice(2, 5)}`;
  if (rest.length >= 5) out += `-${rest.slice(5, 7)}`;
  if (rest.length >= 7) out += `-${rest.slice(7, 9)}`;
  return out;
}

export const SMS_CODE_LENGTH = 6;
export const PHONE_REGEX = /^\+375\s*\(\d{2}\)\s*\d{3}-\d{2}-\d{2}$/;