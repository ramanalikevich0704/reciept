import { Styles } from "@/components/login/LoginStyles";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView() {

  return (
    <SafeAreaView style={{ backgroundColor: "blue", flex: 1 }}>
      <Text style={[Styles.greenText]}>Profile</Text>
    </SafeAreaView>
  );
}
