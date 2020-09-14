<template>
  <div class="sql-warp">
    <div class="textarea-box" ref="txtbox"> 
      <textarea ref="sql" v-model="txt" @keyup="Keyup" :style="{ height: txt_height }"></textarea>
      <ul class="LineNO">
        <li v-for="i in line_count" :key="i" :class="{notes: line_notes.includes(i - 1)}"></li>
      </ul>
    </div>
    <!-- <div class="textarea" ref="sql" @keyup="Keyup" contenteditable="plaintext-only"></div> -->
    <div class="btn-box">
      <button class="fl ml-20" @click="Exec">执行（crtl + F5）</button>
      <button class="fr mr-20" @click="InsertSql('insert')">插</button>
      <button class="fr mr-20" @click="InsertSql('delete')">删</button>
      <button class="fr mr-20" @click="InsertSql('update')">更</button>
      <button class="fr mr-20" @click="InsertSql('select')">查</button>
    </div>
    <div class="result-box">
      <el-table
        size="mini"
        height="100%"
        v-if="resultData.length"
        :data="resultData">
        <el-table-column 
          v-for="field in resultFields" 
          :key="field"
          :prop="field"
          :label="field">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { FindNotes } from '../utils/index'

export default {
  name: 'ViewSql',
  data () {
    return {
      sql: '',
      txt: '',
      txt_height: '100%',
      line_count: 1,
      line_notes: [], // 注释样式行
      resultData: [],

      debouncing: false,
    }
  },
  computed: {
    tablename () { return this.$store.state.active_table.name },
    fields () { return this.$store.state.active_table.fields },
    resultFields () {
      if (this.resultData.length) {
        return Object.keys(this.resultData[0])
      } else {
        return [];
      }
    },
  },
  methods: {
    Keyup (e) { 
      const $box = this.$refs.txtbox;
      const $txt = this.$refs.sql;
      const oldheight = this.txt_height;

      const lines = this.txt.split('\n');
      const height = lines.length * 25;
      if (height > $box.clientHeight) this.txt_height = `${height}px`;
      else this.txt_height = `100%`;
      this.line_count = lines.length;
      this.line_notes = FindNotes(this.txt).notes

      if (!e) {
          $txt.setSelectionRange(this.txt.length, this.txt.length);
          $txt.focus();
          this.$nextTick(() => $box.scrollTop = $box.scrollHeight)
      } else {
        if (parseInt(oldheight) >= parseInt(this.txt_height)) return;
        this.$nextTick(() => $box.scrollTop = $box.scrollTop + parseInt(this.txt_height) - parseInt(oldheight))
      }
    },
    InsertSql (type) {
      let sqlstr = ''
      switch (type) {
        case 'insert':
          sqlstr = `INSERT INTO ${this.tablename} (${this.fields.join(',')}) \nVALUES ('${this.fields.join("','")}')`
          break;
        case 'update':
          sqlstr = `UPDATE ${this.tablename} \nSET ${this.fields.join('="",\n')}="" WHERE `
          break;
        case 'delete':
          sqlstr = `DELETE FROM ${this.tablename} \nWHERE ${this.fields.join('="" AND \n')}=""`
          break;
        default:
          sqlstr = `SELECT ${this.fields.join(',')} \nFROM ${this.tablename} \nWHERE \nORDER BY \nLIMIT `
          break;
      }
      this.txt = `${this.txt}\n${sqlstr}`
      this.Keyup()
      console.log('sqlssss', sqlstr)
    },
    Exec () {
      let sql = FindNotes(this.txt).sql;
      if (!sql) return;
      console.log('ppppp', sql)
      this.$sendmsg2main('sql-exec', sql).then((res) => {
        console.log(res)
        this.resultData = res;
      })
    },
  },
  mounted () {
    // this.$refs.sql.addEventListener('cut', this.Keyup)
    // this.$refs.sql.addEventListener('paste', this.Keyup)
  },
  beforeDestroy () {
    // this.$refs.sql.removeEventListener('cut', this.Keyup)
    // this.$refs.sql.removeEventListener('paste', this.Keyup)
  },
}
</script>

<style scoped>
.sql-warp {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.textarea-box {
    min-height: 100px;
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
    padding-top: 7px;
}
.ml-20 { margin-left: 20px; }
.mr-20 { margin-right: 20px; }

.result-box {
  background: #f5f5f5;
  flex-grow: 99;
  overflow: auto;
}
</style>
<style>
.notes {
  background: #eaeaea;
}
</style>