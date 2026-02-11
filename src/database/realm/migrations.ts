import type Realm from 'realm';

export const TASK_REALM_SCHEMA_VERSION = 1;

export const onTaskRealmMigration: Realm.Configuration['onMigration'] = () => {
  // Reserved for future Realm schema changes.
};
