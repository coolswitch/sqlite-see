import DBO from './sqlite';
import { ipcMain, dialog, clipboard } from 'electron'; //IpcMainEvent
import { MessageChannel, NoticeChannel } from '../typings/channel';
import Log from './Log';

const log = new Log();

function addListener<T extends keyof MessageChannel>(
  cmd: T,
  handler: MessageChannel[T],
): void {
  ipcMain.handle(cmd, function(e: Event, data: string & PlainObject) {
    try {
      return handler(data);
    } catch (e) {
      log.error(`IPC [${cmd}]`, e);
    }
  });
}

/** 监听渲染进程的消息 */
export default function initListener() {
  let dbo: DBO | null = null;

  addListener('db-structure', async (dir: string) => {
    log.info(`IPC [db-structure] 数据库结构`, dir);
    dbo = new DBO(dir);
    await dbo.initStructure();
    return dbo.tables;
  });

  addListener('table-data', async (obj: PlainObject) => {
    const { tablename, index, size } = obj;
    console.log(`IPC [table-data] 表数据`, tablename, index, size);
    if (!dbo) return { list: [], total: 0 };

    const res = await dbo.SelectAndCount(tablename, index, size);
    return res;
  });

  addListener('sql-exec', async (sql: string) => {
    if (!dbo) throw new Error('请选择数据库');

    if (sql.match(/select/i) && !sql.match(/limit/i))
      sql = `${sql} limit 0, 50`;
    const res = await dbo.Exec(sql);
    return res as PlainObject[];
  });

  /* 非数据库原生功能 */

  // 打开文件
  addListener('open-dbfile', (): string[] | undefined => {
    return dialog.showOpenDialogSync({
      filters: [{ name: 'sqlite', extensions: ['sqlite'] }],
      properties: ['openFile', 'showHiddenFiles'],
    });
  });

  // 操作剪切板
  addListener('copy', (txt: string): void => {
    clipboard.clear();
    clipboard.writeText(txt);
  });
}

/** 向渲染进程发消息 */
export function SendMsgToRenderer<T extends keyof NoticeChannel>(
  webContents: Electron.WebContents,
  cmd: T,
  params: NoticeChannel[T],
): void {
  if (webContents.isLoading())
    webContents.on('did-finish-load', () => {
      webContents.send(cmd, params);
    });
  else webContents.send(cmd, params);
}
