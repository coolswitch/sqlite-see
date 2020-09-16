declare type PlainObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
};

declare type DBTable = {
  name: string;
  sql: string;
  fields: string[];
};
