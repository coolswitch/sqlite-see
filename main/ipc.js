import DBO from './sqlite'
import { ipcMain } from 'electron';  //IpcMainEvent

export default function initListener () {

    const dbo = new DBO('')

    ipcMain.handle('db-structure', async () => {
        await dbo.initStructure()
        return dbo.tables;
    })
}
