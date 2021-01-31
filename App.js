/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Image,
  BackgroundImage
} from 'react-native';

import Carousel from './carousel';
import * as firebase from 'firebase';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
// import "firebase/database";

const Stack = createStackNavigator();




firebase.initializeApp({
  apiKey: "AIzaSyBqDu0H6tyyyHRr0jzYRxosgL5s8gP-SVs",
  authDomain: "dermirror-d1d82.firebaseapp.com",
  databaseURL: "https://dermirror-d1d82-default-rtdb.firebaseio.com",
  projectId: "dermirror-d1d82",
  storageBucket: "dermirror-d1d82.appspot.com",
  messagingSenderId: "545961868830",
  appId: "1:545961868830:web:5ddb5cdc12f4461cffb80f"
});

// import app from '@react-native-firebase/app';
// import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = firebase.database();


const PrescriptionComp = (props) => {

  function changeScreen(){
    props.detail(true)
  }

}


const App = () => {
  const [pairingKey, setPairingKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [detailView, setDetailView] = useState(false);

  function detail() {
    setDetailView(true)
  }

  useEffect(() => {
  
    AsyncStorage.getItem('@storage_Key').then((value) => {
      console.log(value)
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
            backgroundImage: "https://drive.google.com/file/d/1rzd4Q5RqxCcKhgT_XOBmGhC3r1kpy84P/view?usp=sharing",
            padding: 100,
            textAlign: 'center',
            alignItems: 'center',
          }}>
          {/* <BackgroundImage source={{ uri: 'assets/dermirro-back.jpeg' }} style={{ width: 40, height: 40 }}>   */}
          <Text
            style={{
              fontSize: 28,
              fontStyle: 'italic',
              fontWeight: 'bold',
              color: '#555555',
            }}>
            Dermirror
          </Text>
          {/* </BackgroundImage> */}
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.scrollView}>
          {pairingKey === '' ? (
            
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
                    console.log(tempKey)
                    db.ref(tempKey)
                      .once('value')
                      .then((snapshot) => {
                        var obj = snapshot.val();
                        setPrescriptions(Object.values(obj));
                        // console.log(prescriptions)
                      });
                  }}></Button>
              </View>
            </>
          ) : (
            <>
            {detailView === true ? (
              <>
              {prescriptions.map((p, i) => (
                <Carousel function={detail}key={`${p.date}`} style={{
                  height:100,
                  }
                } data={p}></Carousel>
              ))}
              </>
            ) : (
              <>
              {prescriptions.map((p, i) => (
      <>
        <View
          key={`${p.date}`}
          style={{
            padding:10,
            flex:1,
            flexDirection:"row",
            width:"100%",
            overflow: "scroll"
          }}
          >
            <Card key={`${p.date}`} style={{
              padding: 10,
            }}>
              <Card.Title title="Prescription" subtitle="Nupur Agarwal" />
              <Card.Content style={{
                paddingBottom: 10
              }}>
                <Card.Cover source={{ uri: `${p.bimage}` }} />
                {/* <Title>Card title</Title> */}
                <Text>Diagnosis: {p.diagnosis}</Text>
                <Text>
                  Date: {new Date(p.date).toUTCString().split(',')[1].trim()}
                </Text>
                <Text>Medication: {p.medication}</Text>
                <Text>Remarks: {p.remarks}</Text>
              </Card.Content>
              <Card.Actions>
                <Button title="More Details" onPress={detail}>Ok</Button>
              </Card.Actions>
            </Card>
            {/* <View
              key={`${p.date}`}
              style={{
                borderWidth: 1,
                width: '70%',
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
                <Text>Image: {p.image}</Text>
            </View> */}
            {/* <View style={{
              borderWidth: 1,
              width: '30%',
              backgroundColor: 'white',
              padding: 10,
              marginBottom: 15,
            }}>
              <Image 
              style={{
                
                height:"100%",
                padding: 10,
                marginBottom:15,
                borderWidth:1,
                backgroundColor: 'white',
              }}
              source={{
                uri: `${p.bimage}`,
              }}/>
            </View> */}
          </View>
        {/* <Button title="More Details">More details</Button> */}
      </>
      ))}
              </>
            )}
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
