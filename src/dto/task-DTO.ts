import { TaskStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        profileImage: true;
      };
    };
    taskTags: {
      include: {
        tag: true;
      };
    };
    attachments: {
      select: {
        url: true;
      };
    };
  };
}>;

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
  tags?: string[];
  attachment?: [];
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
  tags?: string[];
  attachment?: [];
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

export const TASK_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
  },
  taskTags: {
    include: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  attachments: {
    select: { url: true },
  },
};
