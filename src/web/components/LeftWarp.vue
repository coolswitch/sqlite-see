<template>
  <div class="left-warp">
    <div class="iconbox">SqliteSee</div>
    <div class="database-warp">
      {{ dbname }} [切库]
      <div class="dblist">
        <p
          v-for="item in database"
          :key="item.dir"
          :title="item.dir"
          :class="{ active: item.dir == dbdir }"
          @click="OpenDB(item.dir)"
        >
          {{ item.name }}
        </p>
        <p class="add" @click="OpenNewFile">[添加新库]</p>
      </div>
    </div>
    <div class="tables-warp">
      <ul>
        <li class="title">表</li>
        <!-- <li class="empty"></li> -->
        <li
          v-for="item in tables"
          :key="item.name"
          :class="{ active: activeTable.name === item.name }"
          @click="switchTable(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LeftWarp",
  data() {
    return {
      database: [],
      tables: [],
      dbname: "请选择一个数据库",
      dbdir: ""
    };
  },
  computed: {
    ...mapState(["activeTable"])
  },
  created() {
    this.LoadDBList();
    const dir = localStorage.getItem("db-dir");
    if (dir) this.OpenDB(dir);
    else this.OpenNewFile();
  },
  methods: {
    OpenDB(dir) {
      this.$sendmsg2main("db-structure", dir)
        .then(tables => {
          this.dbdir = dir;
          this.dbname = dir.match(/\/([^\\/]*)\.sqlite/)[1];
          this.tables = tables;
          // this.$store.commit("setTableList", tables);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    LoadDBList() {
      let dblist = localStorage.getItem("db-list");
      dblist = dblist ? dblist.substr(1).split(",") : [];
      this.database = dblist.map(db => {
        return { name: db.match(/\/([^\\/]*)\.sqlite/)[1], dir: db };
      });
    },
    OpenNewFile() {
      this.$sendmsg2main("open-dbfile").then(dbfiles => {
        if (dbfiles && dbfiles.length) {
          localStorage.setItem("db-dir", dbfiles[0]);
          this.OpenDB(dbfiles[0]);

          // 更新数据库列表、并重新加载
          let dblist = localStorage.getItem("db-list");
          dblist = dblist ? dblist.replace(`,${dbfiles[0]}`, "") : "";
          localStorage.setItem("db-list", `${dblist},${dbfiles[0]}`);
          this.LoadDBList();
        }
      });
    },
    switchTable(item) {
      this.$store.commit("setActiveTable", item);
    }
  }
};
</script>

<style scoped>
.left-warp {
  width: 300px;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid #ddd;
  position: relative;
  /* background: aliceblue; */
}
.iconbox {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  background: linear-gradient(165deg, #70d5fb 0.2%, #ffffff, #ffffff);
}
li {
  padding: 5px 16px;
  cursor: pointer;
}
li:hover,
li.active {
  font-weight: bold;
  background: linear-gradient(
    145deg,
    rgba(70, 195, 243, 0.2) 0.2%,
    #ffffff,
    #ffffff
  );
}
li.title {
  background: #eee;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  border-top: 1px solid rgba(70, 195, 243, 0.1);
  border-bottom: 1px solid rgba(70, 195, 243, 0.1);
}

.database-warp {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px 10px;
  background: #eee;
  border-radius: 20px;
  border: 1px solid #e2e2e2;
  margin: 10px;
  opacity: 0.3;
  transition: opacity 0.3s;
}
.database-warp:hover {
  opacity: 1;
}
.database-warp:hover .dblist {
  display: block;
}
.database-warp::before {
  content: " ";
  position: absolute;
  width: 100%;
  height: 10px;
  bottom: 30px;
  left: 0px;
}
.dblist {
  position: absolute;
  bottom: 40px;
  right: 0;
  background: #eee;
  padding: 6px 0;
  width: 160px;
  border-radius: 5px;
  border: 1px solid #e2e2e2;
  max-height: 200px;
  overflow: auto;
  display: none;
}
.dblist p {
  padding: 0 10px 0 30px;
  line-height: 30px;
}
.dblist p:hover {
  background: #ccc;
}
.dblist p.active {
  padding-left: 10px;
}
.dblist p.active:before {
  content: "✔";
  margin-right: 6px;
}
</style>
