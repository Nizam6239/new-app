import { StyleSheet } from 'react-native';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VerifyOTPScreen from './features/auth/VerifyOTPScreen';
import SignUpScreen from './features/auth/SignUpScreen';
import FirstandLastNameScreen from './features/auth/FirstandLastNameScreen';
import LocationScreen from './features/auth/LocationScreen';
import MobileScreen from './features/auth/MobileScreen';

export type RootStackParamList = {
  FirstandLastName: { email: string };
  VerifyOTP: { email: string };
  Signup: undefined;
  Location: { email: string };
  mobile: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Signup"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen
            name="FirstandLastName"
            component={FirstandLastNameScreen}
          />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="mobile" component={MobileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
