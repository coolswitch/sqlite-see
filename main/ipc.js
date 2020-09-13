import DBO from './sqlite'
import { ipcMain, dialog } from 'electron';  //IpcMainEvent

export default function initListener () {

    let dbo = null

    ipcMain.handle('db-structure', async (e, dir) => {
        dbo = new DBO(dir)
        await dbo.initStructure()
        return dbo.tables;
    })


    // ipcMain.handle('db-switch', async (db_dir) => { 
    // })

    ipcMain.handle('table-data', async (e, tablename) => {
        // console.log('【table-data】', tablename, `select * from ${tablename}`)
        const list = await dbo.select(`select * from ${tablename}`);
        return list;
    })

    ipcMain.handle('sql-exec', async (e, sql) => { 
        if (sql.match(/select/i) && !sql.match(/limit/i))
            sql = `${sql} limit 0, 50`;
        const list = await dbo.exec(sql);
        console.log('FFFFFF', list)
        return list[0];
    })


    ipcMain.handle('open-dbfile', () => { 
        return dialog.showOpenDialogSync({ 
            filters: [{ name: 'sqlite', extensions: ['sqlite'] }], 
            properties: ['openFile', 'showHiddenFiles'] 
        })
    })
}
