<template>
  <div id="app">
    <left-warp class="fl" />
    <div class="right-warp fl">
      <div class="nav-top fx-c">
        <a
          href="javascript:;"
          v-for="item in navList"
          :key="item.txt"
          @click="acitveComp = item.comp"
          :class="{ active: acitveComp === item.comp }"
          >{{ item.txt }}</a
        >
      </div>
      <div
        class="main"
        :class="{ empty: acitveComp === '' || activeDB === '' }"
      >
        <keep-alive
          ><component :is="acitveComp" v-if="activeDB"></component
        ></keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeftWarp from '../components/LeftWarp.vue';
import ViewTable from '../components/ViewTable.vue';
import ViewSql from '../components/ViewSql.vue';
import ViewStructure from '../components/ViewStructure.vue';

@Component({
  components: {
    LeftWarp,
    ViewTable,
    ViewSql,
    ViewStructure,
  },
})
export default class App extends Vue {
  navList = [
    { txt: '数据', comp: 'ViewTable' },
    { txt: '结构', comp: 'ViewStructure' },
    { txt: 'sql', comp: 'ViewSql' },
  ];

  acitveComp = 'ViewTable';

  get activeDB() {
    return this.$store.state.activeDB.dir;
  }
}
</script>

<style scoped>
.right-warp {
  width: calc(100% - 300px);
}
.nav-top {
  line-height: 30px;
  border-bottom: 1px solid #ddd;
}
.nav-top a {
  flex: 1;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
}
.nav-top a:hover,
.nav-top a.active {
  background: linear-gradient(0deg, #eee, #ffffff);
}
.main {
  height: calc(100vh - 31px);
  position: relative;
  overflow: auto;
}
.empty::after {
  content: 'SqliteSee';
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 45vh;
  right: 0;
  bottom: 0;
  text-align: center;
  opacity: 0.15;
}
</style>
