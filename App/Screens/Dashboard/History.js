import React from 'react';
import {StyleSheet, Text, View, FlatList, Modal} from 'react-native';
import {Button, Card, ButtonGroup, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getDistance} from 'geolib';

import auth from '@react-native-firebase/auth';
export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.uid = auth().currentUser.uid;
    this.state = {
      show: false,
      date: new Date(),
      distance: 0,
      listGPS: [],
      listGPSbyDate: [],
      isVisible: false,
      latest: {
        location: {
          lat: 0,
          long: 0,
        },
        time: 0,
      },
      selectedIndex: 0,
      isLoading: true,
    };
  }
  handleHistory = () => {
    const locationCollection = firestore()
      .collection('ship')
      .doc(this.uid)
      .collection('location');
    var nextDay = new Date(this.state.date.getTime());
    nextDay.setDate(this.state.date.getDate() + 1);
    locationCollection
      .where('time', '>=', this.state.date)
      .where('time', '<', nextDay)
      .get()
      .then((snapshot) => {
        let val = snapshot.docs.map((e) => e.data());
        val = val.map((e) => ({
          location: {
            lat: e.location.latitude,
            long: e.location.longitude,
          },
          time: e.time.toDate(),
        }));

        this.setState({
          listGPSbyDate: val,
        });
      });

    this.setState({isVisible: true});
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => (
    <ListItem
      title={new Date(item.time).toLocaleString()}
      subtitle={`${item.location.lat}, ${item.location.long}`}
      onPress={() => {
        this.setState({isVisible: false});
        this.props.navigation.navigate('Map', {
          point: {
            location: {
              latitude: item.location.lat,
              longitude: item.location.long,
            },
            time: item.time,
          },
        });
      }}
      bottomDivider
      chevron
    />
  );

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex});
    if (selectedIndex == 1) {
      firestore()
        .collection('ship')
        .doc(this.uid)
        .collection('location')
        .orderBy('time')
        .get()
        .then((snapshot) => {
          let result = snapshot.docs.map((e) => e.data());
          result = result.map((e) => ({
            location: {
              lat: e.location.latitude,
              long: e.location.longitude,
            },
            time: e.time.toDate(),
          }));
          this.setState({listGPS: result});
        });
    }
  };
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    console.log(selectedDate, this.state.date);
    if (this.state.date.getTime() !== currentDate.getTime()) {
      const locationCollection = firestore()
        .collection('ship')
        .doc(this.uid)
        .collection('location');
      var nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      locationCollection
        .where('time', '>=', currentDate)
        .where('time', '<', nextDay)
        .get()
        .then((snapshot) => {
          let val = snapshot.docs.map((e) => e.data());
          val = val.map((e) => ({
            location: {
              lat: e.location.latitude,
              long: e.location.longitude,
            },
            time: e.time.toDate(),
          }));
          this.setState({
            listGPSbyDate: val,
          });
          console.log(val[0]);
        });
    }
    this.setState({date: currentDate, show: false, timestamp: selectedDate});
  };
  showDatepicker = () => {
    this.setState({show: true});
  };
  viewPath = () => {
    this.props.navigation.navigate('Map', {listGPS: this.state.listGPSbyDate});
  };
  render() {
    const buttons = ['Find', 'All'];
    const {selectedIndex, date, show} = this.state;
    return (
      <View style={styles.modal}>
        {/* <Button
          icon={<Icon name="arrow-left" size={20} color="white" />}
          containerStyle={styles.modalButtonContainer}
          style={styles.modalButtonContainer}
          title={'Back'}
          onPress={() => {
            this.props.navigation.navigate('Dashboard');
          }}
        /> */}
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{height: 50}}
        />
        {(() => {
          if (selectedIndex == 0) {
            return (
              <View>
                <View style={styles.datepicker}>
                  <Icon
                    name={'calendar'}
                    size={25}
                    type={'material-community'}
                  />
                  <Button
                    type="outline"
                    onPress={this.showDatepicker}
                    title={date.toDateString()}
                  />
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    is24Hour={true}
                    display="default"
                    onChange={this.onChange}
                  />
                )}
                {this.state.listGPSbyDate.length != 0 && (
                  <View>
                    <Button onPress={this.viewPath} title="View Path" />
                    <FlatList
                      keyExtractor={this.keyExtractor}
                      data={this.state.listGPSbyDate}
                      renderItem={this.renderItem}
                    />
                  </View>
                )}
              </View>
            );
          } else {
            return (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.listGPS}
                renderItem={this.renderItem}
              />
            );
          }
        })()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    // height: '40%',
  },
  cardInfo: {},
  loading: {},
  infoContainer: {
    flexGrow: 0,
  },
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
  },
  modalButton: {
    backgroundColor: 'red',
  },
  modalButtonContainer: {
    backgroundColor: 'red',
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
  datepicker: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
