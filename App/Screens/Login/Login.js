import React, {useState, useContext} from 'react';
import {TextInput, View, Image, Text} from 'react-native';
import styles from './LoginStyle';
import {AppContext} from './../../Context/AppContext';
import strings from '../../Themes/Strings';
import imageLogo from '../../Assets/Images/cargo-ship.png';
import auth from '@react-native-firebase/auth';
import {Overlay, Button} from 'react-native-elements';
function Login() {
  const name = 'ShipTracker';
  const interval = 15 * 60 * 1000;
  const context = useContext(AppContext);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Show, setShow] = useState(false);
  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(Email, Password)
      .then((e) => {
        if (
          new Date(e.user.metadata.lastSignInTime) -
            new Date(e.user.metadata.creationTime) <
          interval
        ) {
          context.setNewUser(true);
        }
        // console.log('User account created & signed in!');
        context.setLoggedIn(true);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            console.log('check your email again');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            console.log('check your email or password');
            break;
        }
        context.setLoggedIn(false);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Overlay isVisible={Show} onBackdropPress={() => setShow(false)}>
        <View>
          <Text>Need help?</Text>
          <Text>
            Sorry, you can't create account in the app. We know that's a pain,
            but you need to have devices set up in your ship before being able
            to use the app.
          </Text>
        </View>
      </Overlay>
      <Image source={imageLogo} style={styles.logo} />
      <Text style={styles.brandName}>{name}</Text>
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
          title={strings.LOGIN_SCREEN}
          onPress={() => {
            handleLogin();
          }}
        />
      </View>
      <Button type="outline" title="Need help?" onPress={() => setShow(true)} />
    </View>
  );
}
export default Login;
