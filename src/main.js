import Vue from 'vue'
import App from './pages/App.vue'
import store from './store';
import { SendMsgToMain } from './utils/ipc'
import { Table, TableColumn, Pagination, Message } from 'element-ui';

import './assets/base.css'

Vue.config.productionTip = false
Vue.prototype.$sendmsg2main = SendMsgToMain;
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.component(Message.name, Message);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
