import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Header from '../../Components/Header';
import Boxs from '../../Components/Boxs';
import Button from '../../Components/Button';
import database from '@react-native-firebase/database';

function foo(obj) {
  var res = [];
  for (var keys of obj) {
    if (typeof obj[keys] == 'object') foo(obj[keys]);
    else {
      res.push(obj[keys]);
    }
  }
  console.log(res);
}
function foo2(obj) {
  var res = [];
  for (var year in obj) {
    // console.log(year);
    for (var month in obj[year]) {
      for (var day in obj[year][month]) {
        for (var gps in obj[year][month][day]) {
          const myobj = {};
          myobj[gps] = obj[year][month][day][gps];
          res.push(myobj);
        }
      }
    }
  }
  return res;
}

export default class DashBoard extends React.Component {
  constructor() {
    super();
    this.state = {listGPS: []};
  }
  componentDidMount() {
    database()
      .ref('GPS/history/')
      .once('value', (snapshot) => {
        const result = foo2(snapshot.val());
        this.setState({listGPS: result});
      });
    database()
      .ref('GPS/history/')
      .limitToLast(1)
      .on('child_added', function (snapshot) {
        console.log(snapshot.val());
      });
    // const result = foo2(snapshot.val());
    // console.log(result);
    // this.setState((prevState) => ({
    //   listGPS: [...prevState.listGPS, ...result],
    // }));
  }
  handleHistory = () => {};
  render() {
    return (
      <View style={styles.container}>
        <Button
          label="Click"
          onPress={() => {
            this.handleHistory();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
