import { coerce, integer, object, string, defaulted, optional, enums, nonempty } from 'superstruct';

const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});
