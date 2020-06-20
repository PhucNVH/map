import React from 'react';
import {StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import {Slider, Button} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownPicker from 'react-native-dropdown-picker';
import database from '@react-native-firebase/database';
import colors from '../../Themes/Colors';
export default class LightButton extends React.Component {
  constructor() {
    super();
    this.state = {
      switchValue: false,
      value: 0,
      data: [
        {label: 'Light', value: 'Light'},
        {label: 'LightD', value: 'LightD'},
        {label: 'Light2', value: 'Light2'},
      ],
    };
  }
  componentDidMount() {}
  handleButton = () => {
    var details = {
      device_id: 'Light',
      state: this.state.switchValue ? 1 : 0,
      brightness: Math.round(this.state.value * 255),
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        fetch('http://dadn-map.azurewebsites.net/controlLight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        })
          .then((e) => {
            this.dropDownAlertRef.alertWithType(
              'success',
              'Success',
              'Request sent successfully',
            );
          })
          .catch((e) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', e);
          });
      } else {
        this.dropDownAlertRef.alertWithType('error', 'Error', 'No Network');
      }
    });
  };
  toggleSwitch = (value) => {
    this.setState({switchValue: value});
  };
  selectItem = (item) => {
    const reference = database().ref('/Light/' + item.value);
    reference
      .child('latest')
      .once('value')
      .then((snapshot) => {
        const res = snapshot.val();
        console.log(res);
        this.setState({
          switchValue: res.state == 1 ? true : false,
          value: Number.parseInt(res.brightness, 10) / 255,
        });
      });
    this.setState({selected: item.value});
  };
  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />

        <View style={styles.switchContainer}>
          <Text style={styles.text}>State</Text>
          <Switch
            style={styles.switch}
            onValueChange={this.toggleSwitch}
            value={this.state.switchValue}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.text}>
            Brightness : {Math.round(this.state.value * 255)}{' '}
          </Text>
          <Slider
            value={this.state.value}
            onValueChange={(value) => this.setState({value})}
          />
        </View>
        <Button
          buttonStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          onPress={this.handleButton}
          title="Send"
          raised={true}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  drowdown: {height: 50, width: '100%'},
  switchContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {width: 50},
  sliderContainer: {
    width: '100%',
    height: 100,
  },
  button: {
    width: '100%',
  },
  buttonContainer: {
    width: '20%',
  },
  text: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 32,
    color: 'white',
  },
});
