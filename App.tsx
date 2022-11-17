import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeAppEventEmitter,
  TouchableOpacity,
} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDate();

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.StepCount],
    write: [AppleHealthKit.Constants.Permissions.StepCount],
  },
} as HealthKitPermissions;

const scopeOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
  ],
};

const opt = {
  startDate: new Date(year, month, day).toISOString(), // required ISO8601Timestamp
  endDate: new Date().toISOString(), // required ISO8601Timestamp
  // bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
  // bucketInterval: 1, // optional - default 1.
};

const App = () => {
  const [steps, setSteps] = useState<string | number>(0);
  const [isAuthAndroid, setIsAuthAndroid] = useState<boolean>(false);
  // const [year, setYear] = useState<number>(0);
  // const [month, setMonth] = useState<number>(0);
  // const [day, setDay] = useState<number>(0);

  // 실시간 걸음 수 측정
  NativeAppEventEmitter.addListener('healthKit:StepCount:new', () => {
    updateStepDataIos();
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      updateStepDataAndroid();
    } else {
      updateStepDataIos();
    }
  }, []);

  const updateStepDataAndroid = async () => {
    try {
      console.log('GoogleFit.isAuthorized====');
      console.log(GoogleFit.isAuthorized);

      if (!GoogleFit.isAuthorized) {
        const auth = await GoogleFit.authorize(scopeOptions);
        if (auth?.success) {
          setIsAuthAndroid(true);
          getStepAndroid();
        }
      } else {
        setIsAuthAndroid(true);
        getStepAndroid();
      }

      // setSteps('iOS에서만 서비스 가능합니다.');
    } catch (e) {
      console.log(e);
    }
  };

  const getStepAndroid = async () => {
    try {
      const dailyStep = await GoogleFit.getWeeklySteps(
        new Date(year, month, day),
        0,
      );
      // console.log('Daily steps >>> ', dailyStep[1]?.steps);

      const result = dailyStep[1]?.steps;
      console.log(result[result.length - 1]);

      setSteps(
        Math.floor(
          result[result.length - 1]?.value
            ? result[result.length - 1].value
            : 0,
        ),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const updateStepDataIos = () => {
    // setYear(years);
    // setMonth(months);
    // setDay(days);

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

  const onPressDisconnect = async () => {
    GoogleFit.disconnect();
    setIsAuthAndroid(false);
    setSteps(0);
    console.log('disconnect complete====');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SimpleStepCounter</Text>
      <Text style={styles.dateText}>
        {year}년 {month + 1}월 {day}일의 걸음 수
      </Text>
      <Text style={[styles.steps]}>{steps}</Text>
      {Platform.OS === 'android' && isAuthAndroid ? (
        <View style={styles.disconnectArea}>
          <TouchableOpacity
            style={[
              styles.disconnectButton,
              {
                backgroundColor: '#e6300c',
              },
            ]}
            onPress={onPressDisconnect}>
            <Text style={styles.disconnectText}>GoogleFit 연결 끊기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.disconnectArea}>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={updateStepDataAndroid}>
            <Text style={styles.disconnectText}>GoogleFit 연결하기</Text>
          </TouchableOpacity>
        </View>
      )}
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
  disconnectArea: {
    // borderWidth: 1,
    marginTop: 20,
  },
  disconnectButton: {
    // borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#15bfee',
    width: 160,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default App;
