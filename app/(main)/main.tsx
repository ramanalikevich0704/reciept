import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainView() {
    return (<SafeAreaView style={{backgroundColor: 'red', flex: 1}}>
        <Text>MAIN</Text>
    </SafeAreaView>)
}