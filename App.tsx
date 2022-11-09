import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions;

const App = () => {
  const [steps, setSteps] = useState(999999);

  AppleHealthKit.initHealthKit(permissions, (error: string) => {
    /* Called after we receive a response from the system */

    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
    }

    /* Can now read or write to HealthKit */

    // const options = {
    //   startDate: new Date(2022, 11, 7).toISOString(),
    // };

    // AppleHealthKit.getHeartRateSamples(
    //   options,
    //   (callbackError: string, results: HealthValue[]) => {
    //     /* Samples are now collected from HealthKit */

    //     console.log('results=====');
    //     console.log(results);

    //     console.log('callbackError===');
    //     console.log(callbackError);
    //   },
    // );

    // let options = {
    //   date: new Date(2022, 10, 7).toISOString(), // optional; default now

    //   // date: new Date(2022, 10, 7).toISOString(), // optional; default now
    //   // includeManuallyAdded: true, // optional: default true
    // };

    // export interface HealthInputOptions extends HealthUnitOptions {
    //   startDate?: string;
    //   endDate?: string;
    //   limit?: number;
    //   ascending?: boolean;
    //   type?: HealthObserver;
    //   date?: string;
    //   includeManuallyAdded?: boolean;
    //   period?: number;
    //   anchor?: string;
    // }

    let options = {
      startDate: new Date(2022, 10, 9).toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
    };

    // AppleHealthKit.getStepCount(
    //   options,
    //   (err: Object, results: HealthValue) => {
    //     if (err) {
    //       console.log('err===');
    //       console.log(err);
    //       return;
    //     }
    //     console.log('results===');
    //     console.log(results);

    //     setSteps(results.value);
    //   },
    // );

    AppleHealthKit.getDailyStepCountSamples(
      options,
      (err: string, results: Array<HealthValue>) => {
        if (err) {
          console.log('err===');
          console.log(err);
          return;
        }
        console.log('results===');
        console.log(results);
        // setSteps(results.value);
      },
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SimpleStepCounter</Text>
      <Text style={styles.steps}>{steps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: '#000',
  },
  steps: {
    fontSize: 60,
    marginTop: 20,
  },
});

export default App;
