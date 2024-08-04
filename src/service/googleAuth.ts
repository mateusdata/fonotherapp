import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


export interface FormatUserGoogle {
    id: string;
    email: string;
    familyName: string;
    givenName: string;
    name: string;
    photo: string;
    accessToken: string; // Esse campo precisa estar presente aqui
}

export interface FormatUserInfo {
    user: FormatUserGoogle;
    idToken: string;
    accessToken: string;
    serverAuthCode?: string;
}

export const configureGoogleData = {
    webClientId: '864119244538-mu66i5a7boqoreq6j50cpdki1uol9tah.apps.googleusercontent.com',
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    iosClientId: '864119244538-3di8ur7li5egpo6k7pe24qscqtr1gm16.apps.googleusercontent.com' , // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
}
GoogleSignin.configure(configureGoogleData);


export const signInGoogle = async (setUserGoogle: (infoUser:any)=> (void)) => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      userInfo.user
      setUserGoogle(userInfo);
      console.log(userInfo.idToken);
      alert("Deu certo caralho")
      //sendTokenToBackend(userInfo.idToken)

    } catch (error: any) {
      console.log(error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log(error)
      }
    }
  };

  const isErrorWithCode = (error: any) => {
    return error && typeof error.code === 'string';
  };
