export type MessageChannel = {
  // 数据库操作
  'db-structure': (dir: string) => Promise<DBTable[]>;
  'table-data': (obj: PlainObject) => Promise<PlainObject>;
  'sql-exec': (sql: string) => Promise<PlainObject[] | undefined>;
  // 原生操作
  'open-dbfile': () => string[] | undefined;
  copy: (txt: string) => void;
};

export type NoticeChannel = {
  'user-open-file': string;
};
