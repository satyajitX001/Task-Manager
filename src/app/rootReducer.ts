import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth/authSlice';
import { tasksReducer } from '../features/tasks/taskSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
