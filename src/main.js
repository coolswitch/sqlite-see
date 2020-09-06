import Vue from 'vue'
import App from './pages/App.vue'
import store from './store';
import { Table, TableColumn } from 'element-ui';

Vue.config.productionTip = false
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
