import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';

export async function googleSignIn() {
  
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const signInResult = await GoogleSignin.signIn();

  var idToken = signInResult.data?.idToken;
  if (!idToken) {
    throw new Error('No ID token found');
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);

  return signInWithCredential(getAuth(), googleCredential);
}