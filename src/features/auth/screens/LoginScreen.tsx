import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useTheme } from '../../../theme/useTheme';
import scale from '../../../utils/scale';
import { authActions } from '../authSlice';
import { AuthenticatedUser } from '../types';

import type { LoginScreenProps } from '../../../navigation/types';

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLoginPress = () => {
    const previewEmailUser: AuthenticatedUser = {
      id: 'preview-email-user',
      email,
      fullName: 'Email User',
      avatarUrl: null,
      provider: 'email',
    };

    dispatch(authActions.setAuthenticatedUser(previewEmailUser));
  };

  const handleGoogleLoginPress = () => {
    // TODO: Replace this mock user with Firebase Google sign-in response.
    const previewGoogleUser: AuthenticatedUser = {
      id: 'preview-google-user',
      email: 'google.user@example.com',
      fullName: 'Google User',
      avatarUrl: null,
      provider: 'google',
    };

    dispatch(authActions.setAuthenticatedUser(previewGoogleUser));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Sign in with email or continue with Google.</Text>

          <View style={styles.formContainer}>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <Input
              label="Password"
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
            />
          </View>

          <View style={styles.actionContainer}>
            <Button onPress={handleEmailLoginPress} title="Login with Email" />
            <Button onPress={handleGoogleLoginPress} title="Continue with Google" variant="outline" />
          </View>

          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Create a new account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  card: {
    borderRadius: scale(16),
    padding: scale(20),
    gap: scale(12),
  },
  title: {
    fontSize: scale(28),
    fontWeight: '700',
  },
  subtitle: {
    fontSize: scale(14),
  },
  formContainer: {
    marginTop: scale(8),
    gap: scale(12),
  },
  actionContainer: {
    marginTop: scale(8),
    gap: scale(10),
  },
  linkText: {
    marginTop: scale(4),
    textAlign: 'center',
    fontSize: scale(14),
    fontWeight: '600',
  },
});
