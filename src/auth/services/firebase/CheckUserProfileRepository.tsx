import { getFirestore, doc, getDoc } from "firebase/firestore";

const checkUserProfile = async (uid: string | undefined)
: Promise<boolean | null> => {
  if (!uid) return null;
  const db = getFirestore();
  const userScheme = doc(db, "users", uid);
  const user = await getDoc(userScheme);

  if (!user.exists()) return null

  const userData = user.data();

  return (
    userData?.email &&
    userData?.name &&
    userData?.surname &&
    userData?.phoneNumber
  );
};

export default { checkUserProfile };