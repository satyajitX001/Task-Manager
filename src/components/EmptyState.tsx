import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import scale from '../utils/scale';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(14),
    padding: scale(16),
    alignItems: 'center',
    gap: scale(8),
  },
  title: {
    fontSize: scale(16),
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: scale(13),
    opacity: 0.85,
  },
});
