import { SplashScreen, Stack } from 'expo-router';
import '../../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    // INTER
    'Inter_18pt-Light': require('@/assets/fonts/Inter_18pt-Light.ttf'),
    'Inter_18pt-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter_18pt-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),

    // MANROPE
    'Manrope-Light': require('@/assets/fonts/Manrope-Light.ttf'),
    'Manrope-Regular': require('@/assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('@/assets/fonts/Manrope-Medium.ttf'),
    'Manrope-Bold': require('@/assets/fonts/Manrope-Bold.ttf'),

    // POPPINS
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Mientras cargan las fuentes mostramos nada (o un splash)
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'ios_from_right' }}
    />
  );
};

export default RootLayout;
