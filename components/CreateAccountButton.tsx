import { Styles } from "@/components/styles/LoginStyles";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface CreateAccountButtonProps {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const DEFAULT_LABEL = "Create an account";

export function CreateAccountButton({
  onPress,
  label = DEFAULT_LABEL,
  style,
  textStyle,
}: CreateAccountButtonProps) {
  return (
    <TouchableOpacity
      style={[
        Styles.centerPosition,
        Styles.element,
        Styles.registerButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          Styles.mediumCustomText,
          Styles.boldCustomText,
          Styles.whiteText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
