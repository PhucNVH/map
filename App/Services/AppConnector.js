import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppContext} from './../Context/AppContext';
import SplashScreen from './../Screens/SplashScreen/SplashScreen';
import Login from './../Screens/Login/Login';
import Intro from './../Screens/Intro/Intro';
import NavBar from './../Components/NavBar';
import {View} from 'react-native';
const Stack = createStackNavigator();
export default class AppConnector extends React.Component {
  static contextType = AppContext;

  componentDidMount() {
    this.setLoaded = setTimeout(() => this.context.setLoaded(true), 1000);
  }

  componentWillUnmount() {
    this.setLoaded && clearTimeout(this.setLoaded);
    this.login && clearTimeout(this.login);
    this.error && clearTimeout(this.error);
  }

  render() {
    if (!this.context.loaded) {
      return <SplashScreen />;
    } else if (!this.context.loggedIn) {
      return <Login />;
    } else if (this.context.newUser) {
      // return <Intro />;
    }
    return (
      <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    );
  }
}
