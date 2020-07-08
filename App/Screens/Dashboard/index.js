import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './Dashboard';
import History from './History';
import People from './People';
import Person from './Person';
import Map from './Map';
const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Dashboard" headerMode="none">
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="Person" component={Person} />
    </Stack.Navigator>
  );
}
