import { TaskItemModel } from './types';

export interface ITaskRemoteService {
  fetchTasks(): Promise<TaskItemModel[]>;
  updateTaskCompletion(taskId: string, isCompleted: boolean): Promise<void>;
  editTask(taskId: string, payload: { title: string; details: string }): Promise<void>;
}

const REMOTE_TASK_SEED: TaskItemModel[] = [
  {
    taskId: 'task-1001',
    title: 'Create Firebase project',
    details: 'Set up auth providers and copy config keys to app env.',
    isCompleted: false,
    updatedAt: Date.now() - 4000,
  },
  {
    taskId: 'task-1002',
    title: 'Design login flow',
    details: 'Complete login and signup UI based on the theme system.',
    isCompleted: true,
    updatedAt: Date.now() - 3000,
  },
  {
    taskId: 'task-1003',
    title: 'Build task sync logic',
    details: 'Prepare repository layer for offline-first synchronization.',
    isCompleted: false,
    updatedAt: Date.now() - 2000,
  },
];

const delay = (timeInMs: number) => new Promise((resolve) => setTimeout(resolve, timeInMs));

class MockTaskRemoteService implements ITaskRemoteService {
  private remoteTaskStore = new Map<string, TaskItemModel>(
    REMOTE_TASK_SEED.map((task) => [task.taskId, { ...task }]),
  );

  async fetchTasks(): Promise<TaskItemModel[]> {
    await delay(200);

    return Array.from(this.remoteTaskStore.values())
      .map((task) => ({ ...task }))
      .sort((left, right) => right.updatedAt - left.updatedAt);
  }

  async updateTaskCompletion(taskId: string, isCompleted: boolean): Promise<void> {
    await delay(120);

    const existingTask = this.remoteTaskStore.get(taskId);

    if (!existingTask) {
      return;
    }

    this.remoteTaskStore.set(taskId, {
      ...existingTask,
      isCompleted,
      updatedAt: Date.now(),
    });
  }

  async editTask(taskId: string, payload: { title: string; details: string }): Promise<void> {
    await delay(160);

    const existingTask = this.remoteTaskStore.get(taskId);

    if (!existingTask) {
      return;
    }

    this.remoteTaskStore.set(taskId, {
      ...existingTask,
      title: payload.title,
      details: payload.details,
      updatedAt: Date.now(),
    });
  }
}

export const taskRemoteService = new MockTaskRemoteService();
