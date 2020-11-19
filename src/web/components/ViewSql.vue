<template>
  <div class="sql-warp">
    <ul class="sqltab-box">
      <li class="addtab" @click="AddTab()">
        <i class="el-icon el-icon-plus"></i>
      </li>
      <li
        v-for="(tab, i) in sqlTabs"
        :key="i"
        :class="{ active: i === activeIndex }"
        @click.self="SwitchTab(i)"
      >
        {{ tab.title }}
        <i class="el-icon el-icon-close" @click.self="DelTab(i)"></i>
      </li>
    </ul>
    <div class="textarea-box" ref="txtbox">
      <textarea
        tabindex="1"
        ref="sql"
        v-model="txt"
        @keyup="Keyup"
        :style="{ height: txtHeight }"
      ></textarea>
      <ul class="LineNO">
        <li
          v-for="i in lineCount"
          :key="i"
          :class="{ notes: lineNotes.includes(i - 1) }"
        ></li>
      </ul>
    </div>
    <!-- <div class="textarea" ref="sql" @keyup="Keyup" contenteditable="plaintext-only"></div> -->
    <div class="btn-box">
      <button class="fl ml-20" @click="Exec">执行（crtl + F5）</button>
      <span class="usedtime">用时：{{ usedTime / 1000 }} s</span>
    </div>
    <div class="result-box err" v-if="errorMsg">{{ errorMsg }}</div>
    <div class="result-box" v-else>
      <el-table
        size="mini"
        height="100%"
        v-if="resultData.length"
        :data="resultData"
      >
        <el-table-column
          v-for="field in resultFields"
          :key="field"
          :prop="field"
          :label="field"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { FindNotes } from '../utils/index';

@Component
export default class ViewSql extends Vue {
  sql = '';
  txt = '';
  txtHeight = '100%';
  lineCount = 1;
  lineNotes: number[] = []; // 注释样式行
  resultData: PlainObject[] = [];
  errorMsg = '';
  activeIndex = -1;
  usedTime = 0;

  get tables() {
    return this.$store.state.activeDB.tables;
  }
  get resultFields() {
    if (this.resultData.length) {
      return Object.keys(this.resultData[0]);
    } else {
      return [];
    }
  }
  get sqlTabs() {
    return this.$store.state.sqlTabs;
  }

  Keyup(e: Event | null = null) {
    const $box = this.$refs.txtbox as HTMLElement;
    const $txt = this.$refs.sql as HTMLTextAreaElement;
    const oldheight = this.txtHeight;

    const lines = this.txt.split('\n');
    const height = lines.length * 25;
    if (height > $box.clientHeight) this.txtHeight = `${height}px`;
    else this.txtHeight = `100%`;
    this.lineCount = lines.length;
    this.lineNotes = FindNotes(this.txt).notes;

    if (!e) {
      $txt.setSelectionRange(this.txt.length, this.txt.length);
      $txt.focus();
      this.$nextTick(() => ($box.scrollTop = $box.scrollHeight));
    } else {
      if (parseInt(oldheight) >= parseInt(this.txtHeight)) return;
      this.$nextTick(
        () =>
          ($box.scrollTop =
            $box.scrollTop + parseInt(this.txtHeight) - parseInt(oldheight)),
      );
    }
  }

  Exec() {
    const sql = FindNotes(this.txt).sql;
    const time = new Date().getTime();
    if (!sql) return;
    this.errorMsg = '';
    console.log('[sql-exec]>', sql);
    this.$Sendmsg2main('sql-exec', sql).then(
      (res) => {
        console.log('[sql-exec]<', res);
        this.usedTime = new Date().getTime() - time;
        this.resultData = res as PlainObject[];
      },
      (err) => {
        if (err.message.indexOf('SQLITE_ERROR') >= 0) {
          err.message = `SQLITE_ERROR${err.message.split('SQLITE_ERROR')[1]}`;
        }
        this.errorMsg = `(${new Date().toLocaleTimeString()}) ${err.message}`;
      },
    );
    // 保存当前tab内容
    this.sqlTabs[this.activeIndex].sql = this.txt;
    this.$store.commit('setSqlTabs', this.sqlTabs);
  }

  SwitchTab(index: number) {
    if (this.activeIndex !== -1 && this.activeIndex < this.sqlTabs.length) {
      // 保存当前tab内容
      this.sqlTabs[this.activeIndex].sql = this.txt;
      this.$store.commit('setSqlTabs', this.sqlTabs);
    }
    this.activeIndex = index;
    this.txt = this.sqlTabs[index].sql;
    this.Keyup();
  }

  DelTab(index: number) {
    if (this.sqlTabs.length === 1) {
      // 只剩一个tab，清空内容
      this.sqlTabs[0].title = 'sql 1';
      this.sqlTabs[0].sql = '';
      this.txt = '';
    } else {
      // 删除并激活前面一个tag
      this.sqlTabs.splice(index, 1);
      this.$store.commit('setSqlTabs', this.sqlTabs);
      this.$nextTick(() => {
        if (this.activeIndex === index) this.SwitchTab(index ? index - 1 : 0);
        if (this.activeIndex > index) this.activeIndex -= 1;
      });
    }
  }

  AddTab(sqlobj: PlainObject) {
    sqlobj = sqlobj || {
      title: `sql ${this.sqlTabs.length + 1}`,
      sql: '',
    };
    this.$store.commit('setSqlTabs', sqlobj);
    this.SwitchTab(this.sqlTabs.length - 1);
  }

  // 右键快捷操作
  AppendSqlS(tablename: string) {
    const fields = this.tables.find(
      (item: { name: string }) => item.name === tablename,
    ).fields;
    console.log(fields);
    const sqlstr = `SELECT ${fields.join(',')} \nFROM ${tablename}`;
    this.txt = `${this.txt}\n${sqlstr} \nWHERE \nORDER BY \nLIMIT `;
    this.Keyup();
  }

  AppendSqlU(tablename: string) {
    const fields = this.tables.find(
      (item: { name: string }) => item.name === tablename,
    ).fields;
    const sqlstr = `UPDATE ${tablename} \nSET ${fields.join('="",\n')}=""`;
    this.txt = `${this.txt}\n${sqlstr} \nWHERE `;
    this.Keyup();
  }

  AppendSqlI(tablename: string) {
    const fields = this.tables.find(
      (item: { name: string }) => item.name === tablename,
    ).fields;
    const sqlstr = `INSERT INTO ${tablename} (${fields.join(
      ',',
    )}) \nVALUES ('${fields.join("','")}')`;
    this.txt = `${this.txt}\n${sqlstr} `;
    this.Keyup();
  }

  AppendSqlD(tablename: string) {
    const fields = this.tables.find(
      (item: { name: string }) => item.name === tablename,
    ).fields;
    const sqlstr = `DELETE FROM ${tablename} \nWHERE ${fields.join(
      '="" AND \n',
    )}=""`;
    this.txt = `${this.txt}\n${sqlstr} `;
    this.Keyup();
  }

  mounted() {
    this.$store.commit('getSqlTabs');
    this.SwitchTab(0);
    this.$Bus.$on('new-sql', this.AddTab);
    this.$Bus.$on('table-select', this.AppendSqlS);
    this.$Bus.$on('table-update', this.AppendSqlU);
    this.$Bus.$on('table-insert', this.AppendSqlI);
    this.$Bus.$on('table-delete', this.AppendSqlD);
  }

  beforeDestroy() {
    this.$Bus.$off('new-sql', this.AddTab);
    this.$Bus.$off('table-select', this.AppendSqlS);
    this.$Bus.$off('table-update', this.AppendSqlU);
    this.$Bus.$off('table-insert', this.AppendSqlI);
    this.$Bus.$off('table-delete', this.AppendSqlD);
  }
}
</script>

<style scoped>
.sql-warp {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.textarea-box {
  min-height: 200px;
  max-height: 80vh;
  padding: 0 20px 0 40px;
  box-sizing: border-box;
  overflow: auto;
  height: 20vh;
  position: relative;
  resize: vertical;
}
textarea {
  width: 100%;
  display: block;
  resize: none;
  line-height: 25px;
  overflow: hidden;
  font-family: none;
  border: none;
  background: transparent;
  overflow-x: scroll;
  white-space: nowrap;
}
.LineNO {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.LineNO li {
  width: 100%;
  height: 25px;
  line-height: 25px;
  counter-increment: num;
}
.LineNO li::after {
  content: counter(num);
  display: inline-block;
  width: 30px;
  padding-right: 4px;
  text-align: right;
  font-size: 10px;
  background: #f5f5f5;
  border-right: 1px solid #ccc;
}

.btn-box {
  height: 40px;
  background: #eee;
  padding: 7px 0;
}
.ml-20 {
  margin-left: 20px;
}
.mr-20 {
  margin-right: 20px;
}

.result-box {
  background: #f5f5f5;
  flex-grow: 99;
  overflow: auto;
}

.sqltab-box {
  border-bottom: 1px solid #ccc;
  overflow: auto;
  white-space: pre;
  height: 31px;
  min-height: 31px;
  max-height: 31px;
  padding-left: 30px;
}
.sqltab-box::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background-color: transparent;
}
.sqltab-box::-webkit-scrollbar-track {
  background-color: transparent;
}
.sqltab-box::-webkit-scrollbar-thumb {
  background: transparent;
}
.sqltab-box:hover::-webkit-scrollbar-thumb {
  background: rgb(0, 0, 0, 0.2);
}
.sqltab-box li {
  height: 30px;
  line-height: 30px;
  padding: 0 10px 0 14px;
  display: inline-block;
  cursor: pointer;
}
.sqltab-box li.active {
  background: azure;
}
.sqltab-box li i {
  color: #888;
  padding-left: 10px;
  visibility: hidden;
}
.sqltab-box li.active i,
.sqltab-box li:hover i {
  visibility: visible;
}
.sqltab-box .addtab {
  padding: 0;
  background: azure;
  border-right: 1px solid #ccc;
  position: absolute;
  left: 0;
}
.sqltab-box .addtab i {
  visibility: visible;
  padding: 0 6.5px;
}
.err {
  color: red;
  padding: 30px 50px;
}
.usedtime {
  display: inline-block;
  float: right;
  color: #bbb;
  padding-right: 20px;
}
</style>
<style>
.notes {
  background: #eaeaea;
}
</style>
