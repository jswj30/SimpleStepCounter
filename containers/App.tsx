import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-native-router-flux';

const App = () => {
  return (
    <Provider store={store}>
      <Router hideNavBar={true}>
        <Route
          name="launch"
          component={Launch}
          initial={true}
          wrapRouter={true}
          title="Launch"
        />
        <Route name="counter" component={CounterApp} title="Counter App" />
      </Router>
    </Provider>
  );
};

export default App;
