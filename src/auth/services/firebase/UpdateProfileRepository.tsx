import firestore from "@react-native-firebase/firestore";

export interface ProfileData {
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

const updateProfile = async (uid: string, data: ProfileData): Promise<void> => {
  await firestore().collection("users").doc(uid).set(
    {
      email: data.email,
      name: data.name,
      surname: data.surname,
      phoneNumber: data.phoneNumber,
    },
    { merge: true },
  );
};

export default { updateProfile };
