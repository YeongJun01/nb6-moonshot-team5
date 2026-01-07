import { TaskStatus } from '@prisma/client';

export type CreateTaskInput = {
  title: string;
  description?: string;

  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status?: TaskStatus;
};

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assigneeId?: number | null;
  status?: TaskStatus;

  startYear?: number;
  startMonth?: number;
  startDay?: number;
  endYear?: number;
  endMonth?: number;
  endDay?: number;
}

export interface FindProjectTasksQuery {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  assignee?: number;
  keyword?: string;
  order?: 'asc' | 'desc';
  order_by?: 'created_at' | 'title' | 'end_date';
}

export interface TaskResponse {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: string;
  assignee: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  tags: { id: number; name: string }[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}
