import { auth } from "@/src/auth/services/firebase/FirebaseConfiguration";

const logoutUser = async (): Promise<void> => {
    await auth.signOut();
}

export default { logoutUser };