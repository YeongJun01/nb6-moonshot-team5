import { nonempty, number, object, optional, string } from 'superstruct';

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});

export const UpdateCommentBodyStruct = CreateCommentBodyStruct;
