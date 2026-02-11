import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
};

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;
export type TaskListScreenProps = NativeStackScreenProps<AppStackParamList, 'TaskList'>;
export type TaskDetailScreenProps = NativeStackScreenProps<AppStackParamList, 'TaskDetail'>;
