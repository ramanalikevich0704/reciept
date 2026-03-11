/**
 * Строковые константы приложения.
 * Группы: плейсхолдеры, подписи (кнопки/меню/заголовки), свободный текст по экранам.
 */

// ─── Placeholders (поля ввода) ─────────────────────────────────────────────
export const PLACEHOLDERS = {
  EMAIL: "Enter email",
  EMAIL_RU: "Введите email",
  PASSWORD: "Enter password",
  PASSWORD_RU: "Введите пароль",
  CONFIRM_PASSWORD: "Подтвердите пароль",
  NAME: "Введите имя",
  SURNAME: "Введите фамилию",
  PHONE: "+375 (44) 516-80-98",
  SMS_CODE: "123456",
  SEARCH_RECIPE: "What recipe are you looking for?",
  SEARCH_LIST: "Поиск по списку...",
} as const;

// ─── Labels (кнопки, пункты меню, заголовки секций) ───────────────────────
export const LABELS = {
  LOGIN: "Login",
  CREATE_ACCOUNT: "Create an account",
  REGISTER: "Зарегистрироваться",
  CONFIRM: "Подтвердить",
  SEND_CODE: "Отправить код",
  SAVE: "Сохранить",
  BACK: "Назад",
  MENU_RECIPES: "Рецепты",
  MENU_POPULAR: "Популярные",
  RECIPE_BY: "Recipe by",
  SECTION_ABOUT: "About",
  SECTION_INGREDIENTS: "Ingredients",
  SECTION_INSTRUCTIONS: "Instructions",
} as const;

// ─── Свободный текст по экранам ────────────────────────────────────────────

export const LOGIN_TEXT = {
  WELCOME: "Welcome to",
  APP_NAME: "Recipe Book",
  LOGIN_WITH: "Login with",
  OR: "or",
} as const;

export const REGISTER_TEXT = {
  HEADER: "Create account",
  APP_NAME: "Recipe Book",
  HAVE_ACCOUNT: "Уже есть аккаунт? Войти",
} as const;

export const SMS_CODE_TEXT = {
  HEADER: "Введите код из SMS",
  APP_NAME: "Recipe Book",
  NO_VERIFICATION: "Нет данных верификации. Вернитесь и отправьте код снова.",
} as const;

export const PHONE_INPUT_TEXT = {
  HEADER: "Вход по номеру телефона",
  APP_NAME: "Recipe Book",
} as const;

export const PROFILE_TEXT = {
  HEADER: "Профиль",
  APP_NAME: "Recipe Book",
} as const;

export const MAIN_TEXT = {
  GREETING: "Привет,",
  GUEST: "Гость",
} as const;

export const RECIEPT_LIST_TEXT = {
  TITLE_POPULAR: "Популярные рецепты",
  TITLE_SEARCH: "Search by Recipe",
  COUNT_RECIPES: (from: number, total: number) => `${from} из ${total} рецептов`,
  FOUND: (total: number) => `${total} Recipes found`,
  EMPTY_FAVORITES: "Нет избранных рецептов. Добавьте их в деталях рецепта.",
  EMPTY_SEARCH: "Ничего не найдено по запросу",
  LOADING_FAVORITES: "Загрузка избранного...",
} as const;

export const RECIPE_DETAIL_TEXT = {
  LOADING: "Loading recipe...",
  NOT_FOUND: "Recipe not found",
  INVALID_ID: "Invalid recipe id",
  LOAD_FAILED: "Failed to load recipe",
} as const;
