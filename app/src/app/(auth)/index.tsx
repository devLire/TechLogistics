import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import { ImageBackground, Image } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/components/ThemedText';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedInput } from '@/presentation/components/ThemedInput';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import { regularExps } from '@/config/regular-exp';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');
const imagotipo = require('@/assets/imagotipo.png');

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const safeArea = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Campos obligatorios', {
        description: 'Por favor, llena todos los campos.',
      });
      return;
    }
    if (!regularExps.email.test(form.email)) {
      toast.error('Email inválido', {
        description: 'El email tiene que ser un email válido.',
      });
      return;
    }
    if (form.password.trim().length < 6) {
      toast.error('Contraseña inválida', {
        description: 'La contraseña tiene que tener más de 5 caracteres',
      });
      return;
    }

    const isValid = await login(form.email, form.password);

    if (!isValid) {
      toast.error('Error al iniciar sesión', {
        description: 'Credenciales inválidas',
      });
      return;
    }

    router.replace('/home');
  };

  return (
    <ImageBackground
      contentFit="cover"
      source={colorScheme === 'light' ? bgLight : bgDark}
      style={{ flex: 1 }}
    >
      {/* Imagotipo */}
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

      {/* Bienvenida */}
      <View className="flex items-center">
        <ThemedText type="heading">¡Bienvenido!</ThemedText>
      </View>

      {/* Inputs */}
      <View className="mx-5 mt-20 gap-y-10">
        <ThemedInput
          autoCapitalize="none"
          iconName="mail-outline"
          keyboardType="email-address"
          label="Correo electrónico"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <ThemedInput
          secureTextEntry
          autoCapitalize="none"
          label="Contraseña"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Ionicons
                  color={color}
                  name="lock-closed-outline"
                  size={size}
                />
              )}
            />
          }
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
      </View>
      <View className="mt-10 items-center px-20">
        <ThemedButton onPress={handleLogin}>Iniciar sesión</ThemedButton>
      </View>
      <View
        className="absolute w-full items-center"
        style={{ bottom: safeArea.bottom + 10 }}
      >
        <ThemedText className="text-text-inverse dark:text-text" type="normal">
          Todos los derechos reservados ©
        </ThemedText>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
