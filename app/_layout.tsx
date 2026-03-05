import AuthRouter from "@/app/router/AuthRouter";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: '1017938105677-kakk78qp2ncvvlhlqpmpmojlhnpieh20.apps.googleusercontent.com'
});

export default function RootLayout() {
  return <AuthRouter />//add fabric for routers when add main
}
