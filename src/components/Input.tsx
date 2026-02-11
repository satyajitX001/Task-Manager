import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import scale from '../utils/scale';

type InputProps = TextInputProps & {
  label?: string;
};

export function Input({ label, style, ...rest }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.primary,
          },
          style,
        ]}
        placeholderTextColor={colors.text}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: scale(8),
  },
  label: {
    fontSize: scale(13),
    fontWeight: '600',
  },
  input: {
    minHeight: scale(48),
    borderRadius: scale(12),
    borderWidth: scale(1),
    paddingHorizontal: scale(14),
    fontSize: scale(14),
  },
});
