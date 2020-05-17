import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Styles from './LoginStyle';
import {AppContext} from './../../Context/AppContext';
export default class Login extends React.Component {
  static contextType = AppContext;
  render() {
    return (
      <View>
        <Text>Login Screen</Text>
        <TouchableOpacity
          onPress={() => {
            this.context.setLoggedIn(true);
          }}>
          <Text>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log(this.context);
          }}>
          <Text>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
