import { RUser } from "@/src/auth/models/RUser";
import { auth, db } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const signUpUser = async (newUser: RUser, password: string) => {
  try {
    // 1. Создаем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      password,
    );
    const user = userCredential.user;

    // 2. Добавляем данные в Firestore, используя user.uid как ID документа
    await setDoc(doc(db, "users", user.uid), {
      email: newUser.email,
      password: password,
      name: newUser.firstName,
      surname: newUser.surname,
      phoneNumber: newUser.phoneNumber,
    });

    console.log("Пользователь зарегистрирован и данные сохранены!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при регистрации:", error.message);
    }
  }
};

export default { signUpUser };
