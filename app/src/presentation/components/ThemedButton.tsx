import type { ComponentProps } from 'react';
import { Button, TextInput } from 'react-native-paper';
import type Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/use-theme';

interface Props extends ComponentProps<typeof Button> {
  className?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const ThemedButton = ({ className, children, ...rest }: Props) => {
  const themePrimary = useTheme({}, 'primary');
  const themeSurface = useTheme({}, 'surface');

  const rippleColor = `${themePrimary}20`;

  return (
    <Button
      className={className}
      contentStyle={{
        paddingVertical: 5,
        paddingHorizontal: 5,
        width: '100%',
      }}
      labelStyle={{ color: themePrimary }}
      mode="contained"
      rippleColor={rippleColor}
      style={{
        backgroundColor: themeSurface,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};
