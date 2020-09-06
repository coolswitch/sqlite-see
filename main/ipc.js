import DBO from './sqlite'
import { ipcMain } from 'electron';  //IpcMainEvent

export default function initListener () {

    const dbo = new DBO('')

    ipcMain.handle('db-structure', async () => {
        await dbo.initStructure()
        return dbo.tables;
    })


    // ipcMain.handle('db-switch', async (db_dir) => { 
    // })

    // ipcMain.handle('table-data', async (sql) => { 
    // })

    // ipcMain.handle('sql-exec', async (sql) => { 
    // })
}
