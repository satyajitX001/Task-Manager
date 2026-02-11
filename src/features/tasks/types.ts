export type TaskItemModel = {
  taskId: string;
  title: string;
  details: string;
  isCompleted: boolean;
  updatedAt: number;
};

export type CreateTaskPayload = {
  title: string;
  details: string;
  isCompleted?: boolean;
};

export type UpdateTaskPayload = {
  taskId: string;
  title: string;
  details: string;
};

export type SetTaskCompletionPayload = {
  taskId: string;
  isCompleted: boolean;
};

export type TaskSyncActionType = 'TOGGLE_TASK_COMPLETION' | 'EDIT_TASK';

export type PendingTaskSyncAction = {
  queueId: string;
  actionType: TaskSyncActionType;
  taskId: string;
  title?: string;
  details?: string;
  isCompleted?: boolean;
  createdAt: number;
};

export type TasksState = {
  taskList: TaskItemModel[];
  isSyncing: boolean;
  pendingSyncCount: number;
  hasLoadedRemoteTasks: boolean;
};
