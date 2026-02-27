import { RUser } from "@/src/auth/models/RUser";
import { authInstance } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const signUpUser = async (newUser: RUser, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    authInstance,
    newUser.email,
    password,
  );
  const user = userCredential.user;

  await firestore().collection("users").doc(user.uid).set({
    email: newUser.email,
    password: password, // Внимание: хранить пароли в БД в открытом виде небезопасно!
    name: newUser.firstName,
    surname: newUser.surname,
    phoneNumber: newUser.phoneNumber,
  });

  console.log("Пользователь зарегистрирован и данные сохранены!");
};

export default { signUpUser };
