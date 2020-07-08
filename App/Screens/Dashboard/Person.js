import React from 'react';
import {StyleSheet, Text, View, FlatList, Modal} from 'react-native';
import {
  Button,
  Card,
  ButtonGroup,
  ListItem,
  Image,
  Avatar,
  SearchBar,
  Icon,
} from 'react-native-elements';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {AppContext} from '../../Context/AppContext';
import database from '@react-native-firebase/database';
import SpinKit from 'react-native-spinkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class Dashboard extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.user = auth().currentUser;
    this.state = {
      search: '',
      time: new Date(0),
      location: {
        latitude: 7,
        longitude: 110,
      },
      isLoading: true,
      user: {},
      isFriend: false,
      isEnermy: false,
      userRef: {},
    };
  }

  componentDidMount() {
    const user = this.props.route.params.item;
    firestore()
      .collection('ship')
      .where('email', '==', user.email)
      .get()
      .then((snapshot) => {
        const res = snapshot.docs.map((i) => i.ref);
        this.setState({userRef: res[0]});
        firestore()
          .collection('ship')
          .doc(this.user.uid)
          .collection('friends')
          .where('ref', '==', res[0])
          .get()
          .then((val) => {
            const data = val.docs.map((i) => i.data());
            if (data.length == 1) {
              this.setState({isFriend: true, isEnermy: false});
            }
          });
        firestore()
          .collection('ship')
          .doc(this.user.uid)
          .collection('enemies')
          .where('ref', '==', res[0])
          .get()
          .then((val) => {
            const data = val.docs.map((i) => i.data());
            if (data.length == 1) {
              this.setState({isFriend: false, isEnermy: true});
            }
          });
      })
      .catch(console.log);
    this.setState({user});
    this.setState({
      location: {
        latitude: user.location._latitude,
        longitude: user.location._longitude,
      },
      time: new Date(user.time._seconds * 1000),
    });
  }
  addFriend = () => {
    firestore()
      .collection('ship')
      .doc(this.user.uid)
      .collection('friends')
      .add({ref: this.state.userRef})
      .then((e) => {})
      .catch(console.log);
    firestore()
      .collection('ship')
      .where('email', '==', this.user.email)
      .get()
      .then((snapshot) => {
        const res = snapshot.docs.map((i) => i.ref);
        this.state.userRef
          .collection('friendRequests')
          .add({ref: res[0]})
          .then((e) => {})
          .catch(console.log);
      });
  };
  addEnemy = () => {
    firestore()
      .collection('ship')
      .doc(this.user.uid)
      .collection('enemies')
      .add({ref: this.state.userRef})
      .then((e) => {})
      .catch(console.log);
  };
  render() {
    const {avatar, displayName, email} = this.state.user;
    const {location, time, isEnermy, isFriend} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.avatarWrapper}>
            <Avatar
              containerStyle={styles.avatar}
              source={{uri: avatar}}
              editButton={true}
              size={100}
              overlayContainerStyle={{backgroundColor: 'white'}}
              rounded
            />
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.nation}>{email}</Text>
          </View>
          <View style={styles.buttonGroup}>
            {!isEnermy && !isFriend && (
              <Button
                title="Add Friend"
                type="outline"
                onPress={this.addFriend}
              />
            )}
            {!isEnermy && !isFriend && (
              <Button title="Add Enemy" type="outline" />
            )}
            {isFriend && <Text>Friend</Text>}

            {isEnermy && <Text>Enemy</Text>}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Card title="LATEST GPS LOCATION" containerStyle={styles.card}>
            <View style={styles.abc}>
              <View style={styles.cardInfo}>
                <Text style={styles.text}>Latitude: {location.latitude}</Text>
                <Text style={styles.text}>Longitude: {location.longitude}</Text>
                <Text style={styles.text}>
                  Time: {new Date(time).toLocaleString()}
                </Text>
              </View>
              <MapView
                ref={(map) => {
                  this.map = map;
                }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 5,
                  longitudeDelta: 5,
                }}
                style={styles.map}
                liteMode={false}>
                <Marker
                  anchor={{x: 0.5, y: 0.5}}
                  coordinate={location}
                  image={{uri: avatar}}
                />
              </MapView>
            </View>
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
  },
  cardInfo: {},
  loading: {},
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22,
    marginBottom: 18,
  },
  userContainer: {
    width: '100%',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {fontSize: 28},
  nation: {fontSize: 22},
  avatar: {},
  infoContainer: {
    flex: 5,
    margin: 0,
    padding: 0,
    width: '100%',
  },
  buttonGroupContainer: {
    backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
  },
  buttonGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
});
