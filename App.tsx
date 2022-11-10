import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeAppEventEmitter,
} from 'react-native';
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
  const [steps, setSteps] = useState<string | number>(0);
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);

  // 실시간 걸음 수 측정
  NativeAppEventEmitter.addListener('healthKit:StepCount:new', () => {
    updateStepData();
  });

  useEffect(() => {
    updateStepData();
  }, [year, month, day]);

  const updateStepData = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setDay(today.getDate());

    if (Platform.OS === 'android') {
      setSteps('iOS에서만 서비스 가능합니다.');
      return;
    }

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }

      // 하루 걸음 수
      let options = {
        date: new Date(year, month, day).toISOString(), // optional; default now
      };

      AppleHealthKit.getStepCount(
        options,
        (err: Object, results: HealthValue) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log('results===');
          console.log(results);

          setSteps(Math.floor(results?.value ? results.value : 0));
        },
      );

      // {
      //   "endDate": "2022-11-09T10:30:16.949+0900",
      //   "startDate": "2022-11-09T07:57:39.734+0900",
      //   "value": 1632
      // },

      // 1주일 걸음 수
      // let optionss = {
      //   startDate: new Date(year, month, day - 2).toISOString(), // required
      //   endDate: new Date().toISOString(), // optional; default now
      // };

      // AppleHealthKit.getDailyStepCountSamples(
      //   optionss,
      //   (err: string, results: Array<HealthValue>) => {
      //     if (err) {
      //       console.log('err===');
      //       console.log(err);
      //       return;
      //     }
      //     console.log('results===');
      //     console.log(results);

      //     if (results.length) {
      //       setSteps(results[0].value);
      //     }
      //   },
      // );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SimpleStepCounter</Text>
      <Text style={styles.dateText}>
        {year}년 {month + 1}월 {day}일의 걸음 수
      </Text>
      <Text
        style={[
          styles.steps,
          Platform.OS === 'android' && styles.stepsAndroid,
        ]}>
        {steps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    color: '#000',
  },
  dateText: {
    marginTop: 10,
    fontSize: 20,
    color: '#000000',
  },
  steps: {
    marginTop: 30,
    fontSize: 80,
    color: '#000',
    fontWeight: 'bold',
  },
  stepsAndroid: {
    fontSize: 15,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default App;
