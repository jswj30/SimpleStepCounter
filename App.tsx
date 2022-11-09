import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.StepCount],
    write: [AppleHealthKit.Constants.Permissions.StepCount],
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

    // 하루 걸음 수
    // let options = {
    //   date: new Date(2022, 10, 9).toISOString(), // optional; default now
    // };

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

    // {
    //   "endDate": "2022-11-09T10:30:16.949+0900",
    //   "startDate": "2022-11-09T07:57:39.734+0900",
    //   "value": 1632
    // }

    // 1주일 걸음 수

    let options = {
      startDate: new Date(2022, 10, 8).toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
    };

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

    // [
    //   {
    //     endDate: '2022-11-09T11:00:00.000+0900',
    //     startDate: '2022-11-09T10:00:00.000+0900',
    //     value: 214,
    //   },
    //   {
    //     endDate: '2022-11-09T09:00:00.000+0900',
    //     startDate: '2022-11-09T08:00:00.000+0900',
    //     value: 1337.503591423364,
    //   },
    //   {
    //     endDate: '2022-11-09T08:00:00.000+0900',
    //     startDate: '2022-11-09T07:00:00.000+0900',
    //     value: 80.49640857663603,
    //   },
    //   {
    //     endDate: '2022-11-09T00:00:00.000+0900',
    //     startDate: '2022-11-08T23:00:00.000+0900',
    //     value: 842,
    //   },
    //   {
    //     endDate: '2022-11-08T23:00:00.000+0900',
    //     startDate: '2022-11-08T22:00:00.000+0900',
    //     value: 798,
    //   },
    //   {
    //     endDate: '2022-11-08T22:00:00.000+0900',
    //     startDate: '2022-11-08T21:00:00.000+0900',
    //     value: 556.47989601913,
    //   },
    //   {
    //     endDate: '2022-11-08T21:00:00.000+0900',
    //     startDate: '2022-11-08T20:00:00.000+0900',
    //     value: 412.52010398087,
    //   },
    //   {
    //     endDate: '2022-11-08T20:00:00.000+0900',
    //     startDate: '2022-11-08T19:00:00.000+0900',
    //     value: 1168,
    //   },
    //   {
    //     endDate: '2022-11-08T19:00:00.000+0900',
    //     startDate: '2022-11-08T18:00:00.000+0900',
    //     value: 157,
    //   },
    //   {
    //     endDate: '2022-11-08T18:00:00.000+0900',
    //     startDate: '2022-11-08T17:00:00.000+0900',
    //     value: 900,
    //   },
    //   {
    //     endDate: '2022-11-08T15:00:00.000+0900',
    //     startDate: '2022-11-08T14:00:00.000+0900',
    //     value: 386,
    //   },
    //   {
    //     endDate: '2022-11-08T14:00:00.000+0900',
    //     startDate: '2022-11-08T13:00:00.000+0900',
    //     value: 651,
    //   },
    //   {
    //     endDate: '2022-11-08T13:00:00.000+0900',
    //     startDate: '2022-11-08T12:00:00.000+0900',
    //     value: 34,
    //   },
    // ];
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
