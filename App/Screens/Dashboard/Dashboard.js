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
  Overlay,
  Icon,
} from 'react-native-elements';

import {AppContext} from '../../Context/AppContext';
import database, {firebase} from '@react-native-firebase/database';
import SpinKit from 'react-native-spinkit';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
export default class Dashboard extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.user = auth().currentUser;
    this.state = {
      search: '',
      latest: {
        location: {
          lat: 0,
          long: 0,
        },
        time: 0,
      },
      isLoading: true,
      isShow: false,
      listRequest: [],
      itemIndex: 0,
    };
  }

  componentDidMount() {
    database()
      .ref('GPS/latest/')
      .on('value', (snapshot) => {
        this.setState({isLoading: true});
        const result = snapshot.val();
        console.log(result);
        this.setState({
          latest: result,
        });
        setTimeout(() => {
          this.setState({isLoading: false});
        }, 500);
      });
  }
  componentWillUnmount() {
    database().ref('GPS/latest/').off();
  }
  logOut() {
    auth()
      .signOut()
      .catch((e) => {
        console.log(e);
      });
  }
  updateIndex = (index) => {
    switch (index) {
      case 0:
        this.props.navigation.navigate('History');
        break;
      case 1:
        this.props.navigation.navigate('People', {type: 'friends'});
        break;
      case 2:
        this.props.navigation.navigate('People', {type: 'enemies'});
        break;
    }
  };

  viewNoti = () => {
    this.setState({isShow: true});
    firestore()
      .collection('ship')
      .doc(this.user.uid)
      .collection('friendRequests')
      .get()
      .then(async (snapshot) => {
        const result = Promise.all(
          snapshot.docs.map((e) => {
            const data = e.data();
            return data.ref.get();
          }),
        );
        result.then((res) => {
          const listItem = res.map((e) => e.data());
          console.log(listItem);
          this.setState({listRequest: listItem});
        });
      });
  };
  addFriendRequest = (index, email) => {
    firestore()
      .collection('ship')
      .where('email', '==', email)
      .get()
      .then((snapshot) => {
        const result = snapshot.docs.map((i) => i.ref);
        firestore()
          .collection('ship')
          .doc(this.user.uid)
          .collection('friendRequests')
          .where('ref', '==', result[0])
          .get()
          .then((res) => {
            const data = res.docs.map((e) => e.ref);
            data[0].delete();
            switch (index) {
              case 0:
                firestore()
                  .collection('ship')
                  .doc(this.user.uid)
                  .collection('friends')
                  .add({ref: result[0]});
                break;
              case 1:
                break;
            }
          });
      });

    const newList = this.state.listRequest.filter((i) => i.email != email);
    this.setState({listRequest: newList});
  };
  keyExtractor = (item, index) => index.toString();
  component1 = () => (
    <View>
      <Icon name="list" size={20} type="feather" />
      <Text>History</Text>
    </View>
  );
  component2 = () => (
    <View>
      <Icon name="user-friends" size={20} type="font-awesome-5" />
      <Text>Friendships</Text>
    </View>
  );
  component3 = () => (
    <View>
      <Icon name="pirate" size={20} type="material-community" />
      <Text>Enermyships</Text>
    </View>
  );
  renderItem = ({item}) => (
    <ListItem
      title={item.displayName}
      subtitle={item.email}
      leftAvatar={{source: {uri: item.avatar}}}
      onPress={() => {
        this.props.navigation.navigate('Person', {
          item,
        });
      }}
      buttonGroup={{
        selectedIndex: 0,
        buttons: ['Ok', 'Deny'],
        onPress: (index) => {
          this.addFriendRequest(index, item.email);
        },
      }}
      bottomDivider
    />
  );
  render() {
    const buttons = [
      {element: this.component1},
      {element: this.component2},
      {element: this.component3},
    ];
    const {search, selectedIndex, isShow} = this.state;
    return (
      <View style={styles.container}>
        {isShow && (
          <Overlay
            isVisible={isShow}
            onBackdropPress={() => {
              this.setState({isShow: false});
            }}
            containerStyle={styles.modalContainer}
            overlayStyle={styles.overlay}>
            <Text>Friend Requests</Text>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.listRequest}
              renderItem={this.renderItem}
            />
          </Overlay>
        )}
        <View style={styles.userContainer}>
          <View style={styles.headerButton}>
            <Button
              icon={
                <Icon
                  name="power-off"
                  color="red"
                  size={30}
                  type="font-awesome"
                />
              }
              raised={true}
              containerStyle={styles.logOut}
              onPress={this.logOut}
              type="clear"
            />
            <Button
              icon={<Icon name="bell-o" size={30} type="font-awesome" />}
              raised={true}
              containerStyle={styles.noti}
              onPress={this.viewNoti}
              type="clear"
            />
          </View>
          <View style={styles.avatarWrapper}>
            <Avatar
              containerStyle={styles.avatar}
              source={
                this.user.photoURL
                  ? {
                      uri: this.user.photoURL,
                    }
                  : require('../../Assets/Images/marker.png')
              }
              editButton={true}
              size={100}
              overlayContainerStyle={{backgroundColor: 'white'}}
              rounded
            />
            <Text style={styles.name}>{this.user.displayName}</Text>
            {/* <Text style={styles.nation}>Nationality</Text> */}
          </View>
          <View style={styles.buttonGroupContainer}>
            <ButtonGroup
              onPress={this.updateIndex}
              buttons={buttons}
              containerStyle={styles.buttonGroup}
              i
            />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Card title="LATEST GPS LOCATION" containerStyle={styles.card}>
            <View style={styles.abc}>
              <View style={styles.spinnerContainer}>
                <SpinKit
                  type="ThreeBounce"
                  size={60}
                  color="cyan"
                  isVisible={this.state.isLoading}
                  style={styles.loading}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.text}>
                  Latitude: {this.state.latest.location.lat}
                </Text>
                <Text style={styles.text}>
                  Longitude: {this.state.latest.location.long}
                </Text>
                <Text style={styles.text}>
                  Time: {new Date(this.state.latest.time).toLocaleString()}
                </Text>
                <Button
                  title="VIEW NOW"
                  onPress={() => {
                    this.props.navigation.navigate('Home', {
                      item: this.state.latest,
                    });
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'red',
  },
  overlay: {
    width: '80%',
  },
  card: {
    borderRadius: 15,
  },
  cardInfo: {},
  loading: {},
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22,
    marginBottom: 25,
  },
  historyButtonContainter: {
    marginBottom: 10,
    flexGrow: 0,
    width: '50%',
  },
  historyButton: {},
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userContainer: {
    width: '100%',
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {fontSize: 28},
  nation: {fontSize: 22},
  avatar: {
    // width: 100,
    // height: 100,
    // borderRadius: 50,
    // backgroundColor: 'white',
    // resizeMode: 'contain',
  },
  searchBarContainer: {
    width: '100%',
  },
  searchBar: {
    width: '100%',
  },
  infoContainer: {
    flex: 5,
    margin: 0,
    padding: 0,

    width: '100%',
  },
  headerButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    padding: 0,
    margin: 0,
    height: 45,
  },
  logOut: {
    width: 45,
    borderRadius: 23,
    marginTop: 5,
    marginLeft: 5,
  },
  noti: {
    width: 45,
    borderRadius: 23,
    marginTop: 5,
    marginRight: 5,
  },
});
