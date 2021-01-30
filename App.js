/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';

import app from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const db = app.database();

const App = () => {
  const [pairingKey, setPairingKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  useEffect(() => {
    AsyncStorage.getItem('@storage_Key').then((value) => {
      if (value !== null) {
        setPairingKey(value);
        db.ref(value)
          .once('value')
          .then((snapshot) => {
            var obj = snapshot.val();
            setPrescriptions(Object.values(obj));
            console.log(Object.values(obj));
          });
      }
    });
  }, []);
  return (
    <>
      <SafeAreaView style={{height: '100%'}}>
        <View
          style={{
            backgroundColor: '#f6bd60',
            padding: 100,
            textAlign: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 28,
              fontStyle: 'italic',
              fontWeight: 'bold',
              color: '#555555',
            }}>
            Dermirror
          </Text>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.scrollView}>
          {pairingKey == '' && (
            <>
              <Text style={{fontSize: 18, fontStyle: 'italic'}}>
                Enter Pairing key
              </Text>
              <TextInput
                maxLength={5}
                keyboardType="number-pad"
                value={tempKey}
                onChangeText={(text) => {
                  setTempKey(text);
                }}
                style={{
                  fontSize: 18,
                  width: 110,
                  letterSpacing: 10,
                  backgroundColor: '#ededed',
                  marginTop: 10,
                  borderWidth: 3,
                }}></TextInput>

              <View style={{padding: 10}}>
                <Button
                  title="Set"
                  color="#f6bd60"
                  onPress={() => {
                    AsyncStorage.setItem('@storage_Key', tempKey);
                    setPairingKey(tempKey);
                    db.ref(tempKey)
                      .once('value')
                      .then((snapshot) => {
                        var obj = snapshot.val();
                        setPrescriptions(Object.values(obj));
                      });
                  }}></Button>
              </View>
            </>
          )}
          {pairingKey !== '' && (
            <>
              {prescriptions.map((p, i) => (
                <View
                  key={`${p.date}`}
                  style={{
                    borderWidth: 1,
                    width: '100%',
                    backgroundColor: 'white',
                    padding: 10,
                    marginBottom: 15,
                  }}>
                  <Text>Diagnosis: {p.diagnosis}</Text>
                  <Text>
                    Date: {new Date(p.date).toUTCString().split(',')[1].trim()}
                  </Text>
                  <Text>Medication: {p.medication}</Text>
                  <Text>Remarks: {p.remarks}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
        {pairingKey !== '' && (
          <>
            <Button
              color="#f6bd60"
              title="Pair Again"
              onPress={() => {
                AsyncStorage.setItem('@storage_Key', '');
                setPairingKey('');
                setTempKey('');
              }}></Button>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f7ede2',
    padding: 20,
  },
});

export default App;
