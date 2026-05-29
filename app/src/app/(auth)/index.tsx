import { View, Text } from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { ImageBackground, Image } from 'expo-image';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');
const imagotipo = require('@/assets/imagotipo.png');

const LoginScreen = () => {
  const safeArea = useSafeAreaInsets();

  return (
    <ImageBackground contentFit="cover" source={bgDark} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="my-20 flex items-center">
          <View>
            <Image
              contentFit="fill"
              source={imagotipo}
              style={{
                height: 200,
                width: 270,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
        <View className="flex items-center">
          <Text className="font-manrope-bold text-5xl">¡Bienvenido!</Text>
        </View>
        <View
          className="absolute w-full items-center"
          style={{ bottom: safeArea.bottom + 10 }}
        >
          <Text className="font-inter text-white">
            Todos los derechos reservados ©
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
