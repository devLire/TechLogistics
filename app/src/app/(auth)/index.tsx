import { View, Text, TextInput } from 'react-native';
import { ImageBackground } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

const bgLight = require('@/assets/loginLightBackground.png');

const LoginScreen = () => {
  return (
    <ImageBackground contentFit="cover" source={bgLight} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Text>Logo</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="font-manrope-bold text-5xl">¡Bienvenido!</Text>
        </View>
        <View className="flex-1"></View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
