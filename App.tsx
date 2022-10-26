import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Platform} from 'react-native';
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
  const [steps, setSteps] = useState('fffadf');

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        let options = {
          // date: new Date().toISOString(), // optional; default now
          startDate: new Date(2022, 9, 24).toISOString(),
          date: new Date(2022, 9, 26).toISOString(),
          includeManuallyAdded: false, // optional: default true
        };

        AppleHealthKit.getStepCount(
          options,
          (err: Object, results: HealthValue) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(results);
          },
        );
      });
    }
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 30}}>{steps}</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
