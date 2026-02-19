import { Styles } from "@/components/login/LoginStyles";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainView() {
  const logout = useAuthStore((state) => state.logout);

  const onSubmit = () => {
    logout();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "red", flex: 1 }}>
      <TouchableOpacity
        style={[
          Styles.button,
          Styles.centerPosition,
          Styles.element,
          Styles.centerPosition,
          Styles.element,
        ]}
        onPress={onSubmit}
      >
        <Text style={[Styles.greenText]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
