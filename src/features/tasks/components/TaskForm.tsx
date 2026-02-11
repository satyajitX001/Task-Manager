import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import scale from '../../../utils/scale';

type TaskFormProps = {
  title: string;
  details: string;
  isSubmitting: boolean;
  onChangeTitle: (value: string) => void;
  onChangeDetails: (value: string) => void;
  onSubmit: () => void;
};

export function TaskForm({
  title,
  details,
  isSubmitting,
  onChangeTitle,
  onChangeDetails,
  onSubmit,
}: TaskFormProps) {
  return (
    <View style={styles.container}>
      <Input label="Task Title" onChangeText={onChangeTitle} placeholder="Enter task title" value={title} />
      <Input
        label="Task Details"
        multiline
        numberOfLines={4}
        onChangeText={onChangeDetails}
        placeholder="Enter task details"
        value={details}
      />
      <Button disabled={isSubmitting} onPress={onSubmit} title={isSubmitting ? 'Saving...' : 'Save Changes'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scale(12),
  },
});
