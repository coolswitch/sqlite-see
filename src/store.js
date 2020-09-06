import Vuex from 'vuex';
import Vue from 'vue'; 
// const { ipcRenderer } = window.require('electron')

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    active_table: {
      name: '',
      sql: '',
      fields: ''
    }
  },
  mutations: {
    setActiveTable(state, table) {
      state.active_table = table;
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
