import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Button from './../../Components/Button';
import {AppContext} from '../../Context/AppContext';
import auth from '@react-native-firebase/auth';

export default class Home extends React.Component {
  static contextType = AppContext;
  logOut() {
    auth()
      .signOut()
      .then(() => {
        this.context.setLoggedIn(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  render() {
    return (
      <View>
        <Button
          label="Log out"
          onPress={() => {
            this.logOut();
          }}
        />
      </View>
    );
  }
}
