import React,{useState} from 'react';
import {Text, View, TouchableOpacity,StyleSheet,Image} from 'react-native';
import Styles from './LoginStyle';
import {AppContext} from './../../Context/AppContext';
import Button from './../../Components/Button'
import strings from '../../Themes/Strings'
import colors from '../../Themes/Colors'
import imageLogo from '../../Assets/Images/logo.png'
import { TextInput } from 'react-native-gesture-handler';
import FormTextInput from './../../Components/FormTextInput'
function handleLogin(text){
  console.log(text);
}

function Login(){
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  return (
    <View style={styles.container}>
      <Image source={imageLogo} style={styles.logo}></Image>
      
      <View style={styles.form}>
        <TextInput style={styles.textInput}
          value={Email}
          onChangeText={(text) => setEmail(text)}
          placeholder={strings.EMAIL_PLACEHOLDER}
        />
        <TextInput style={styles.textInput}
        value={Password}
        onChangeText={(text) =>  setPassword(text)}
        placeholder = {strings.PASSWORD_PLACEHOLDER}
        />
        <Button label={strings.LOGIN_SCREEN} onPress={handleLogin(Email)} ></Button>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.WHITE,
    alignItems:"center",
    justifyContent:"space-between"
  },
  logo:{
    flex:1,
    width:"100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form:{
    flex:1,
    justifyContent:"center",
    width:"80%"
  },
  textInput:{
    height:40,
        borderColor: colors.SILVER,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom:20
  }

});

export default Login
