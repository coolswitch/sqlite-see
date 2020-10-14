import Vuex from 'vuex';
import Vue from 'vue';
// const { ipcRenderer } = window.require('electron')

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    activeTable: {
      name: '',
      sql: '',
      fields: '',
    },
    tableList: [],
    sqlTabs: [{ title: 'sql 1', sql: '' }],
  },
  mutations: {
    setActiveTable(state, table) {
      state.activeTable = table;
    },
    setTableList(state, table) {
      state.tableList = table;
    },
    getSqlTabs(state) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.sqlTabs = JSON.parse(localStorage.getItem('sql-tabs')!);
    },
    setSqlTabs(state, sqlobj) {
      if (Array.isArray(sqlobj)) {
        state.sqlTabs = sqlobj;
      } else {
        state.sqlTabs.push(sqlobj);
      }

      localStorage.setItem('sql-tabs', JSON.stringify(state.sqlTabs));
    },
  },
  actions: {
    // refreshCurUser(context) {
    // },
    // refreshPreference(context) {
    // },
  },
});

export default store;
