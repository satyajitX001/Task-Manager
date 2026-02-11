import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './src/app/AppProviders';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <AppProviders>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AppProviders>
  );
}
