import 'react-native-gesture-handler';
import React from 'react';
import AppConnector from './Services/AppConnector';
import {AppContext} from './Context/AppContext';
export default class App extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
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
