import React from 'react';
import {StyleSheet, Text, View, FlatList, Modal} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Header from '../../Components/Header';
import Boxs from '../../Components/Boxs';
import {Button, Card, ButtonGroup} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import {ListItem} from 'react-native-elements';
import SpinKit from 'react-native-spinkit';
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listGPS: [],
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
  handleHistory = () => {
    let listGPS = [];

    this.setState({listGPS: []});
    database()
      .ref('GPS/history/')
      .orderByChild('time')
      .on('child_added', (snapshot) => {
        const result = snapshot.val();
        console.log(result);
        this.setState((prevState) => ({
          listGPS: [...prevState.listGPS, result],
        }));
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
        this.props.navigation.navigate('Home', {item});
      }}
      bottomDivider
      chevron
    />
  );

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex});
  };

  render() {
    const buttons = ['All', 'Find'];
    const {selectedIndex} = this.state;
    return (
      <View style={styles.container}>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.isVisible}>
          <View style={styles.modal}>
            <Button
              icon={<Icon name="arrow-left" size={20} color="white" />}
              containerStyle={styles.modalButtonContainer}
              style={styles.modalButtonContainer}
              title={'Back'}
              onPress={() => {
                this.setState({isVisible: false});
              }}
            />
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{height: 50}}
            />
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.listGPS}
              renderItem={this.renderItem}
            />
          </View>
        </Modal>
        <Card title="LATEST GPS LOCATION" containerStyle={styles.card}>
          <View style={styles.infoContainer}>
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

        <Button
          title="History"
          raised={true}
          containerStyle={styles.historyButtonContainter}
          onPress={this.handleHistory}
          type="outline"
        />
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
});
