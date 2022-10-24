import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {counter, increment, decrement} from '../actions/counterActions';

const Counter = () => {
  return (
    <View>
      <Text>{counter}</Text>
      <TouchableOpacity onPress={increment} style={styles.button}>
        <Text>up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={decrement} style={styles.button}>
        <Text>down</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {},
});

export default Counter;
