<template>
    <div class="left-warp">
      <div class="iconbox">SqliteSee</div>
      <div class="database-warp">
        xxxx [切库]
        <div class="dblist">
          <p>xxxx</p>
          <p>xxxx</p>
          <p class="active">xxxx</p>
          <p class="add">[添加新库]</p>
        </div>
      </div>
      <div class="tables-warp">
        <ul>
          <li class="title"> 表 </li>
          <li v-for="item in tables" 
            :key="item.name" 
            :class="{active: active_table.name === item.name}"
            @click="switchTable(item)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
</template>

<script> 
import { mapState } from 'vuex'
const { ipcRenderer } = window.require('electron')

export default {
  name: 'LeftWarp', 
  data () {
    return {
      database: [],
      tables: [],
      active_db: 0,
    }
  },
  computed: {
    ...mapState(['active_table'])
  },
  created () {
    // remote.ipcRenderer.postMessage('port', { message: 'hello' })
    ipcRenderer.invoke('db-structure').then((tables) => {
      // ...
        console.log(33, tables)
        this.tables = tables;
    })
  },
  methods: {
    switchTable (item) {
      this.$store.commit('setActiveTable', item) 
    }
  }
}
</script>

<style scoped>
.left-warp {
    width: 300px;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid #ddd;
    /* background: aliceblue; */
}
.iconbox {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 30px;
    background: linear-gradient(165deg, #70d5fb 0.2%, #ffffff , #ffffff);

}
li {
    padding: 5px 16px;
    cursor: pointer;
}
li:hover, li.active {
    font-weight: bold;
    background: linear-gradient(145deg, #eee 0.2%, #ffffff , #ffffff);
}
li.title {
    background: rgba(112, 213, 251, 0.15);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
}

.database-warp{
    position: absolute;
    bottom: 0;
    padding: 5px 10px;
    background: #ddd;
    border-radius: 20px;
    margin: 10px;
    opacity: .3;
    transition: opacity .3s;
}
.database-warp:hover { opacity: 1; }
.database-warp:hover .dblist { display: block; }
.database-warp::before { 
    content: ' '; 
    position: absolute;
    width: 100%;
    height: 10px;
    bottom: 30px;
    left: 0px;
}
.dblist {
    position: absolute;
    bottom: 40px;
    left: 0;
    background: #ddd;
    padding: 6px 0;
    width: 160px;
    border-radius: 5px;
    max-height: 200px;
    overflow: auto;
    display: none;
}
.dblist p {
  padding: 0 10px 0 30px;
  line-height: 30px;
}
.dblist p:hover { background: #ccc; }
.dblist p.active { padding-left: 10px; }
.dblist p.active:before {
  content: '✔';
  margin-right: 6px;
}
</style>