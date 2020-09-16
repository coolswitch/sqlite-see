import DBO from './sqlite'
import { ipcMain, dialog } from 'electron';  //IpcMainEvent
import { MessageChannel } from '../typings/channel'

function addListener<T extends keyof MessageChannel>(
  cmd: string,
  handler: MessageChannel[T],
): void {
    ipcMain.handle(cmd, function (e: Event, data: any) {
        return handler(data);
    });
}


export default function initListener () {

    let dbo: DBO | null = null

    addListener('db-structure', async (dir: string) => {
        dbo = new DBO(dir)
        await dbo.initStructure()
        // console.log('this.tables', dbo.tables)
        return dbo.tables;
    })

    addListener('table-data', async (obj: PlainObject) => {
        const { tablename, index, size } = obj;
        // console.log('【table-data】', tablename, `select * from ${tablename}`)
        const list = await dbo!.select(`select * from ${tablename} limit ${index * size}, ${size}`);
        if (index === 0) {
            const total = await dbo!.select(`select count(*) as total from ${tablename}`);
            return { list, total: total[0]['total'] }
        } else {
            return { list };
        }
    })

    addListener('sql-exec', async (sql: string) => { 
        if (sql.match(/select/i) && !sql.match(/limit/i))
            sql = `${sql} limit 0, 50`;
        const list = await dbo!.exec(sql);
        console.log('FFFFFF', list)
        return list[0];
    })

    // 打开文件
    addListener('open-dbfile', (): string[] | undefined => { 
        return dialog.showOpenDialogSync({ 
            filters: [{ name: 'sqlite', extensions: ['sqlite'] }], 
            properties: ['openFile', 'showHiddenFiles'] 
        })
    })
}