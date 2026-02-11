import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { useTheme } from '../theme/useTheme';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { colors, isDark } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      primary: colors.primary,
      border: colors.surface,
      notification: colors.primary,
    },
  };

  return <NavigationContainer theme={navigationTheme}>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>;
}
