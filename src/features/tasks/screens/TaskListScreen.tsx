import React, { useCallback, useEffect } from 'react';
import { FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { EmptyState } from '../../../components/EmptyState';
import { authActions, selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTheme } from '../../../theme/useTheme';
import scale from '../../../utils/scale';
import { TaskItem } from '../components/TaskItem';
import { taskRepository } from '../taskRepository';
import { SyncRunResult } from '../taskRepository';
import {
  selectPendingSyncCount,
  selectTaskList,
  selectTasksSyncing,
  taskActions,
} from '../taskSlice';
import { taskSyncManager } from '../taskSyncManager';
import { TaskItemModel } from '../types';

import type { TaskListScreenProps } from '../../../navigation/types';

type TaskListHeaderProps = {
  userEmail: string;
  isOnline: boolean;
  pendingSyncCount: number;
  isSyncing: boolean;
  onSignOut: () => void;
};

function TaskListHeader({
  userEmail,
  isOnline,
  pendingSyncCount,
  isSyncing,
  onSignOut,
}: TaskListHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Signed in as: {userEmail}</Text>
      <Text style={[styles.syncText, { color: colors.primary }]}>
        {isOnline ? 'Online' : 'Offline'} | Pending Sync: {pendingSyncCount} {isSyncing ? '| Syncing...' : ''}
      </Text>
      <Button onPress={onSignOut} title="Sign Out" variant="outline" />
    </View>
  );
}

function TaskEmptyState() {
  return <EmptyState subtitle="Tasks will appear after backend sync." title="No tasks available" />;
}

export function TaskListScreen({ navigation }: TaskListScreenProps) {
  const { colors,toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const isOnline = useNetworkStatus();
  const taskList = useAppSelector(selectTaskList);
  const user = useAppSelector(selectCurrentUser);
  const pendingSyncCount = useAppSelector(selectPendingSyncCount);
  const isSyncing = useAppSelector(selectTasksSyncing);

  const loadTasksFromBackend = useCallback(async () => {
    const remoteTasks = await taskRepository.fetchTasksFromBackend();

    if (remoteTasks.length > 0) {
      dispatch(taskActions.setTaskList(remoteTasks));
    }
  }, [dispatch]);

  const refreshPendingSyncCount = useCallback(async () => {
    const count = await taskRepository.getPendingSyncCount();
    dispatch(taskActions.setPendingSyncCount(count));
  }, [dispatch]);

  const handleSyncResult = useCallback(
    (result: SyncRunResult) => {
      dispatch(taskActions.setPendingSyncCount(result.pendingActionsCount));

      if (result.syncedActionsCount > 0) {
        void loadTasksFromBackend();
      }
    },
    [dispatch, loadTasksFromBackend],
  );

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      dispatch(taskActions.setTasksSyncing(true));

      try {
        await Promise.all([loadTasksFromBackend(), refreshPendingSyncCount()]);

        const initialSyncResult = await taskSyncManager.runSync();

        if (!isMounted) {
          return;
        }

        handleSyncResult(initialSyncResult);
      } finally {
        if (isMounted) {
          dispatch(taskActions.setTasksSyncing(false));
        }
      }
    };

    void bootstrap();
    taskSyncManager.startAutoSync(handleSyncResult);

    return () => {
      isMounted = false;
      taskSyncManager.stopAutoSync();
    };
  }, [dispatch, handleSyncResult, loadTasksFromBackend, refreshPendingSyncCount]);

  const handleSignOut = useCallback(() => {
    dispatch(authActions.signOutUser());
  }, [dispatch]);

  const persistTaskCompletionChange = useCallback(
    async (taskId: string, isCompleted: boolean) => {
      const result = await taskRepository.toggleTaskCompletion(taskId, isCompleted);
      dispatch(taskActions.setPendingSyncCount(result.pendingActionsCount));
    },
    [dispatch],
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const matchedTask = taskList.find((task) => task.taskId === taskId);

      if (!matchedTask) {
        return;
      }

      const nextCompletionState = !matchedTask.isCompleted;

      dispatch(
        taskActions.setTaskCompletionLocal({
          taskId,
          isCompleted: nextCompletionState,
        }),
      );

      void persistTaskCompletionChange(taskId, nextCompletionState);
    },
    [dispatch, persistTaskCompletionChange, taskList],
  );

  const handleOpenTask = useCallback(
    (taskId: string) => {
      navigation.navigate('TaskDetail', { taskId });
    },
    [navigation],
  );

  const renderTask = useCallback(
    ({ item }: ListRenderItemInfo<TaskItemModel>) => (
      <TaskItem onOpenTask={handleOpenTask} onToggleTask={handleToggleTask} task={item} />
    ),
    [handleOpenTask, handleToggleTask],
  );

  const keyExtractor = useCallback((item: TaskItemModel) => item.taskId, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        <TaskListHeader
          isOnline={isOnline}
          isSyncing={isSyncing}
          onSignOut={handleSignOut}
          pendingSyncCount={pendingSyncCount}
          userEmail={user?.email ?? 'Unknown'}
        />

        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={taskList}
          keyExtractor={keyExtractor}
          ListEmptyComponent={TaskEmptyState}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Button title='Toggle theme' onPress={toggleTheme}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    paddingBottom: scale(10),
    gap: scale(12),
  },
  headerContainer: {
    gap: scale(8),
  },
  title: {
    fontSize: scale(26),
    fontWeight: '700',
  },
  subtitle: {
    fontSize: scale(14),
    opacity: 0.85,
  },
  syncText: {
    fontSize: scale(13),
    fontWeight: '600',
  },
  listContentContainer: {
    gap: scale(10),
    paddingBottom: scale(20),
  },
});
