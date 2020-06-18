import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {AppContext} from '../../Context/AppContext';
import auth from '@react-native-firebase/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';

import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
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
        latitude: 10.7750034,
        longitude: 106.6580963,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      initialPosition: {
        latitude: 10.7750034,
        longitude: 106.6580963,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      delta: {
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      latestGPS: {
        latitude: 10.7750034,
        longitude: 106.6580963,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      marker: {
        latlng: {latitude: 10.7750034, longitude: 106.6580963},
        title: 'aBC',
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
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
      } else {
        this.dropDownAlertRef.alertWithType('error', 'Error', 'No Network');
      }
    });
    const reference = database().ref('/GPS/latest');
    reference.once('value').then((snapshot) => {
      this.setState({
        region: {
          latitude: snapshot.val().location.lat,
          longitude: snapshot.val().location.long,

          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
      });
      this.map.animateCamera(
        {
          center: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
          },
        },
        1000,
      );
      this.setState({
        marker: {
          latlng: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
          },
          title: 'abc',
        },
      });
    });

    // Geolocation.getCurrentPosition((info) => {
    //   this.state.currentLocation = {
    //     latitude: info.coords.latitude,
    //     longitude: info.coords.longitude,
    //   };
    // });
  }
  handleLocating() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
      } else {
        this.dropDownAlertRef.alertWithType('error', 'Error', 'No Network');
      }
    });
    const reference = database().ref('/GPS/latest');
    reference
      .once('value')
      .then((snapshot) => {
        this.setState({
          region: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          latestGPS: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
        });
        this.map.animateCamera(
          {
            center: {
              latitude: snapshot.val().location.lat,
              longitude: snapshot.val().location.long,
            },
          },
          1000,
        );
        this.setState({
          marker: {
            latlng: {
              latitude: snapshot.val().location.lat,
              longitude: snapshot.val().location.long,
            },
            title: 'abc',
          },
        });
      })
      .catch((err) => {
        console.log(err);
        this.map.animateCamera(
          {
            center: {
              latitude: this.state.latestGPS.location.latitude,
              longitude: this.state.latestGPS.location.longitude,
            },
          },
          500,
        );
      });
  }
  onRegionChange(region) {
    this.setState({region});
  }
  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          annotations={this.state.currentMarker}
          initialRegion={this.state.currentRegion}
          region={this.state.currentLocation}
          onRegionChange={(region) => {
            this.onRegionChange(region);
          }}>
          <Marker
            coordinate={this.state.marker.latlng}
            title={this.state.marker.title}
          />
        </MapView>

        <TouchableOpacity
          title={'dsadk'}
          style={styles.locatingButton}
          onPress={() => {
            this.handleLocating();
          }}>
          <View style={styles.buttonContainer}>
            <Icon
              style={styles.icon}
              name="map-marker"
              size={30}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  locatingButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 11,
  },
  icon: {},
});
