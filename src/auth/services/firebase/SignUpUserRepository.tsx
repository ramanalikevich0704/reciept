import { RUser } from "@/src/auth/models/RUser";
import { auth, db } from "@/src/auth/services/firebase/FirebaseConfiguration";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const signUpUser = async (newUser: RUser, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      password,
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: newUser.email,
      password: password,
      name: newUser.firstName,
      surname: newUser.surname,
      phoneNumber: newUser.phoneNumber,
    });

    console.log("Пользователь зарегистрирован и данные сохранены!");
};

export default { signUpUser };
