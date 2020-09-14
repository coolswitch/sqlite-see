<template>
  <div class="sql-warp">
    <div class="textarea" ref="sql" @keyup="Keyup" contenteditable="plaintext-only"></div>
    <div class="btn-box">
      <button class="fl ml-20" @click="Exec">执行（crtl + F5）</button>
      <button class="fr mr-20" @click="InsertSql('select')">查</button>
      <button class="fr mr-20" @click="InsertSql('update')">更</button>
      <button class="fr mr-20" @click="InsertSql('delete')">删</button>
      <button class="fr mr-20" @click="InsertSql('insert')">插</button>
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
import { FindNotes, FixPosition } from '../utils/index'

export default {
  name: 'ViewSql',
  data () {
    return {
      sql: '',
      resultData: [],
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
    }
  },
  methods: {
    Keyup (e) {
      // 查找注释，并赋予样式
      if (['-', 'Backspace'].includes(e.key)) {
        let newtxt = FindNotes(this.$refs.sql, 'notes');
        if (!newtxt) return;
        FixPosition(this.$refs.sql, () => {
          this.$refs.sql.innerHTML = newtxt;
        });
      }
      if (['cut', 'paste'].includes(e.type)) {
        setTimeout(() => {
          let newtxt = FindNotes(this.$refs.sql, 'notes');
          if (!newtxt) return;
          FixPosition(this.$refs.sql, () => {
            this.$refs.sql.innerHTML = newtxt;
          });
        }, 10)
      }
    },
    Exec () {
      let sql = '';
      
      this.$refs.sql.textContent.split('\n').forEach(line => {
        line = line.trim()
        if (!line.startsWith('--')) sql = `${sql} ${line}`
      })
      console.log('ppppp', sql)
      this.$sendmsg2main('sql-exec', sql).then((res) => {
        console.log(res)
          this.resultData = res;

      })
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
      this.$refs.sql.textContent = `${this.$refs.sql.textContent}\n${sqlstr}`
      console.log('sqlssss', sqlstr)
    }
  },
  mounted () {
    this.$refs.sql.addEventListener('cut', this.Keyup)
    this.$refs.sql.addEventListener('paste', this.Keyup)
  },
  beforeDestroy () {
    this.$refs.sql.removeEventListener('cut', this.Keyup)
    this.$refs.sql.removeEventListener('paste', this.Keyup)
  },
}
</script>

<style scoped>
.sql-warp {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.textarea {
    width: 100%;
    min-height: 100px;
    display: block;
    resize: vertical;
    box-sizing: border-box;
    padding: 10px 20px;
    line-height: 26px;
    max-height: 80vh;
    overflow: auto;
    font-family: none;
}
.btn-box {
    height: 40px;
    background: #eee;
    padding-top: 7px;
}
.ml-20 { margin-left: 20px; }
.mr-20 { margin-right: 20px; }

.result-box {
  background: cornsilk;
  flex-grow: 99;
  overflow: auto;
}
</style>
<style>
.notes {
  color: #ccc;
}
</style>