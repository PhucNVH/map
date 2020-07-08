import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {AppContext} from '../../Context/AppContext';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Heatmap,
  Polyline,
} from 'react-native-maps';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';

import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {getDistance} from 'geolib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class Home extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.user = auth().currentUser;
    this.state = {
      showLine: false,
      endLine: {},
      heatPoints: [],
      phoneSize: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      initialPosition: {
        latitude: 7,
        longitude: 107,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      delta: {
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      latestGPS: {
        latitude: 7,
        longitude: 107,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      marker: {
        location: {latitude: 7, longitude: 107},
        time: 0,
      },
      listFriends: [],
      listEnemies: [],
    };
  }

  componentDidUpdate(prevProps) {}
  componentDidMount() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
      } else {
        this.dropDownAlertRef.alertWithType('error', 'Error', 'No Network');
      }
    });
    const reference = database().ref('/GPS/latest');
    const areaCollection = firestore().collection('area');
    areaCollection.get().then((snapshot) => {
      let res = snapshot.docs.map((e) => e.data());
      res = res.map((e) => ({
        center: {latitude: e['latitude'], longitude: e['longitude']},
        type: e['type'],
        weight: e['weight'],
      }));
      this.setState({heatPoints: res});
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('dsdsd');
      const connectionCollection = firestore()
        .collection('ship')
        .doc(this.user.uid)
        .collection('friends');
      connectionCollection.get().then(async (snapshot) => {
        const x = Promise.all(
          snapshot.docs.map((doc) => {
            const ship = doc.data();
            return ship.ref.get();
          }),
        );
        x.then((e) => {
          let ships = e.map((i) => i.data());
          ships = ships.filter((i) => i != undefined);
          this.setState({listFriends: ships});
        });
      });
      const enemiesCollection = firestore()
        .collection('ship')
        .doc(this.user.uid)
        .collection('enemies');
      enemiesCollection.get().then(async (snapshot) => {
        const x = Promise.all(
          snapshot.docs.map((doc) => {
            const ship = doc.data();
            return ship.ref.get();
          }),
        );
        x.then((e) => {
          let enemies = e.map((i) => i.data());
          enemies = enemies.filter((i) => i != undefined);
          this.setState({listEnemies: enemies});
        });
      });
    });

    reference.once('value').then((snapshot) => {
      this.setState({
        region: {
          latitude: snapshot.val().location.lat,
          longitude: snapshot.val().location.long,
          latitudeDelta: 2,
          longitudeDelta: 2,
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
          location: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
          },
          title: 'abc',
        },
      });
    });
  }
  componentWillUnMount() {
    this._unsubscribe();
  }
  handleLocating() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
      } else {
        this.dropDownAlertRef.alertWithType(
          'error',
          'Error',
          'No Network',
          {},
          4000,
        );
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
            latitudeDelta: 2,
            longitudeDelta: 2,
          },
          latestGPS: {
            latitude: snapshot.val().location.lat,
            longitude: snapshot.val().location.long,
            latitudeDelta: 2,
            longitudeDelta: 2,
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
        this.dropDownAlertRef.alertWithType(
          'info',
          'Current Position',
          `Lat: ${snapshot.val().location.lat},Long: ${
            snapshot.val().location.long
          } at ${new Date(snapshot.val().time).toString()}`,
          {},
          4000,
        );
        this.setState({
          marker: {
            location: {
              latitude: snapshot.val().location.lat,
              longitude: snapshot.val().location.long,
            },
            time: snapshot.val().time,
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
  drawPolyline = (e) => {
    const distance =
      getDistance(this.state.marker.location, e.nativeEvent.coordinate) / 1000;
    this.dropDownAlertRef.alertWithType(
      'info',
      'Distance',
      `${distance} kilometers`,
      {},
      3000,
    );
    this.setState({showLine: true, endLine: e.nativeEvent.coordinate});
  };

  closePolyline = (e) => {
    this.setState({showLine: false});
  };
  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert
          ref={(ref) => (this.dropDownAlertRef = ref)}
          closeInterval={0}
        />
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
            coordinate={this.state.marker.location}
            anchor={{x: 0.5, y: 0.5}}
            title={`${this.state.marker.location.latitude}, ${this.state.marker.location.longitude}`}
            description={`At: ${new Date(
              this.state.marker.time,
            ).toLocaleString()}`}
            image={{uri: this.user.photoURL}}
          />
          {this.state.showLine && (
            <Polyline
              coordinates={[this.state.marker.location, this.state.endLine]}
              strokeWidth={3}
              strokeColor="#283747"
              tappable={true}
              onPress={this.closePolyline}
            />
          )}
          {this.state.heatPoints.length > 0 &&
            this.state.heatPoints.map((e, i) => {
              return (
                <View key={i}>
                  <Circle center={e.center} radius={e.weight * 10000} />
                  <Marker
                    onCalloutPress={this.drawPolyline}
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={e.center}
                    title={e.type}
                    description={`Lat: ${e.center.latitude}, Long: ${e.center.longitude}`}
                    image={
                      e.type === 'Fish'
                        ? require('../../Assets/Images/Fish.png')
                        : require('../../Assets/Images/Storm.png')
                    }
                  />
                </View>
              );
            })}

          {this.state.listFriends.length > 0 &&
            this.state.listFriends.map((e, i) => {
              return (
                <Marker
                  key={i}
                  onCalloutPress={this.drawPolyline}
                  anchor={{x: 0.5, y: 0.5}}
                  coordinate={{
                    latitude: e.location._latitude,
                    longitude: e.location._longitude,
                  }}
                  title={`Friend: ${e.displayName}`}
                  description={`Lat: ${e.location.latitude}, Long: ${e.location.longitude}`}
                  image={{uri: e.avatar}}
                />
              );
            })}
          {this.state.listEnemies.length > 0 &&
            this.state.listEnemies.map((e, i) => {
              return (
                <Marker
                  key={i}
                  onCalloutPress={this.drawPolyline}
                  anchor={{x: 0.5, y: 0.5}}
                  coordinate={{
                    latitude: e.location._latitude,
                    longitude: e.location._longitude,
                  }}
                  title={`Enemy: ${e.displayName}`}
                  description={`Lat: ${e.location.latitude}, Long: ${e.location.longitude}`}
                  image={require('../../Assets/Images/skull.png')}
                />
              );
            })}
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
