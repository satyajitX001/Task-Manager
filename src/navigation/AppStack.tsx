import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TaskDetailScreen } from '../features/tasks/screens/TaskDetailScreen';
import { TaskListScreen } from '../features/tasks/screens/TaskListScreen';
import { useTheme } from '../theme/useTheme';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        freezeOnBlur: false,
        animation: 'none',
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'My Tasks' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Detail' }} />
    </Stack.Navigator>
  );
}
