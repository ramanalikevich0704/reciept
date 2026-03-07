import { Styles } from "@/components/login/LoginStyles";
import { StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type BackButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  backgroundColor?: string;
};

export function BackButton({
  onPress,
  style,
  iconColor = "white",
  backgroundColor,
}: BackButtonProps) {
  return (
    <TouchableOpacity
      style={[
        Styles.fieldForm,
        {
          width: 40,
          height: 40,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        },
        backgroundColor !== undefined && { backgroundColor },
        style,
      ]}
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.7}
    >
      <Icon name="chevron-back" size={28} color={iconColor} />
    </TouchableOpacity>
  );
}
