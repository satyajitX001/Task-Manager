import AsyncStorage from '@react-native-async-storage/async-storage';

import { PendingTaskSyncAction } from '../../features/tasks/types';
import { TASK_REALM_SCHEMA_VERSION, onTaskRealmMigration } from './migrations';
import { PENDING_TASK_SYNC_ACTION_SCHEMA_NAME, pendingTaskSyncActionSchema } from './schema';

const FALLBACK_QUEUE_STORAGE_KEY = 'task-manager:fallback-pending-sync-queue';

type RealmInstance = {
  objects: (schemaName: string) => any;
  objectForPrimaryKey: (schemaName: string, primaryKey: string) => any;
  write: (transaction: () => void) => void;
  create: (schemaName: string, object: Record<string, unknown>) => void;
  delete: (objects: unknown) => void;
  close: () => void;
};

type RealmStatic = {
  open: (configuration: Record<string, unknown>) => Promise<RealmInstance>;
};

let cachedRealmInstance: RealmInstance | null = null;
let hasRealmSupport = true;

const getRealmModule = (): RealmStatic | null => {
  try {
    const realmPackage = require('realm');
    return (realmPackage.default ?? realmPackage) as RealmStatic;
  } catch {
    return null;
  }
};

const openTaskRealm = async (): Promise<RealmInstance | null> => {
  if (!hasRealmSupport) {
    return null;
  }

  if (cachedRealmInstance) {
    return cachedRealmInstance;
  }

  const RealmModule = getRealmModule();

  if (!RealmModule) {
    hasRealmSupport = false;
    return null;
  }

  try {
    cachedRealmInstance = await RealmModule.open({
      path: 'task-manager.realm',
      schema: [pendingTaskSyncActionSchema],
      schemaVersion: TASK_REALM_SCHEMA_VERSION,
      onMigration: onTaskRealmMigration,
    });

    return cachedRealmInstance;
  } catch {
    hasRealmSupport = false;
    return null;
  }
};

const sanitizePendingAction = (value: unknown): PendingTaskSyncAction | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Record<string, unknown>;

  if (
    typeof raw.queueId !== 'string' ||
    typeof raw.actionType !== 'string' ||
    typeof raw.taskId !== 'string' ||
    typeof raw.createdAt !== 'number'
  ) {
    return null;
  }

  return {
    queueId: raw.queueId,
    actionType: raw.actionType as PendingTaskSyncAction['actionType'],
    taskId: raw.taskId,
    title: typeof raw.title === 'string' ? raw.title : undefined,
    details: typeof raw.details === 'string' ? raw.details : undefined,
    isCompleted: typeof raw.isCompleted === 'boolean' ? raw.isCompleted : undefined,
    createdAt: raw.createdAt,
  };
};

const readFallbackQueue = async (): Promise<PendingTaskSyncAction[]> => {
  const storedValue = await AsyncStorage.getItem(FALLBACK_QUEUE_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedValue) as unknown[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((value) => sanitizePendingAction(value))
      .filter((value): value is PendingTaskSyncAction => value !== null)
      .sort((left, right) => left.createdAt - right.createdAt);
  } catch {
    return [];
  }
};

const writeFallbackQueue = async (queue: PendingTaskSyncAction[]): Promise<void> => {
  await AsyncStorage.setItem(FALLBACK_QUEUE_STORAGE_KEY, JSON.stringify(queue));
};

const mapRealmItem = (value: any): PendingTaskSyncAction => ({
  queueId: String(value.queueId),
  actionType: String(value.actionType) as PendingTaskSyncAction['actionType'],
  taskId: String(value.taskId),
  title: typeof value.title === 'string' ? value.title : undefined,
  details: typeof value.details === 'string' ? value.details : undefined,
  isCompleted: typeof value.isCompleted === 'boolean' ? value.isCompleted : undefined,
  createdAt: Number(value.createdAt),
});

export const queuePendingTaskSyncAction = async (action: PendingTaskSyncAction): Promise<void> => {
  const realm = await openTaskRealm();

  if (realm) {
    realm.write(() => {
      realm.create(PENDING_TASK_SYNC_ACTION_SCHEMA_NAME, {
        queueId: action.queueId,
        actionType: action.actionType,
        taskId: action.taskId,
        title: action.title ?? null,
        details: action.details ?? null,
        isCompleted: typeof action.isCompleted === 'boolean' ? action.isCompleted : null,
        createdAt: action.createdAt,
      });
    });

    return;
  }

  const queue = await readFallbackQueue();
  queue.push(action);
  queue.sort((left, right) => left.createdAt - right.createdAt);
  await writeFallbackQueue(queue);
};

export const getPendingTaskSyncActions = async (): Promise<PendingTaskSyncAction[]> => {
  const realm = await openTaskRealm();

  if (realm) {
    const realmItems = realm.objects(PENDING_TASK_SYNC_ACTION_SCHEMA_NAME).sorted('createdAt', false);
    return Array.from(realmItems).map((item) => mapRealmItem(item));
  }

  return readFallbackQueue();
};

export const removePendingTaskSyncActions = async (queueIds: string[]): Promise<void> => {
  if (queueIds.length === 0) {
    return;
  }

  const realm = await openTaskRealm();

  if (realm) {
    realm.write(() => {
      queueIds.forEach((queueId) => {
        const item = realm.objectForPrimaryKey(PENDING_TASK_SYNC_ACTION_SCHEMA_NAME, queueId);

        if (item) {
          realm.delete(item);
        }
      });
    });

    return;
  }

  const queue = await readFallbackQueue();
  const queueIdSet = new Set(queueIds);
  const nextQueue = queue.filter((action) => !queueIdSet.has(action.queueId));
  await writeFallbackQueue(nextQueue);
};

export const clearPendingTaskSyncActions = async (): Promise<void> => {
  const realm = await openTaskRealm();

  if (realm) {
    realm.write(() => {
      const items = realm.objects(PENDING_TASK_SYNC_ACTION_SCHEMA_NAME);
      realm.delete(items);
    });

    return;
  }

  await AsyncStorage.removeItem(FALLBACK_QUEUE_STORAGE_KEY);
};

export const getPendingTaskSyncActionCount = async (): Promise<number> => {
  const realm = await openTaskRealm();

  if (realm) {
    return realm.objects(PENDING_TASK_SYNC_ACTION_SCHEMA_NAME).length;
  }

  const queue = await readFallbackQueue();
  return queue.length;
};
