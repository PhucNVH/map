import 'react-native-gesture-handler';
import React from 'react';
import AppConnector from './Services/AppConnector';
import {AppContext} from './Context/AppContext';

import auth from '@react-native-firebase/auth';
console.disableYellowBox = true;
export default class App extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
      newUser: false,
      setNewUser: (val) => {
        return this._isMounted && this.setState({newUser: val});
      },
      setLoaded: (val) => {
        return this._isMounted && this.setState({loaded: val});
      },

      setLoggedIn: (val) => {
        return this._isMounted && this.setState({loggedIn: val});
      },
    };
  }
  componentDidMount() {
    this._isMounted = true;
    auth().onAuthStateChanged((user) => {
      if (user) this.state.setLoggedIn(true);
      else this.state.setLoggedIn(false);
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <AppContext.Provider value={this.state}>
        <AppConnector />
      </AppContext.Provider>
    );
  }
}
