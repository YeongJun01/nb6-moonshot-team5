export interface CommentResponse {
  id: number;
  content: string;
  taskId: number;
  author: CommentAuthor;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
}

export type CreateCommentData = Omit<
  CommentResponse,
  'id' | 'taskId' | 'author' | 'createdAt' | 'updatedAt'
> & {
  taskId: number;
  userId: number;
};
