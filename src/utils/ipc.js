const { ipcRenderer, remote } = window.require('electron')
const Menu = remote.Menu, 
    MenuItem = remote.MenuItem;

export const SendMsgToMain = function(cmd, params) {
    // remote.ipcRenderer.postMessage('port', { message: 'hello' })
    // console.log('------',cmd, params)
    return ipcRenderer.invoke(cmd, params)
}

/** 初始化右键菜单 */
export const InitContextmenu = function() {
    var menu = new Menu();
    menu.append(new MenuItem({ label: '编辑行', click: function(e) { console.log('item 1 clicked', e); } }));
    // menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: '复制整行', click: function() { console.log('item 1 clicked'); } }));
    
    document.addEventListener('contextmenu', (e) => {
      if (e.target.className === "cell") {
        e.preventDefault();
        console.log('----', e.path[2], e.path[2].rowIndex)
        menu.popup();
      }
    }, false);
  }