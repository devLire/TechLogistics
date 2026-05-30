import type { ComponentProps } from 'react';
import { TextInput } from 'react-native-paper';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

interface Props extends ComponentProps<typeof TextInput> {
  className?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const ThemedInput = ({
  className,
  iconName,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const themePrimary = useTheme({}, 'primary');
  const themeOutline = useTheme({}, 'secondary');
  const themeTextMuted = useTheme({}, 'textMuted');
  const themeSurface = useTheme({}, 'surface');

  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      className={`font-inter text-text ${className ?? ''}`}
      left={
        iconName ? (
          <TextInput.Icon
            icon={({ size, color }) => (
              <Ionicons color={color} name={iconName} size={size} />
            )}
            style={{ backgroundColor: 'transparent' }}
          />
        ) : undefined
      }
      mode="outlined"
      outlineStyle={{
        borderRadius: 14,
        borderColor: isFocused ? themePrimary : themeOutline,
        borderWidth: isFocused ? 2 : 1,
      }}
      style={{
        fontSize: 15,
        backgroundColor: themeSurface,
      }}
      theme={{
        colors: {
          onSurfaceVariant: themeTextMuted,
          primary: themePrimary,
          background: themeSurface,
        },
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
      }}
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
      }}
      {...rest}
    />
  );
};
