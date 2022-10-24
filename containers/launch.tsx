import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';

const launch = () => {
  return (
    <TouchableOpacity onPress={Actions.counter}>
      <Text>Counter</Text>
    </TouchableOpacity>
  );
};

export default launch;
