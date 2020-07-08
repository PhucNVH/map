import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../Themes/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './../Screens/HomePage/Home';
import Dashboard from './../Screens/Dashboard/Dashboard';

import index from './../Screens/Dashboard/index';
import LightButton from './../Screens/LightButton/LightButton';

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'map-o';
          } else if (route.name === 'Dashboard') {
            iconName = 'bars';
          } else if (route.name === 'LightButton') {
            iconName = 'lightbulb-o';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color}  />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      
      >
      <Tab.Screen name="LightButton" component={LightButton} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Dashboard" component={index} />
    </Tab.Navigator>
  );
}
function NavBar() {
  return (
    <View style={styles.shape}>
      <MyTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  shape: {
    height: '100%',
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  item: {
    marginTop: 14,
    marginLeft: 50,
    flexGrow: 0.5,
  },
  item2: {
    marginTop: 7,
    marginLeft: 50,
    flexGrow: 0.5,
  },
});
export default NavBar;
