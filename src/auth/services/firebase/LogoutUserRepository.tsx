import { authInstance } from "@/src/auth/services/firebase/FirebaseConfiguration";

const logoutUser = async (): Promise<void> => {
  await authInstance.signOut();
};

export default { logoutUser };
