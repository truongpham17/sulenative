import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as ReduxProvider } from 'react-redux';
import MainApp from './src/Navigation';

import store, { persistor } from './src/store';

export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainApp />
        </PersistGate>
      </ReduxProvider>
    );
  }
}
