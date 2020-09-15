declare type PlainObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
};

// ??? 这个文件怎么引用 ？？？
  
export type MessageChannel = {
  // 数据库操作
  'db-structure': (e: Event, dir: string) => Array<PlainObject>;
  'table-data': (e: Event, obj: PlainObject) => Array<PlainObject>;
  'sql-exec': (e: Event, dir: string) => Array<PlainObject>;
  // 原生操作
  'open-dbfile': (e: Event, dir: string) => Array<PlainObject>;
}
// { tablename: string, index: number, size: number }