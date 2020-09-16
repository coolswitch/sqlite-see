import Vuex from "vuex";
import Vue from "vue";
// const { ipcRenderer } = window.require('electron')

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    activeTable: {
      name: "",
      sql: "",
      fields: ""
    },
    tableList: []
  },
  mutations: {
    setActiveTable(state, table) {
      state.activeTable = table;
    },
    setTableList(state, table) {
      state.tableList = table;
    }
  },
  actions: {
    // refreshCurUser(context) {
    // },
    // refreshPreference(context) {
    // },
  }
});

export default store;
