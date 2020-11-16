<template>
  <div class="data-warp">
    <el-table
      ref="table"
      size="mini"
      height="calc(100% - 37px)"
      :data="tableData"
    >
      <el-table-column
        v-for="field in fields"
        :key="field"
        :prop="field"
        :label="field"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="pageSize"
      layout="total, sizes, prev, next, jumper"
      :total="total"
    />
  </div>
</template>

<script>
export default {
  name: 'ViewTable',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      loading: false,
    };
  },
  computed: {
    tablename() {
      return this.$store.state.activeTable.name;
    },
    fields() {
      return this.$store.state.activeTable.fields;
    },
  },
  watch: {
    tablename() {
      this.ReadTableData();
    },
  },
  mounted() {
    this.ReadTableData();
    this.$Bus.$on('row-edit', this.Edit);
    this.$Bus.$on('row-copy', this.Copy);
    this.$Bus.$on('row-del', this.Del);
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.ReadTableData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.ReadTableData();
    },
    ReadTableData() {
      if (!this.tablename || this.loading) return;
      this.loading = true;
      const params = {
        tablename: this.tablename,
        index: this.pageIndex - 1,
        size: this.pageSize,
      };
      console.log('[table-data]>', params);
      this.$Sendmsg2main('table-data', params).then((res) => {
        this.loading = false;
        console.log('[table-data]<', res);
        if (res.total) this.total = res.total;
        this.tableData = res.list;
      });
    },
    Copy(index) {
      this.$Sendmsg2main('copy', JSON.stringify(this.tableData[index]));
    },
    Edit(index) {
      let sql = '';
      Object.keys(this.tableData[index]).forEach((key) => {
        const val = this.tableData[index][key];
        if (typeof val === 'number') sql = `${sql},${key}=${val}\n`;
        else if (val.length <= 50) sql = `${sql},${key}='${val}'\n`;
        else sql = `${sql},${key}='${val.substr(0, 50)}...'\n`;
      });
      sql = `UPDATE ${this.tablename} ${sql.substr(1)} WHERE `;
      console.log('443344', sql);

      document.querySelector('.nav-top').children[2].click();
      this.$nextTick(() => {
        this.$Bus.$emit('new-sql', { title: `编辑${this.tablename}`, sql });
      });
      // this.$Sendmsg2main('copy', JSON.stringify(this.tableData[index]));
    },
    Del(index) {
      const where = [];
      Object.keys(this.tableData[index]).forEach((key) => {
        const val = this.tableData[index][key];
        if (typeof val === 'number') where.push(` ${key}=${val} `);
        else if (val === 'null') where.push(` ${key} is null `);
        else if (val.length <= 100) where.push(` ${key}='${val}' `);
      });
      const sql = `DELETE FROM ${this.tablename} \nWHERE ${where.join('AND')}`;

      console.log('[sql-exec]>', sql);
      this.$Sendmsg2main('sql-exec', sql).then((res) => {
        console.log('[sql-exec]<', res);
        this.ReadTableData();
      });
    },
  },
  beforeDestroy() {
    this.$Bus.$off('row-edit', this.Edit);
    this.$Bus.$off('row-copy', this.Copy);
    this.$Bus.$off('row-del', this.Del);
  },
};
</script>

<style scoped>
.data-warp {
  height: 100%;
  overflow: hidden;
}
</style>
