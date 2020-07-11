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
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Heatmap,
} from 'react-native-maps';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {getDistance, convertSpeed, timeConversion} from 'geolib';
import firestore from '@react-native-firebase/firestore';
import {Polyline} from 'react-native-maps';

export default class Map extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.uid = auth().currentUser.uid;
    this.state = {
      speed: 0,
      distance: 0,
      showLine: false,
      listPoints: [],
      warningPoints: [],
      phoneSize: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      currentRegion: {
        latitude: 9.5,
        longitude: 110,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      marker: {
        location: {latitude: 9.5, longitude: 110},
        time: 0,
      },
    };
  }

  componentDidUpdate() {}
  componentDidMount() {
    const {listGPS, point} = this.props.route.params;
    if (listGPS) {
      const listPoints = listGPS.map((e) => ({
        location: {
          latitude: e.location.lat,
          longitude: e.location.long,
        },
        time: e.time,
      }));
      let distance = 0;
      for (let i = 1; i < listPoints.length; i++) {
        distance += getDistance(
          listPoints[i].location,
          listPoints[i - 1].location,
        );
      }
      const speed = convertSpeed(
        this.calSpeed(
          distance,
          listGPS[0].time,
          listGPS[listGPS.length - 1].time,
        ),
        'kmh',
      );
      const time = Math.ceil(
        Math.abs(listGPS[listGPS.length - 1].time - listGPS[0].time) /
          (1000 * 60 * 60),
      );
      this.dropDownAlertRef.alertWithType(
        'info',
        'Path',
        `Distance: ${
          distance / 1000
        } (kms), Time: ${time} (hours), Speed: ${speed.toFixed(3)} (kph)`,
      );
      this.setState({listPoints, distance, speed});
    } else if (point) {
      this.setState({
        marker: {
          location: point.location,
          time: point.time,
        },
      });
    }

    const areaCollection = firestore().collection('area');
    areaCollection.get().then((snapshot) => {
      let res = snapshot.docs.map((e) => e.data());
      res = res.map((e) => ({
        center: {latitude: e['latitude'], longitude: e['longitude']},
        type: e['type'],
        weight: e['weight'],
      }));
      this.setState({warningPoints: res});
    });
  }
  calSpeed(distance, first, last) {
    first = first / 1000;
    last = last / 1000;
    return distance / (last - first);
  }
  handleLocating() {}
  onRegionChange(region) {
    this.setState({region});
  }
  drawPath = () => {};
  drawPolyline = (e) => {};

  closePolyline = (e) => {};
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
          initialRegion={this.state.currentRegion}
          onRegionChange={(region) => {
            this.onRegionChange(region);
          }}>
          <Polyline
            coordinates={this.state.listPoints.map((e) => e.location)}
            strokeWidth={3}
            strokeColor="#283747"
            tappable={true}
            onPress={this.closePolyline}
          />
          {this.state.listPoints.length > 0 &&
            this.state.listPoints.map((e, i) => {
              return (
                <Marker
                  key={i}
                  anchor={{x: 0.5, y: 0.5}}
                  coordinate={e.location}
                  title={`Position at ${e.time.toString()}`}
                  description={`Lat: ${e.location.latitude}, Long: ${e.location.longitude}`}
                  image={require('../../Assets/Images/marker.png')}
                />
              );
            })}
          {this.state.warningPoints.length > 0 &&
            this.state.warningPoints.map((e, i) => {
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
        </MapView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 11,
  },
  icon: {},
});
