import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// ✅ Route type for VerifyOTP
type VerifyOtpRouteProp = RouteProp<RootStackParamList, 'VerifyOTP'>;

// ✅ Navigation type for VerifyOTP
type VerifyOtpNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerifyOTP'
>;

const VerifyOTPScreen = () => {
  const route = useRoute<VerifyOtpRouteProp>();
  const navigation = useNavigation<VerifyOtpNavProp>();
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.190.126.185:5001'
      : 'http://localhost:5001';

  // ✅ Auto verify OTP once 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && !verifying) {
      handleVerifyOtp(otp);
    }
  }, [otp]);

  // ✅ Verify OTP API
  const handleVerifyOtp = async (enteredOtp: string) => {
    setVerifying(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Email verified successfully!');
        // 👇 Navigate to UserDetails after successful verification
        navigation.navigate('FirstandLastName', { email });
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
        setOtp(''); // Clear OTP if invalid
      }
    } catch (error) {
      console.error('OTP Verify Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setVerifying(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'A new OTP has been sent to your email.');
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Unable to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Logo */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/Frame.png')}
              style={styles.logo}
            />
          </View>

          {/* Title */}
          <View style={styles.centered}>
            <Text style={styles.title}>Confirm your email</Text>
            <Text style={styles.centerText}>
              Please enter the code we've sent to {email}
            </Text>

            {/* OTP Input */}
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              textAlign="center"
              editable={!verifying}
            />

            {/* Resend OTP */}
            <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
              <Text
                style={[styles.resendText, { opacity: resending ? 0.6 : 1 }]}
              >
                {resending ? 'Resending...' : 'Send code again'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  centered: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  centerText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    width: '90%',
  },
  otpInput: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 28,
    letterSpacing: 14,
    color: '#000',
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 30,
  },
  resendText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '500',
  },
});
