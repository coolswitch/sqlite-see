import { MenuItem as TypeMenuItem, Menu as TypeMenu } from "electron";
const { ipcRenderer, remote } = window.require("electron");
const Menu = remote.Menu,
  MenuItem = remote.MenuItem;

export const SendMsgToMain = (cmd: string, params: unknown) => {
  // remote.ipcRenderer.postMessage('port', { message: 'hello' })
  // console.log('------',cmd, params)
  return ipcRenderer.invoke(cmd, params);
};

/** 初始化右键菜单 */
export class Contextmenu {
  private busEvent: (cmd: string) => Function;
  private busEventParams: unknown;

  menuTable: TypeMenu;

  constructor($Bus: Vue) {
    this.busEvent = (cmd: string) => () => {
      console.log(cmd, this.busEventParams);
      $Bus.$emit(cmd, this.busEventParams);
    };
    document.addEventListener("contextmenu", this.Listener.bind(this));

    this.menuTable = this.CreateMenu([
      { label: "编辑行", id: "row-edit" } as TypeMenuItem,
      { label: "复制整行", id: "row-copy" } as TypeMenuItem
    ]);
  }

  Listener(e: PlainObject) {
    // 数据右键菜单
    if (e.target.className === "cell") {
      e.preventDefault();
      this.busEventParams = e.path[2].rowIndex;
      // console.log("----", e.path[2], e.path[2].rowIndex);
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
