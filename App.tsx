import React, {useEffect} from 'react';
import {Text, View, SafeAreaView, Platform} from 'react-native';
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
  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        /* Can now read or write to HealthKit */

        // const options = {
        //   startDate: new Date(2020, 1, 1).toISOString(),
        // };

        let options = {
          // date: new Date().toISOString(), // optional; default now
          includeManuallyAdded: true, // optional: default true
        };

        // AppleHealthKit.getHeartRateSamples(
        //   options,
        //   (callbackError: string, results: HealthValue[]) => {
        //     /* Samples are now collected from HealthKit */
        //   },
        // );

        AppleHealthKit.getStepCount(
          options,
          (err: Object, results: HealthValue) => {
            if (err) {
              return;
            }
            console.log('results: ', results);
          },
        );
      });
    }
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>App</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
