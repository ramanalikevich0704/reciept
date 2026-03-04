/**
 * Граф навигации: экраны и допустимые переходы по событиям.
 * Направление навигации задаётся одним местом.
 */

export const SCREENS = {
  LOGIN: "/(auth)/login",
  REGISTER: "/(auth)/register",
  PHONE_INPUT: "/(auth)/phone-input",
  SMS_CODE: "/(auth)/sms-code",
  PROFILE: "/(profile)/profile",
  MAIN: "/(main)/main",
} as const;

export type ScreenId = keyof typeof SCREENS;

export type NavEvent =
  | "BACK"
  | "AUTH_OK_FULL"
  | "AUTH_OK_NEED_PROFILE"
  | "DONE"
  | "LOGOUT";

/** Откуда куда можно перейти (по событию) */
export const ALLOWED_TRANSITIONS: Record<
  ScreenId,
  Partial<Record<NavEvent, ScreenId>>
> = {
  LOGIN: {
    REGISTER: "REGISTER",
    AUTH_OK_FULL: "MAIN",
    AUTH_OK_NEED_PROFILE: "PROFILE",
  },
  REGISTER: {
    BACK: "LOGIN",
    AUTH_OK_FULL: "MAIN",
    AUTH_OK_NEED_PROFILE: "PROFILE",
  },
  PHONE_INPUT: { BACK: "LOGIN" },
  SMS_CODE: {
    BACK: "LOGIN",
    AUTH_OK_FULL: "MAIN",
    AUTH_OK_NEED_PROFILE: "PROFILE",
  },
  PROFILE: { DONE: "MAIN" },
  MAIN: { LOGOUT: "LOGIN" },
};

/** По текущему path возвращает идентификатор экрана или null */
export function pathToScreenId(path: string): ScreenId | null {
  if (path.includes("sms-code")) return "SMS_CODE";
  if (path.includes("phone-input")) return "PHONE_INPUT";
  if (path.includes("register")) return "REGISTER";
  if (path.includes("login")) return "LOGIN";
  if (path.includes("profile")) return "PROFILE";
  if (path.includes("main")) return "MAIN";
  return null;
}

/** Определяет событие навигации по текущему экрану, пользователю и полноте профиля */
export function getNavigationEvent(
  currentScreen: ScreenId,
  user: { email?: string | null; phoneNumber?: string | null } | null,
  isProfileFull: boolean
): NavEvent | null {
  const hasUser = !!(user?.email ?? user?.phoneNumber);

  if (!hasUser && (currentScreen === "MAIN" || currentScreen === "PROFILE")) {
    return "LOGOUT";
  }
  const onAuthScreen =
    currentScreen === "LOGIN" ||
    currentScreen === "REGISTER" ||
    currentScreen === "SMS_CODE";
  if (hasUser && onAuthScreen && isProfileFull) {
    return "AUTH_OK_FULL";
  }
  if (hasUser && onAuthScreen && !isProfileFull) {
    return "AUTH_OK_NEED_PROFILE";
  }
  if (hasUser && currentScreen === "PROFILE" && isProfileFull) {
    return "DONE";
  }
  return null;
}
