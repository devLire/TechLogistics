import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  className?: string;
  margin?: boolean;
  safe?: boolean;
  bgColor?: string;
}

export const ThemedView = ({
  style,
  className,
  margin = false,
  children,
  safe = false,
  bgColor,
  ...rest
}: Props) => {
  const themeBackgroundColor = useTheme({}, 'background');
  const backgroundColor = bgColor ?? themeBackgroundColor;
  const safeArea = useSafeAreaInsets();

  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: backgroundColor,
          flex: 1,
          paddingTop: safe ? safeArea.top : 0,
          marginHorizontal: margin ? 10 : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
