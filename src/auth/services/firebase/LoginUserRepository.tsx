import { auth } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { useAuthStore } from "../../store/useAuthStore";

const signInUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    // 1. Создаем пользователя в Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = getToken().then((token) => {
      if (token) {
        useAuthStore.getState().login(token);
      } else {
        useAuthStore.getState().logout();
      }
    });
    console.log("Пользователь залогинен и данные сохранены!");

    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при регистрации:", error.message);
    }
  }
  return null;
};

const getToken = async () => {
  const user = auth.currentUser;
  if (user) {
    // forceRefresh: true заставит Firebase выпустить новый токен прямо сейчас
    const token = await user.getIdToken(false);
    return token;
  }
  return null;
};

export default { signInUser };
