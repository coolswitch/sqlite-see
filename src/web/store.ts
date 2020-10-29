import Vuex from 'vuex';
import Vue from 'vue';
// const { ipcRenderer } = window.require('electron')

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    activeDB: '',
    activeTable: {
      name: '',
      sql: '',
      fields: '',
    },
    sqlTabs: [{ title: 'sql 1', sql: '' }],
  },
  mutations: {
    setActiveDB(state, dir) {
      state.activeDB = dir;
    },
    setActiveTable(state, table) {
      state.activeTable = table || { name: '', sql: '', fields: '' };
    },
    getSqlTabs(state) {
      const str = localStorage.getItem('sql-tabs');
      state.sqlTabs = str ? JSON.parse(str) : [{ title: 'sql 1', sql: '' }];
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
