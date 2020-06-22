import React from 'react';
import {StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import {Slider, Button, Icon} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownPicker from 'react-native-dropdown-picker';
import database from '@react-native-firebase/database';
import colors from '../../Themes/Colors';
export default class LightButton extends React.Component {
  constructor() {
    super();
    this.state = {
      startAngle: (Math.PI * 0) / 6,
      angleLength: (Math.PI * 12) / 6,
      switchValue: false,
      value: 0,
      data: [
        {label: 'Light', value: 'Light'},
        {label: 'LightD', value: 'LightD'},
        {label: 'Light2', value: 'Light2'},
      ],
      backgroundColor: {backgroundColor: 'rgb(245,245,245)'},
    };
  }
  componentDidMount() {
    database()
      .ref('Light/Light/latest')
      .once('value')
      .then((snapshot) => {
        const res = snapshot.val();
        this.setState({
          switchValue: res.state == 1 ? true : false,
          value: Number.parseInt(res.brightness, 10) / 255,
        });
      });
  }
  backgroundColor = () => {
    let grayScale = 245;
    grayScale = Math.round(this.state.value * 205) + 40;
    if (this.state.switchValue == false) {
      grayScale = 40;
    }
    return {backgroundColor: `rgb(${grayScale},${grayScale},${grayScale})`};
  };
  textColor = () => {
    let color = 'black';
    const grayScale = Math.round(this.state.value * 205) + 40;
    if (this.state.switchValue == false || grayScale < 145) {
      color = 'white';
    }
    return {color: color};
  };
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
    this.setState((prevState) => ({
      switchValue: !prevState.switchValue,
    }));
  };
  switchStyle = () => {
    let grayScale = '';
    if (this.state.switchValue == false) {
      grayScale = '#000000';
    } else {
      grayScale = '#a6dcef';
    }
    return {borderColor: grayScale};
  };
  buttonTitle = () => {
    return this.state.switchValue ? 'Off' : ' On';
  };

  trackColor = () => {
    let grayScale = '';
    let color = '#000000';
    if (this.state.switchValue == false) {
    } else {
      color = '#a6dcef';
    }
    return color;
  };
  lightBulpIcon = () => {
    let grayScale = '';
    let color = '#000000';
    if (this.state.switchValue == false) {
      grayScale = 'lightbulb-off-outline';
    } else {
      grayScale = 'lightbulb-on-outline';
      color = '#a6dcef';
    }
    return (
      <Icon
        name={grayScale}
        size={50}
        color={color}
        type={'material-community'}
      />
    );
  };
  render() {
    return (
      <View style={[styles.container, this.backgroundColor()]}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />

        <View style={styles.sliderContainer}>
          <Text style={[styles.brightnessText, this.textColor()]}>
            {Math.round(this.state.value * 255)}
          </Text>

          <Slider
            value={this.state.value}
            style={styles.trackContainer}
            trackStyle={styles.trackStyle}
            thumbStyle={styles.thumbStyle}
            minimumTrackTintColor={this.trackColor()}
            onValueChange={(value) => {
              this.setState({
                value,
              });
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Button
            raised={true}
            containerStyle={[styles.switch, this.switchStyle()]}
            buttonStyle={[styles.switchButton]}
            icon={this.lightBulpIcon()}
            titleStyle={[styles.titleStyle, this.textColor()]}
            onPress={this.toggleSwitch}
          />

          <Button
            buttonStyle={styles.sendButton}
            containerStyle={styles.sendButtonContainer}
            onPress={this.handleButton}
            title="Send"
            raised={true}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  drowdown: {height: 50, width: '100%'},
  switchContainer: {
    flex: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  switch: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 5,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },

  switchButton: {
    height: 150,
    width: 150,
    backgroundColor: 'rgb(245,245,245)',
  },
  titleStyle: {
    fontSize: 38,
  },
  sliderContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  trackContainer: {
    width: 300,
    borderLeftColor: 'green',
    borderRadius: 30,
  },
  trackStyle: {
    height: 60,
    borderRadius: 30,
    borderLeftColor: 'green',
    backgroundColor: 'red',
  },
  thumbStyle: {
    width: 0,
    height: 0,
  },
  brightnessText: {
    fontSize: 120,
  },
  sendButtonContainer: {
    width: 200,
    height: 50,
    borderRadius: 30,
  },
  sendButton: {
    height: '100%',
  },
});
