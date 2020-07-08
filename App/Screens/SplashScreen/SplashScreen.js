import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import styles from './SplashScreenStyle';
import {Helpers} from './../../Themes';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={[Helpers.fillRowCenter, styles.container]}>
        <View style={[Helpers.center, styles.logoContainer]}>
          <Image
            source={require('../../Assets/Images/cargo-ship.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.text}>3P1N</Text>
        </View>
      </View>
    );
  }
}
