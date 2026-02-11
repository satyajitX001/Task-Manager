import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/useTheme';
import scale from '../../../utils/scale';

import type { SignupScreenProps } from '../../../navigation/types';

export function SignupScreen({ navigation }: SignupScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}> 
        <Text style={[styles.title, { color: colors.text }]}>Signup Screen</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Signup flow UI can be added next.</Text>
        <Button onPress={() => navigation.goBack()} title="Back to Login" variant="outline" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  container: {
    borderRadius: scale(16),
    padding: scale(20),
    gap: scale(12),
  },
  title: {
    fontSize: scale(24),
    fontWeight: '700',
  },
  subtitle: {
    fontSize: scale(14),
  },
});
