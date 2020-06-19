import React from 'react';
import {StyleSheet, Text, View, FlatList, Modal} from 'react-native';

import Header from '../../Components/Header';
import Boxs from '../../Components/Boxs';
import {Button, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import {ListItem} from 'react-native-elements';
export default class DashBoard extends React.Component {
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
    };
  }
  componentDidMount() {
    database()
      .ref('GPS/history/')
      .orderByChild('time')
      .on('child_added', (snapshot) => {
        const result = snapshot.val();
        // result['isNew'] = true;
        console.log(result);
        this.setState((prevState) => ({
          listGPS: [...prevState.listGPS, result],
          latest: result,
        }));
      });
  }
  handleHistory = () => {
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
      // badge={{
      //   value: item.isNew ? 'NEW' : '',
      //   textStyle: {color: 'white', fontSize: 12},
      //   containerStyle: {},
      // }}
    />
  );
  render() {
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
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.listGPS}
              renderItem={this.renderItem}
            />
          </View>
        </Modal>
        <Button title="History" raised={true} onPress={this.handleHistory} />
        <Card title="NEW GPS LOCATION">
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
              this.props.navigation.navigate('Home', {item: this.state.latest});
            }}
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
    marginBottom: 12,
  },
});
