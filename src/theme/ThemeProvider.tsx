import React, { createContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { ThemeColors, ThemeMode } from './colors';
import { darkColors } from './dark';
import { lightColors } from './light';

export type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemTheme === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';

    return {
      mode,
      colors: isDark ? darkColors : lightColors,
      isDark,
      toggleTheme: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
      setThemeMode: setMode,
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
