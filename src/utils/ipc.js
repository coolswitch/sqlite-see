const { ipcRenderer } = window.require('electron')

export const SendMsgToMain = function(cmd, params) {
    // remote.ipcRenderer.postMessage('port', { message: 'hello' })
    // console.log('------',cmd, params)
    return ipcRenderer.invoke(cmd, params)
}