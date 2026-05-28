import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useEffect } from 'react';

const TechLogisticsApp = () => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <Redirect href="/(auth)" />;
};

export default TechLogisticsApp;
