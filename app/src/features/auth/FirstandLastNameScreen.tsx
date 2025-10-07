import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// ✅ Route type for FirstandLastNameRouteProp
type FirstandLastNameRouteProp = RouteProp<
  RootStackParamList,
  'FirstandLastName'
>;

// ✅ Navigation type for FirstandLastName
type FirstandLastNameNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'FirstandLastName'
>;

const FirstandLastNameScreen = () => {
  const route = useRoute<FirstandLastNameRouteProp>();
  const navigation = useNavigation<FirstandLastNameNavProp>();
  const { email } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.190.126.185:5001'
      : 'http://localhost:5001';

  const handleNext = async () => {
    if (!firstName || !lastName) {
      Alert.alert(
        'Missing Information',
        'Please enter both first and last name.',
      );
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/name`, {
        email,
        firstName,
        lastName,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Name saved successfully!');
        // ✅ Navigate to next Screen
        navigation.navigate('Location', { email });
      } else {
        Alert.alert('Error', 'Failed to save name. Please try again.');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Server error');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Logo */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/Frame.png')}
              style={styles.logo}
            />
          </View>

          {/* Progress Bar */}
          <View style={styles.containerHorizontalLine}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dash,
                  i === 0 ? styles.activeDash : styles.inactiveDash,
                ]}
              />
            ))}
          </View>

          <View style={styles.centered}>
            <Text style={styles.step}>STEP 1/5</Text>
          </View>

          {/* Title */}
          <View style={styles.centered}>
            <Text style={styles.title}>
              Welcome to ShiftQuest! Let's take a few steps to complete your
              profile.
            </Text>
          </View>

          <View style={styles.first}>
            <Text style={styles.firstPlease}>
              First, please enter your name
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.nameContainer}>
            <View style={styles.firstName}>
              <Text style={styles.firstNameText}>First Name</Text>
              <TextInput
                style={styles.firstNameInputField}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.firstName}>
              <Text style={styles.firstNameText}>Last Name</Text>
              <TextInput
                style={styles.firstNameInputField}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </ScrollView>

        {/* ✅ Green Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default FirstandLastNameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  centered: {
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  containerHorizontalLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  dash: {
    width: 40,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginHorizontal: 6,
  },
  step: {
    marginTop: 30,
    color: '#7c7474ff',
  },
  activeDash: {
    backgroundColor: '#555',
  },
  inactiveDash: {
    backgroundColor: '#ddd',
  },
  first: {
    alignItems: 'center',
  },
  firstPlease: {
    fontWeight: '400',
  },
  nameContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  firstName: {
    marginBottom: 20,
  },
  firstNameText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginBottom: 8,
  },
  firstNameInputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#00C851', // ✅ Green button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
