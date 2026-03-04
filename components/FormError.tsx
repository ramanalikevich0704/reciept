import { Styles } from "@/components/login/LoginStyles";
import { Text, TextStyle } from "react-native";

type FormErrorProps = {
  /** Текст ошибки валидации. Если пусто или undefined — компонент ничего не рендерит */
  message?: string | null;
  style?: TextStyle;
};

export function FormError({ message, style }: FormErrorProps) {
  if (!message) return null;
  return <Text style={[Styles.errorText, style]}>{message}</Text>;
}
