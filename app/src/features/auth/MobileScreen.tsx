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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import axios from 'axios';

// ✅ Route type for LocationRouteProp
type MobileRouteProp = RouteProp<RootStackParamList, 'Mobile'>;

// ✅ Navigation type for Location
type MobileNavProp = NativeStackNavigationProp<RootStackParamList, 'Location'>;

const MobileScreen = () => {
  const route = useRoute<MobileRouteProp>();
  const navigation = useNavigation<MobileNavProp>();
  const [zipCode, setZipCode] = useState('');

  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.190.126.185:5001'
      : 'http://localhost:5001';

  const handleNext = async () => {
    if (!zipCode) {
      Alert.alert('Missing Information', 'Please enter your zip code.');
      return;
    }
    // Navigate to next location screen
    try {
      const email = route.params.email; // get email from previous screen
      const response = await axios.post(`${BASE_URL}/api/auth/zip`, {
        email,
        zipCode,
      });
      console.log('Location saved:', response.data);
      // your next screen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Frame.png')}
              style={styles.logo}
            />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            {Array.from({ length: 5 }).map((_, i) => {
              let dashStyle = styles.dashInactive;
              if (i < 1) dashStyle = styles.dashCompleted;
              if (i === 1) dashStyle = styles.dashActive;
              return <View key={i} style={[styles.dash, dashStyle]} />;
            })}
          </View>

          {/* Step Info */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepText}>STEP 2/5</Text>
          </View>

          {/* Title & Description */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Enter Your Location</Text>
            <Text style={styles.headerDescription}>
              We will display the most relevant jobs based on your location
            </Text>
          </View>

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Zip Code</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your zip code"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MobileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  dash: {
    width: 40,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 6,
  },
  dashCompleted: {
    backgroundColor: 'green',
  },
  dashActive: {
    backgroundColor: '#555',
  },
  dashInactive: {
    backgroundColor: '#ddd',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  stepText: {
    color: '#7c7474ff',
    fontSize: 14,
  },
  headerTextContainer: {
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  headerDescription: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#00C851',
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
