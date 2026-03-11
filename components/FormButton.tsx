import { Styles } from "@/components/styles/LoginStyles";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface FormButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function FormButton({
  label,
  onPress,
  disabled = false,
  style,
  textStyle,
}: FormButtonProps) {
  const containerStyle: StyleProp<ViewStyle>[] = [
    Styles.button,
    Styles.centerPosition,
    Styles.element,
  ];
  if (disabled) {
    containerStyle.push(Styles.buttonDisabled);
  }
  if (style) {
    containerStyle.push(style);
  }

  const textStyleResolved: StyleProp<TextStyle>[] = [
    Styles.greenText,
    !disabled && Styles.disableButtonText,
  ].filter(Boolean) as StyleProp<TextStyle>[];
  if (textStyle) {
    textStyleResolved.push(textStyle);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyleResolved}>{label}</Text>
    </TouchableOpacity>
  );
}
