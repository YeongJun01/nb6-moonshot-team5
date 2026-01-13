export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type SubtaskListDTO = {
  id: number;
  title: string;
  taskId: number;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};
