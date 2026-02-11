import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { useTheme } from '../theme/useTheme';
import scale from '../utils/scale';

type ButtonVariant = 'primary' | 'outline';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
};

export function Button({ title, variant = 'primary', style, ...rest }: ButtonProps) {
  const { colors } = useTheme();

  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: isOutline ? 'transparent' : colors.primary,
          borderColor: colors.primary,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          {
            color: isOutline ? colors.primary : colors.background,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: scale(48),
    borderRadius: scale(12),
    borderWidth: scale(1),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  text: {
    fontSize: scale(15),
    fontWeight: '700',
  },
});
