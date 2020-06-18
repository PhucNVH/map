import React from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Slider} from 'react-native-elements';
import Button from '../../Components/Button';

export default class LightButton extends React.Component {
  constructor() {
    super();
    this.state = {switchValue: false, value: 0};
  }

  handleButton = () => {
    var details = {
      device_id: 'Light',
      state: this.state.switchValue ? 1 : 0,
      volume: Math.round(this.state.value * 255),
    };
    console.log('hello');
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://dadn-map.azurewebsites.net/controlLight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then((e) => {
        console.log('ks');
      })
      .catch((e) => {
        console.log(e);
      });
  };
  toggleSwitch = (value) => {
    this.setState({switchValue: value});
    // fetch('http://dadn-map.azurewebsites.net/gps')
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  render() {
    return (
      <View>
        <Text>{this.state.switchValue ? 'Switch is ON' : 'Switch is OFF'}</Text>
        <Switch
          style={{marginTop: 30}}
          onValueChange={this.toggleSwitch}
          value={this.state.switchValue}
        />
        <Slider
          value={this.state.value}
          onValueChange={(value) => this.setState({value})}
        />
        <Text>Value: {Math.round(this.state.value * 255)} </Text>

        <Button
          label="Click"
          onPress={() => {
            this.handleButton();
          }}
        />
      </View>
    );
  }
}
