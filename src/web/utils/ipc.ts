import { MenuItem as TypeMenuItem, Menu as TypeMenu } from 'electron';
const { ipcRenderer, remote } = window.require('electron');
const Menu = remote.Menu,
  MenuItem = remote.MenuItem;

export const SendMsgToMain = (cmd: string, params: unknown) => {
  // remote.ipcRenderer.postMessage('port', { message: 'hello' })
  // console.log('------',cmd, params)
  return ipcRenderer.invoke(cmd, params);
};

export const ListenerOnMain = (cmd: string): Promise<string> => {
  return new Promise((resolve) => {
    ipcRenderer.on(cmd, (e: unknown, message: string) => {
      resolve(message);
    });
  });
};

/** 初始化右键菜单 */
export class Contextmenu {
  private busEvent: (cmd: string) => Function;
  private busEventParams: unknown;

  menuRow: TypeMenu;

  menuTable: TypeMenu;

  constructor($Bus: Vue) {
    this.busEvent = (cmd: string) => () => {
      console.log(cmd, this.busEventParams);
      $Bus.$emit(cmd, this.busEventParams);
    };
    document.addEventListener('contextmenu', this.Listener.bind(this));

    this.menuRow = this.CreateMenu([
      { label: '编辑行', id: 'row-edit' } as TypeMenuItem,
      { label: '复制整行', id: 'row-copy' } as TypeMenuItem,
      { label: '删除记录', id: 'row-del' } as TypeMenuItem,
    ]);
    this.menuTable = this.CreateMenu([
      { label: 'SELECT', id: 'table-select' } as TypeMenuItem,
      { label: 'UPDATE', id: 'table-update' } as TypeMenuItem,
      { label: 'INSERT', id: 'table-insert' } as TypeMenuItem,
      { label: 'DELETE', id: 'table-delete' } as TypeMenuItem,
    ]);
  }

  Listener(e: PlainObject) {
    // 数据 右键菜单
    if (e.target.className === 'cell') {
      e.preventDefault();
      this.busEventParams = e.path[2].rowIndex;
      // console.log("----", e.path[2], e.path[2].rowIndex);
      this.menuRow.popup();
    }
    // 表名列表 右键菜单
    if (e.target.className.includes('table-name')) {
      e.preventDefault();
      this.busEventParams = e.target.innerText;
      this.menuTable.popup();
    }
  }

  CreateMenu(items: TypeMenuItem[]) {
    const menu = new Menu();
    items.forEach((item: TypeMenuItem) => {
      menu.append(new MenuItem({ ...item, click: this.busEvent(item.id) }));
    });
    return menu;
  }
}
