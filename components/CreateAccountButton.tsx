import { Styles } from "@/components/styles/LoginStyles";
import { LABELS } from "@/constants/constants";
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

export function CreateAccountButton({
  onPress,
  label = LABELS.CREATE_ACCOUNT,
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
