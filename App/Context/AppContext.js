import React from 'react';

export const AppContext = React.createContext({
  login: false,
  loaded: false,
  setLoggedIn: () => {},
  setLoaded: () => {},
});
