import React from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import Button from './../../Components/Button';
import {AppContext} from '../../Context/AppContext';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';
import {clockRunning} from 'react-native-reanimated';

export default class Home extends React.Component {
  static contextType = AppContext;
  constructor() {
    super();
    this.state = {
      phoneSize: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      currentRegion: {
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      defaultRegion: {
        latitude: 10.7750034,
        longitude: 106.6580963,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
    };
  }
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
  componentDidMount() {
    Geolocation.getCurrentPosition((info) => {
      this.state.currentLocation = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };
    });
  }
  handleLocating() {
    Geolocation.getCurrentPosition((info) => {
      this.state.currentLocation = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };
    });
  }
  onRegionChange(region) {
    console.log(region);
    this.state.currentRegion = region;
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{flex: 11}}
          initialRegion={this.state.defaultRegion}
          region={this.state.currentLocation}
          onChangeState={(region) => {
            this.onRegionChange(region);
          }}
        />

        <TouchableOpacity
          title={'dsadk'}
          style={{
            bottom: (this.state.phoneSize.height / 6) * 0.9,
            right: this.state.phoneSize.width * 0.08,
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: 'red',
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
          onPress={() => {
            this.handleLocating();
          }}
        />
        <View style={{flex: 1}}></View>
      </View>
    );
  }
}
