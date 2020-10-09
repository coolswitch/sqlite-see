import Vue from 'vue';
import App from './pages/App.vue';
import store from './store';
import { SendMsgToMain, Contextmenu } from './utils/ipc';
import { Table, TableColumn, Pagination, Message } from 'element-ui';

import 'element-ui/lib/theme-chalk/table.css';
import 'element-ui/lib/theme-chalk/table-column.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/message.css';
import './assets/base.css';

Vue.config.productionTip = false;
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.component(Message.name, Message);
Vue.prototype.$Sendmsg2main = SendMsgToMain;
Vue.prototype.$Bus = new Vue();

new Vue({
  store,
  render: (h) => h(App),
})
  .$mount('#app')
  .$nextTick(() => {
    new Contextmenu(Vue.prototype.$Bus);
  });
