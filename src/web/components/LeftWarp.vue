<template>
  <div class="left-warp">
    <div class="iconbox">SqliteSee</div>
    <div class="database-warp">
      {{ dbname }} [切库]
      <div class="dblist">
        <p
          v-for="item in database"
          :key="item.dir"
          :title="item.path"
          :class="{ active: item.dir == dbdir }"
          @click="OpenDB(item.dir)"
        >
          {{ item.name }} <em class="dbpath">{{ item.path }}</em>
        </p>
        <p class="add" @click="OpenNewFile">[添加新库]</p>
      </div>
    </div>
    <div class="tables-warp">
      <ul>
        <li class="title">
          {{ dbdir }}<em class="dir" @click="Refresh">刷新</em>
        </li>
        <!-- <li class="empty"></li> -->
        <li
          class="table-name"
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ListenerOnMain } from '../utils/ipc';

@Component
export default class LeftWarp extends Vue {
  database: PlainObject[] = [];

  tables: PlainObject[] = [];

  dbname = '请选择一个数据库';

  dbdir = '';

  get activeTable() {
    return this.$store.state.activeTable;
  }

  OpenDB(dir: string) {
    this.$Sendmsg2main('db-structure', dir)
      .then((tables) => {
        this.dbdir = dir;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.dbname = dir.match(/\/([^\\/]*)\.sqlite/)![1];
        this.tables = tables as PlainObject[];
        this.$store.commit('setActiveDB', { dir, tables });
        this.switchTable(undefined);
        localStorage.setItem('db-dir', dir);
      })
      .catch((err) => {
        if (err.message.includes('数据库连接失败')) {
          err.message = '数据库连接失败';
          this.database = this.database.filter((t) => t.dir !== dir);
          this.$store.commit('setActiveDB', null);
          this.switchTable(undefined);
        }
        this.$message.error(err.message);
      });
  }

  LoadDBList() {
    let dblist: string | string[] = localStorage.getItem('db-list') || '';
    dblist = dblist ? dblist.substr(1).split(',') : [];
    this.database = dblist.map((db: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const name = db.match(/\/([^\\/]*)\.sqlite/)![1],
        path = db.replace(`/${name}.sqlite`, '').replace(`/Users`, '');
      return { name, path, dir: db };
    });
  }

  OpenNewFile() {
    this.$Sendmsg2main('open-dbfile').then((dbfiles) => {
      if (dbfiles && dbfiles.length) {
        localStorage.setItem('db-dir', dbfiles[0]);
        this.OpenDB(dbfiles[0]);

        // 更新数据库列表、并重新加载
        let dblist = localStorage.getItem('db-list');
        dblist = dblist ? dblist.replace(`,${dbfiles[0]}`, '') : '';
        localStorage.setItem('db-list', `${dblist},${dbfiles[0]}`);
        this.LoadDBList();
      }
    });
  }

  switchTable(item: PlainObject | undefined) {
    this.$store.commit('setActiveTable', item);
  }

  Refresh() {
    const activeTable = this.activeTable;
    this.switchTable(undefined);
    this.$Sendmsg2main('db-structure', this.dbdir).then((tables) => {
      this.tables = tables as PlainObject[];
      this.$store.commit('setActiveDB', { dir: this.dbdir, tables });
      this.switchTable(activeTable);
    });
  }

  mounted() {
    this.LoadDBList();
    const dir = localStorage.getItem('db-dir');
    if (dir) this.OpenDB(dir);
    else this.OpenNewFile();

    ListenerOnMain('user-open-file').then((newfilepath) => {
      this.OpenDB(newfilepath);
    });
  }
}
</script>

<style scoped lang="less">
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

  &:hover,
  &.active {
    font-weight: bold;
    background: linear-gradient(
      145deg,
      rgba(70, 195, 243, 0.2) 0.2%,
      #ffffff,
      #ffffff
    );
  }
  &.title {
    background: #eee;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    border-top: 1px solid rgba(70, 195, 243, 0.1);
    border-bottom: 1px solid rgba(70, 195, 243, 0.1);
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 50px;
  }
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
  &:hover {
    opacity: 1;
    .dblist {
      display: block;
    }
  }
  &::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 10px;
    bottom: 30px;
    left: 0px;
  }
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
  p {
    padding: 0 10px 0 30px;
    line-height: 30px;
    &:hover {
      background: #ccc;
    }
    &.active {
      padding-left: 10px;
      .dbpath {
        padding-left: 20px;
      }
    }
    &.active:before {
      content: '✔';
      margin-right: 6px;
    }
  }
}
.dbpath {
  font-style: normal;
  font-size: 12px;
  color: #999;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 12px;
  padding-bottom: 10px;
}
.dir {
  display: inline-block;
  position: absolute;
  right: 0px;
  top: 0;
  padding: 5px 10px 5px 15px;
  color: #ccc;
  font-size: 12px;
  line-height: 25px;
  cursor: pointer;
  &:hover {
    color: #999;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), #ffffff);
  }
}
</style>
