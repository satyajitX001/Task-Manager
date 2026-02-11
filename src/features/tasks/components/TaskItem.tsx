import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/useTheme';
import scale from '../../../utils/scale';
import { TaskItemModel } from '../types';

type TaskItemProps = {
  task: TaskItemModel;
  onToggleTask: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
};

function TaskItemComponent({ task, onToggleTask, onOpenTask }: TaskItemProps) {
  const { colors } = useTheme();

  const handleToggleTask = useCallback(() => {
    onToggleTask(task.taskId);
  }, [onToggleTask, task.taskId]);

  const handleOpenTask = useCallback(() => {
    onOpenTask(task.taskId);
  }, [onOpenTask, task.taskId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.primary }]}> 
      <Pressable onPress={handleOpenTask} style={styles.contentWrapper}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {task.title}
        </Text>
        <Text numberOfLines={2} style={[styles.details, { color: colors.text }]}>
          {task.details}
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Toggle task completion"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        onPress={handleToggleTask}
        style={[
          styles.checkbox,
          {
            borderColor: colors.primary,
            backgroundColor: task.isCompleted ? colors.primary : 'transparent',
          },
        ]}
      >
        <Text style={[styles.checkboxText, { color: task.isCompleted ? colors.background : colors.primary }]}>✓</Text>
      </Pressable>
    </View>
  );
}

export const TaskItem = memo(TaskItemComponent);

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(14),
    borderWidth: scale(1),
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  contentWrapper: {
    flex: 1,
    gap: scale(6),
  },
  title: {
    fontSize: scale(16),
    fontWeight: '700',
  },
  details: {
    fontSize: scale(13),
    opacity: 0.85,
  },
  checkbox: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(8),
    borderWidth: scale(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: scale(14),
    fontWeight: '800',
  },
});
