import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeAppEventEmitter,
  TouchableOpacity,
  Linking,
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

const App = () => {
  const [steps, setSteps] = useState<string | number>(0);
  const [isAuthAndroid, setIsAuthAndroid] = useState<boolean>(false);
  const [isAuthIos, setIsAuthIos] = useState<boolean>(false);

  // 실시간 걸음 수 측정
  if (Platform.OS === 'ios') {
    NativeAppEventEmitter.addListener('healthKit:StepCount:setup:failure', () =>
      console.log('setup:failure'),
    );
    NativeAppEventEmitter.addListener('healthKit:StepCount:new', () => {
      console.log('new======================');
      updateStepDataIos();
    });
  } else if (Platform.OS === 'android') {
    // GoogleFit.observeSteps(() => {
    //   console.log('adsfsdf');
    // });
  }

  useEffect(() => {
    if (Platform.OS === 'ios') {
      updateStepDataIos();
      return;
    }
    let interval = setInterval(updateStepDataAndroid, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateStepDataAndroid = async () => {
    try {
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
      console.log('andandand====');
      const dailyStep = await GoogleFit.getWeeklySteps(new Date());
      console.log('Daily steps >>> ', dailyStep[2].steps);

      const result = dailyStep[2]?.steps;
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
          // console.log('results===');
          // console.log(results);

          setSteps(Math.floor(results?.value ? results.value : 0));
          setIsAuthIos(true);
        },
      );

      // {
      //   "endDate": "2022-11-09T10:30:16.949+0900",
      //   "startDate": "2022-11-09T07:57:39.734+0900",
      //   "value": 1632
      // },

      // 1주일 걸음 수

      let optionss = {
        startDate: new Date(year, month, day - 7).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
      };

      AppleHealthKit.getDailyStepCountSamples(
        optionss,
        (err: string, results: Array<HealthValue>) => {
          if (err) {
            console.log('err===');
            console.log(err);
            return;
          }
          // console.log('results===');
          // console.log(results);

          if (results.length) {
            let arr = [];

            let obj = results.reduce((acc, val) => {
              let date: string = val.startDate.slice(0, 10);
              acc[date] = acc[date] ? acc[date] + val.value : val.value;
              return acc;
            }, {});

            for (let adj in obj) {
              let val = {
                date: adj,
                value: obj[adj],
              };
              arr.push(val);
            }

            // console.log('arr===');
            // console.log(arr);

            // [
            //   {"date": "2022-11-11", "value": 3369},
            //   {date: '2022-11-10', value: 7807},
            //   {date: '2022-11-09', value: 5448},
            //   {date: '2022-11-08', value: 5905},
            //   {date: '2022-11-07', value: 5276},
            //   {date: '2022-11-06', value: 8721},
            //   {date: '2022-11-05', value: 11581} // 마지막에 ,는 빼고 보내기
            // ];

            setSteps(Math.floor(arr[0]?.value ? arr[0].value : 0));
          }
        },
      );
    });
  };

  const onPressDisconnect = async () => {
    if (Platform.OS === 'android') {
      GoogleFit.disconnect();
      setIsAuthAndroid(false);
      setSteps(0);
      console.log('disconnect complete====');
    } else if (Platform.OS === 'ios') {
      console.log('adsffff');

      let options = {
        permissions: {
          read: ['StepCount'],
          write: ['StepCount'],
        },
      };

      AppleHealthKit.initHealthKit(options, (err: string, results: boolean) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }
        // Healthkit is initialized...
        // now safe to read and write Healthkit data...
      });

      setIsAuthIos(false);
      setSteps(0);
    }
  };

  const checkAuth = async () => {
    if (Platform.OS === 'android') {
      console.log(GoogleFit.isAuthorized);
      // true
    } else if (Platform.OS === 'ios') {
      AppleHealthKit.getAuthStatus(permissions, (err, results) => {
        console.log(err, results);

        // export enum HealthStatusCode {
        //   NotDetermined = 0,
        //   SharingDenied = 1,
        //   SharingAuthorized = 2,
        // }

        // {
        //   "permissions": {
        //     "read": [2],
        //     "write": [2]
        //   }
        // }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SimpleStepCounter</Text>
      <Text style={styles.dateText}>
        {year}년 {month + 1}월 {day}일의 걸음 수
      </Text>
      <Text style={[styles.steps]}>{steps}</Text>
      {Platform.OS === 'android' &&
        (isAuthAndroid ? (
          <View style={styles.disconnectArea}>
            <TouchableOpacity
              style={styles.connectButton}
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
        ))}
      {Platform.OS === 'ios' &&
        (isAuthIos ? (
          <View style={styles.disconnectArea}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={onPressDisconnect}>
              <Text style={styles.disconnectText}>Health 연결 끊기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.disconnectArea}>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={updateStepDataIos}>
              <Text style={styles.disconnectText}>Health 연결하기</Text>
            </TouchableOpacity>
          </View>
        ))}
      <View style={styles.disconnectArea}>
        <TouchableOpacity style={styles.disconnectButton} onPress={checkAuth}>
          <Text style={styles.disconnectText}>연동 확인하기</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' && (
        <View style={styles.disconnectArea}>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={() => {
              // Linking.openURL('x-apple-health://');
              // Linking.openURL('x-argonaut-app://');
              // Linking.openSettings();

              Linking.openURL('app-settings://notification/myapp');
              Linking.openURL('App-Prefs:HEALTH');
            }}>
            <Text style={styles.disconnectText}>건강앱</Text>
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
    marginTop: 20,
  },
  disconnectButton: {
    borderRadius: 12,
    backgroundColor: '#15bfee',
    width: 160,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    borderRadius: 12,
    backgroundColor: '#e6300c',
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
