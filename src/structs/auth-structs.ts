import { string, object } from 'superstruct';

export const EmailStruct = object({
  email: string(),
});
