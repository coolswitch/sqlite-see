<template>
  <div id="app">
    <left-warp class="fl" />
    <div class="right-warp fl">
      <div class="nav-top fx-c">
        <a href="javascript:;" v-for="item in nav_list" :key="item.txt" 
          @click="acitve_comp = item.comp"
          :class="{active: acitve_comp === item.comp}">{{item.txt}}</a>
      </div>
      <div class="main" :class="{empty: acitve_comp === '' || active_table === ''}">
        <component :is="acitve_comp" v-if="active_table"></component>
      </div>
    </div>
  </div>
</template>

<script> 
import LeftWarp from '../components/LeftWarp'
import ViewData from '../components/ViewData'
import ViewSql from '../components/ViewSql'
import ViewStructure from '../components/ViewStructure'

export default {
  name: 'App',
  components: {
    LeftWarp, ViewData, ViewSql, ViewStructure
  }, 
  data () {
    return {
      nav_list: [
        { txt: '数据', comp: 'ViewData'},        
        { txt: '结构', comp: 'ViewStructure'},        
        { txt: 'sql', comp: 'ViewSql'},
      ],
      acitve_comp: ''
    }
  },
  computed: {
    active_table () { return this.$store.state.active_table.name }
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
.nav-top a:hover, .nav-top a.active{
  background: linear-gradient(0deg, #eee , #ffffff);
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
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px;   */
}
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
}

li {
  list-style: none;
}

button {
    padding: 0px 10px;
    background: #46c3f3;
    border-radius: 30px;
    line-height: 26px;
    color: #fff;
    cursor: pointer;
    transition: color .3s;
}
button:hover { background: #60d3ff; }
button:active { color: #666; }

.fl {
  float: left;
}

.fr {
  float: right;
}

.tc {
  text-align: center;
}

.tr {
  text-align: right;
}

.tl {
  text-align: left;
}

.fx-c {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fx-vc {
  display: flex;
  align-items: center;
}

.fx-hc {
  display: flex;
  justify-content: center;
}
</style>
