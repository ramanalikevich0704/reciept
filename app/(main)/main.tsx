import { Styles } from "@/components/login/LoginStyles";
import { useAuth } from "@/src/auth/services/AuthService";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainView() {
  const { AuthService } = useAuth();

  const onSubmit = () => {
    AuthService.logout()
  };

  return (
    <SafeAreaView style={{ backgroundColor: "red", flex: 1 }}>
      <TouchableOpacity
        style={[
          Styles.button,
          Styles.centerPosition,
          Styles.element,
          Styles.centerPosition
        ]}
        onPress={onSubmit}
      >
        <Text style={[Styles.greenText]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
