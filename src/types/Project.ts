export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

//export default Project;
