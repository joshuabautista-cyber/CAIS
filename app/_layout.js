import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { cssInterop } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import '../global.css';

// Configure LinearGradient to work with NativeWind
cssInterop(LinearGradient, {
  className: 'style',
});

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors if splash screen is not available
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Black': require('../assets/fonts/Montserrat-Black.ttf'),
    'Montserrat-BlackItalic': require('../assets/fonts/Montserrat-BlackItalic.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-BoldItalic': require('../assets/fonts/Montserrat-BoldItalic.ttf'),
    'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-ExtraBoldItalic': require('../assets/fonts/Montserrat-ExtraBoldItalic.ttf'),
    'Montserrat-ExtraLight': require('../assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-ExtraLightItalic': require('../assets/fonts/Montserrat-ExtraLightItalic.ttf'),
    'Montserrat-Italic': require('../assets/fonts/Montserrat-Italic.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-LightItalic': require('../assets/fonts/Montserrat-LightItalic.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-MediumItalic': require('../assets/fonts/Montserrat-MediumItalic.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-SemiBoldItalic': require('../assets/fonts/Montserrat-SemiBoldItalic.ttf'),
    'Montserrat-Thin': require('../assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-ThinItalic': require('../assets/fonts/Montserrat-ThinItalic.ttf'),
  });

  useEffect(() => {
    // Hide splash screen once fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors - splash screen may already be hidden
      });
    }
  }, [fontsLoaded]);

  // Keep splash screen visible while fonts load
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for all screens
      }}
    >
      {/* Login/Index screen */}
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Main tab navigation - your home, profile, grades, etc. */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      
      {/* Modules screens */}
      <Stack.Screen 
        name="(modules)" 
        options={{ 
          headerShown: false 
        }} 
      />
      
      {/* Settings stack - edit profile, change password */}
      <Stack.Screen 
        name="(settings)" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal',
          contentStyle: { backgroundColor: 'transparent' },
        }} 
      />
    </Stack>
  );
}