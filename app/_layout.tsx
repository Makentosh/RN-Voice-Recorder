import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme as DefaultDarkTheme,
  MD3LightTheme as DefaultLightTheme,
  PaperProvider,
} from 'react-native-paper';
import { Colors } from '@/constants/Colors';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout () {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const paperTheme =
      colorScheme === 'dark'
          ? { ...DefaultDarkTheme, colors: Colors.dark }
          : { ...DefaultLightTheme, colors: Colors.light };


  useEffect(() => {
    if ( loaded ) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if ( !loaded ) {
    return null;
  }

  return (
      <PaperProvider theme={ paperTheme }>
        <Stack>
          <Stack.Screen name="index" options={ { headerShown: false } }/>
          <Stack.Screen name={ '+not-found' }/>
        </Stack>
        <StatusBar style="auto"/>
      </PaperProvider>
  );
}

