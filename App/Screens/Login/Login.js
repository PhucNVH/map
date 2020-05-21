import React, {useState, useContext} from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Styles from './LoginStyle';
import {AppContext} from './../../Context/AppContext';
import Button from './../../Components/Button';
import strings from '../../Themes/Strings';
import colors from '../../Themes/Colors';
import imageLogo from '../../Assets/Images/logo.png';
import FormTextInput from './../../Components/FormTextInput';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '509525541033-e554cv3thb8a4qvl8pn5ducb15l9cuav.apps.googleusercontent.com',
});

function Login() {
  const context = useContext(AppContext);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(Email, Password)
      .then(() => {
        console.log('User account created & signed in!');
        context.setLoggedIn(true);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        context.setLoggedIn(false);
        console.error(error);
      });
  };

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    auth()
      .signInWithCredential(googleCredential)
      .then(({user}) => {
        console.log(user.toJSON());
        context.setLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);
        context.setLoggedIn(false);
      });
  };
  return (
    <View style={styles.container}>
      <Image source={imageLogo} style={styles.logo} />

      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          value={Email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          placeholder={strings.EMAIL_PLACEHOLDER}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          value={Password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
          placeholder={strings.PASSWORD_PLACEHOLDER}
        />
        <Button
          label={strings.LOGIN_SCREEN}
          onPress={() => {
            handleLogin();
          }}
        />
        <Button
          label={'Google Sign-In'}
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
});

export default Login;
