import type Realm from 'realm';

export const PENDING_TASK_SYNC_ACTION_SCHEMA_NAME = 'PendingTaskSyncAction';

export const pendingTaskSyncActionSchema: Realm.ObjectSchema = {
  name: PENDING_TASK_SYNC_ACTION_SCHEMA_NAME,
  primaryKey: 'queueId',
  properties: {
    queueId: 'string',
    actionType: 'string',
    taskId: 'string',
    title: 'string?',
    details: 'string?',
    isCompleted: 'bool?',
    createdAt: 'int',
  },
};
