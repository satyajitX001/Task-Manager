import {
  getPendingTaskSyncActionCount,
  getPendingTaskSyncActions,
  queuePendingTaskSyncAction,
  removePendingTaskSyncActions,
} from '../../database/realm/realm';
import { networkService } from '../../services/networkService';
import { taskRemoteService } from './taskService';
import { PendingTaskSyncAction, TaskItemModel } from './types';

export type QueueOperationResult = {
  didQueueAction: boolean;
  pendingActionsCount: number;
};

export type SyncRunResult = {
  syncedActionsCount: number;
  pendingActionsCount: number;
};

const createQueueId = () => `queue-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

class TaskRepository {
  async fetchTasksFromBackend(): Promise<TaskItemModel[]> {
    const isOnline = await networkService.isOnline();

    if (!isOnline) {
      return [];
    }

    try {
      return taskRemoteService.fetchTasks();
    } catch {
      return [];
    }
  }

  async toggleTaskCompletion(taskId: string, isCompleted: boolean): Promise<QueueOperationResult> {
    const pendingAction: PendingTaskSyncAction = {
      queueId: createQueueId(),
      actionType: 'TOGGLE_TASK_COMPLETION',
      taskId,
      isCompleted,
      createdAt: Date.now(),
    };

    const isOnline = await networkService.isOnline();

    if (isOnline) {
      try {
        await taskRemoteService.updateTaskCompletion(taskId, isCompleted);
        return {
          didQueueAction: false,
          pendingActionsCount: await getPendingTaskSyncActionCount(),
        };
      } catch {
        // Fall through and queue the action.
      }
    }

    await this.queueWithMerge(pendingAction);

    return {
      didQueueAction: true,
      pendingActionsCount: await getPendingTaskSyncActionCount(),
    };
  }

  async editTask(taskId: string, title: string, details: string): Promise<QueueOperationResult> {
    const pendingAction: PendingTaskSyncAction = {
      queueId: createQueueId(),
      actionType: 'EDIT_TASK',
      taskId,
      title,
      details,
      createdAt: Date.now(),
    };

    const isOnline = await networkService.isOnline();

    if (isOnline) {
      try {
        await taskRemoteService.editTask(taskId, { title, details });
        return {
          didQueueAction: false,
          pendingActionsCount: await getPendingTaskSyncActionCount(),
        };
      } catch {
        // Fall through and queue the action.
      }
    }

    await this.queueWithMerge(pendingAction);

    return {
      didQueueAction: true,
      pendingActionsCount: await getPendingTaskSyncActionCount(),
    };
  }

  async syncPendingActions(): Promise<SyncRunResult> {
    const isOnline = await networkService.isOnline();

    if (!isOnline) {
      return {
        syncedActionsCount: 0,
        pendingActionsCount: await getPendingTaskSyncActionCount(),
      };
    }

    const pendingActions = await getPendingTaskSyncActions();
    const syncedQueueIds: string[] = [];

    for (const action of pendingActions) {
      try {
        if (action.actionType === 'TOGGLE_TASK_COMPLETION' && typeof action.isCompleted === 'boolean') {
          await taskRemoteService.updateTaskCompletion(action.taskId, action.isCompleted);
          syncedQueueIds.push(action.queueId);
          continue;
        }

        if (action.actionType === 'EDIT_TASK' && action.title && action.details) {
          await taskRemoteService.editTask(action.taskId, {
            title: action.title,
            details: action.details,
          });
          syncedQueueIds.push(action.queueId);
          continue;
        }
      } catch {
        // Preserve ordering: stop processing at first failure.
        break;
      }
    }

    await removePendingTaskSyncActions(syncedQueueIds);

    return {
      syncedActionsCount: syncedQueueIds.length,
      pendingActionsCount: await getPendingTaskSyncActionCount(),
    };
  }

  async getPendingSyncCount(): Promise<number> {
    return getPendingTaskSyncActionCount();
  }

  private async queueWithMerge(nextAction: PendingTaskSyncAction): Promise<void> {
    const pendingActions = await getPendingTaskSyncActions();

    const previousAction = [...pendingActions]
      .reverse()
      .find(
        (action) =>
          action.taskId === nextAction.taskId &&
          action.actionType === nextAction.actionType,
      );

    if (previousAction) {
      await removePendingTaskSyncActions([previousAction.queueId]);
      nextAction.queueId = previousAction.queueId;
    }

    await queuePendingTaskSyncAction(nextAction);
  }
}

export const taskRepository = new TaskRepository();
