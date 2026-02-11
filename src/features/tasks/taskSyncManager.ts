import { networkService } from '../../services/networkService';
import { taskRepository, SyncRunResult } from './taskRepository';

type SyncListener = (result: SyncRunResult) => void;

class TaskSyncManager {
  private unsubscribeNetworkListener: (() => void) | null = null;
  private isSyncInProgress = false;

  startAutoSync(listener: SyncListener): void {
    if (this.unsubscribeNetworkListener) {
      return;
    }

    this.unsubscribeNetworkListener = networkService.subscribe((isOnline) => {
      if (!isOnline) {
        return;
      }

      void this.runSync(listener);
    });
  }

  stopAutoSync(): void {
    if (this.unsubscribeNetworkListener) {
      this.unsubscribeNetworkListener();
      this.unsubscribeNetworkListener = null;
    }
  }

  async runSync(listener?: SyncListener): Promise<SyncRunResult> {
    if (this.isSyncInProgress) {
      return {
        syncedActionsCount: 0,
        pendingActionsCount: await taskRepository.getPendingSyncCount(),
      };
    }

    this.isSyncInProgress = true;

    try {
      const result = await taskRepository.syncPendingActions();
      listener?.(result);
      return result;
    } finally {
      this.isSyncInProgress = false;
    }
  }
}

export const taskSyncManager = new TaskSyncManager();
