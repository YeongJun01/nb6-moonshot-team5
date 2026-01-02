import { coerce, nonempty, nullable, object, partial, string } from 'superstruct';

export const CreateProjectStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  description: nullable(string()),
});

export const UpdateProjectStruct = partial(CreateProjectStruct);
