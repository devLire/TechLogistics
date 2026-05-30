import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { useAuthStore } from '@/stores/auth/useAuthStore';

const HomeScreen = () => {
  const { logout } = useAuthStore();

  return (
    <ThemedView>
      <ThemedText className="text-3xl font-bold">Hola</ThemedText>
      <ThemedButton onPress={logout}>Cerrar sesión</ThemedButton>
    </ThemedView>
  );
};

export default HomeScreen;
