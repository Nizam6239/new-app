import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../App';

// Type navigation prop
type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.190.126.185:5001'
      : 'http://localhost:5001';

  const handleSignUp = async () => {
    if (!email || !password || !repeatPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        email,
        password,
        confirmPassword: repeatPassword,
      });

      Alert.alert(
        'Success',
        response.data.message || 'Registration successful!',
      );
      navigation.navigate('VerifyOTP', { email });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        Alert.alert(
          'Error',
          axiosError.response?.data?.message || 'Something went wrong.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
      console.error('Sign Up Error:', err);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          hidden={false}
          translucent={false}
        />

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/Frame.png')}
              style={styles.logo}
            />
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up your business</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.centered}>
            <Text style={styles.title}>Sign up to find a job</Text>
            <View style={styles.loginRow}>
              <Text>Already have an account? </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FirstandLastName', { email })
                }
              >
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Google Login */}
          <View style={styles.googleLogin}>
            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={require('../../assets/google-color.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Or Line */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Icon
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Repeat Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Repeat Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  secureTextEntry={!repeatPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() =>
                    setRepeatPasswordVisible(!repeatPasswordVisible)
                  }
                  style={styles.eyeIcon}
                >
                  <Icon
                    name={repeatPasswordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you confirm that you agree to{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => console.log('Terms & Conditions clicked')}
                >
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => console.log('Privacy Policy clicked')}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
  centered: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginLink: {
    color: 'green',
    fontWeight: '600',
  },
  googleLogin: {
    marginTop: 30,
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingRight: 45, // space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    marginVertical: 10,
  },
  termsText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 18,
  },
});
