import { authInstance } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { signInWithEmailAndPassword, FirebaseAuthTypes } from "@react-native-firebase/auth";

const signInUser = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User | null> => {
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password,
    );
    console.log("Пользователь залогинен и данные сохранены!");

    return userCredential.user;
};

export const getToken = async () => {
  const user = authInstance.currentUser;
  if (user) {
    // forceRefresh: true заставит Firebase выпустить новый токен прямо сейчас
    const token = await user.getIdToken(false);
    return token;
  }
  return null;
};

export default { signInUser };
