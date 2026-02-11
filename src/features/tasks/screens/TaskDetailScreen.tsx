import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTheme } from '../../../theme/useTheme';
import scale from '../../../utils/scale';
import { TaskForm } from '../components/TaskForm';
import { taskRepository } from '../taskRepository';
import { selectTaskById, taskActions } from '../taskSlice';

import type { TaskDetailScreenProps } from '../../../navigation/types';

export function TaskDetailScreen({ route }: TaskDetailScreenProps) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isOnline = useNetworkStatus();

  const selectedTask = useAppSelector((state) => selectTaskById(state, route.params.taskId));

  const [title, setTitle] = useState<string>(selectedTask?.title ?? '');
  const [details, setDetails] = useState<string>(selectedTask?.details ?? '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    setTitle(selectedTask.title);
    setDetails(selectedTask.details);
  }, [selectedTask]);

  const persistTaskEditChange = useCallback(
    async (taskId: string, nextTitle: string, nextDetails: string) => {
      const result = await taskRepository.editTask(taskId, nextTitle, nextDetails);
      dispatch(taskActions.setPendingSyncCount(result.pendingActionsCount));
    },
    [dispatch],
  );

  const handleSaveChanges = useCallback(() => {
    if (!selectedTask) {
      return;
    }

    const nextTitle = title.trim();
    const nextDetails = details.trim();

    if (!nextTitle || !nextDetails) {
      return;
    }

    setIsSubmitting(true);

    dispatch(
      taskActions.updateTaskLocal({
        taskId: selectedTask.taskId,
        title: nextTitle,
        details: nextDetails,
      }),
    );

    void (async () => {
      try {
        await persistTaskEditChange(selectedTask.taskId, nextTitle, nextDetails);
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [details, dispatch, persistTaskEditChange, selectedTask, title]);

  if (!selectedTask) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <EmptyState subtitle="This task may have been removed." title="Task not found" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Edit Task</Text>
        <Text style={[styles.statusText, { color: colors.primary }]}>
          {isOnline ? 'Online: changes sync immediately' : 'Offline: changes queued in local Realm'}
        </Text>

        <TaskForm
          details={details}
          isSubmitting={isSubmitting}
          onChangeDetails={setDetails}
          onChangeTitle={setTitle}
          onSubmit={handleSaveChanges}
          title={title}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: scale(20),
    justifyContent: 'center',
  },
  container: {
    borderRadius: scale(16),
    padding: scale(20),
    gap: scale(12),
  },
  title: {
    fontSize: scale(24),
    fontWeight: '700',
  },
  statusText: {
    fontSize: scale(13),
    fontWeight: '600',
  },
});
