import { coerce, integer, object, string, defaulted, number } from 'superstruct';

const integerString = coerce(integer(), string(), (value) => Number(value));

export const IdParamsStruct = object({
  id: integerString,
});

export const ProjectUserParamsStruct = object({
  id: coerce(number(), string(), (v) => Number(v)),
  userId: coerce(number(), string(), (v) => Number(v)),
});

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  limit: defaulted(integerString, 10),
});
