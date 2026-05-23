import { Stack } from 'expo-router';
import '../../global.css';

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true, animation: 'ios_from_right' }} />
  );
};

export default RootLayout;
