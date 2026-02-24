import { auth } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { signInWithEmailAndPassword, User } from "firebase/auth";

const signInUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("Пользователь залогинен и данные сохранены!");

    return userCredential.user;
};

export const getToken = async () => {
  const user = auth.currentUser;
  if (user) {
    // forceRefresh: true заставит Firebase выпустить новый токен прямо сейчас
    const token = await user.getIdToken(false);
    return token;
  }
  return null;
};

export default { signInUser };
