import { TaskStatus } from '@prisma/client';

export type FindMyTasksQueryDTO = {
  project_id?: number;
  assignee_id?: number;
  status?: TaskStatus;
  from?: string;
  to?: string;
  keyword?: string;
};
