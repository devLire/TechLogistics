import type { TextProps } from 'react-native';
import { Text } from 'react-native';

type TextType = 'normal' | 'heading' | 'h1' | 'h2' | 'semi-bold' | 'link';

interface Props extends TextProps {
  className?: string;
  type?: TextType;
}

export const ThemedText = ({
  className,
  type = 'normal',
  children,
  ...rest
}: Props) => {
  const getTextClass = () => {
    switch (type) {
      case 'normal':
        return 'font-inter';
      case 'heading':
        return 'text-5xl font-manrope-bold';
      case 'h1':
        return 'text-3xl font-manrope-bold';
      case 'h2':
        return 'text-xl font-manrope-medium';
      case 'semi-bold':
        return 'font-bold';
      case 'link':
        return 'font-normal underline';
    }
  };

  const textClass = getTextClass();

  return (
    <Text className={['text-text', textClass, className].join(' ')} {...rest}>
      {children}
    </Text>
  );
};
