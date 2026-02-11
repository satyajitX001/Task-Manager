import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import {
  CreateTaskPayload,
  SetTaskCompletionPayload,
  TaskItemModel,
  TasksState,
  UpdateTaskPayload,
} from './types';

const fallbackTasksState: TasksState = {
  taskList: [],
  isSyncing: false,
  pendingSyncCount: 0,
  hasLoadedRemoteTasks: false,
};

const initialState: TasksState = fallbackTasksState;

const generateTaskId = () => `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskList: (state, action: PayloadAction<TaskItemModel[]>) => {
      state.taskList = [...action.payload].sort((left, right) => right.updatedAt - left.updatedAt);
      state.hasLoadedRemoteTasks = true;
    },
    addTask: (state, action: PayloadAction<CreateTaskPayload>) => {
      const now = Date.now();
      const nextTask: TaskItemModel = {
        taskId: generateTaskId(),
        title: action.payload.title,
        details: action.payload.details,
        isCompleted: action.payload.isCompleted ?? false,
        updatedAt: now,
      };

      state.taskList.unshift(nextTask);
    },
    setTaskCompletionLocal: (state, action: PayloadAction<SetTaskCompletionPayload>) => {
      const matchedTask = state.taskList.find((task) => task.taskId === action.payload.taskId);

      if (!matchedTask) {
        return;
      }

      matchedTask.isCompleted = action.payload.isCompleted;
      matchedTask.updatedAt = Date.now();
    },
    updateTaskLocal: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const matchedTask = state.taskList.find((task) => task.taskId === action.payload.taskId);

      if (!matchedTask) {
        return;
      }

      matchedTask.title = action.payload.title;
      matchedTask.details = action.payload.details;
      matchedTask.updatedAt = Date.now();
    },
    setTasksSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    setPendingSyncCount: (state, action: PayloadAction<number>) => {
      state.pendingSyncCount = action.payload;
    },
  },
});

const selectTasksState = (state: RootState): TasksState => {
  const tasksState = (state as RootState & { tasks?: TasksState }).tasks;

  if (!tasksState || typeof tasksState !== 'object') {
    return fallbackTasksState;
  }

  return tasksState;
};

export const selectTaskList = (state: RootState) => selectTasksState(state).taskList;
export const selectTaskById = (state: RootState, taskId: string) =>
  selectTasksState(state).taskList.find((task) => task.taskId === taskId) ?? null;
export const selectTasksSyncing = (state: RootState) => selectTasksState(state).isSyncing;
export const selectPendingSyncCount = (state: RootState) => selectTasksState(state).pendingSyncCount;

export const taskActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
