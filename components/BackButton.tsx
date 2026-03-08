import { Styles } from "@/components/styles/LoginStyles";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  backgroundColor?: string;
  iconSize?: number;
}

const DEFAULT_ICON_COLOR = "white";
const DEFAULT_ICON_SIZE = 28;
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export function BackButton({
  onPress,
  style,
  iconColor = DEFAULT_ICON_COLOR,
  backgroundColor,
  iconSize = DEFAULT_ICON_SIZE,
}: BackButtonProps) {
  return (
    <TouchableOpacity
      style={[
        Styles.fieldForm,
        { borderRadius: 25 },
        backgroundColor !== undefined && { backgroundColor },
        style,
      ]}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      activeOpacity={0.7}
    >
      <Icon name="chevron-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
