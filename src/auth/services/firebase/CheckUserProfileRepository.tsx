import firestore from "@react-native-firebase/firestore";

const checkUserProfile = async (
  uid: string | undefined,
): Promise<boolean | null> => {
  if (!uid) return false;
  const user = await firestore().collection("users").doc(uid).get();

  if (!user.exists()) return false;

  const userData = user.data();

  return (
    userData?.email &&
    userData?.name &&
    userData?.surname &&
    userData?.phoneNumber
  );
};

export default { checkUserProfile };
