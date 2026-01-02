import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  enums,
  nonempty,
  number,
} from 'superstruct';

const integerString = coerce(integer(), string(), (value) => Number(value));

export const IdParamsStruct = object({
  id: integerString,
});

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  limit: defaulted(integerString, 10),
});
