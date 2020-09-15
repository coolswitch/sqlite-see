<template>
  <div class="data-warp">
    <el-table
      ref="table"
      size="mini"
      height="100%"
      :data="tableData">
      <el-table-column 
        v-for="field in fields" 
        :key="field"
        :prop="field"
        :label="field">
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page_index"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="page_size"
      layout="total, sizes, prev, next, jumper"
      :total="total" />
  </div>
</template>

<script>

export default {
  name: 'ViewData',
  props: {
    msg: String
  },
  data () {
    return {
      tableData: [],
      total: 0,
      page_size: 20,
      page_index: 1,
      loading: false,
    }
  },
  computed: {
    tablename () { return this.$store.state.active_table.name },
    fields () { return this.$store.state.active_table.fields }
  },
  watch: {
    tablename () { this.Select(); }
  },
  mounted () {
    this.Select()
  },
  methods: {
    handleSizeChange(val) {
      this.page_size = val;
      this.page_index = 1;
      this.Select()
    },
    handleCurrentChange(val) {
      this.page_index = val;
      this.Select()
    },
    Select () {
      if (!this.tablename || this.loading) return;
      this.loading = true;
      const params = { tablename: this.tablename, index: this.page_index - 1, size: this.page_size }
      console.log('[table-data]>', params)
      this.$sendmsg2main('table-data', params).then((res) => {
        this.loading = false;
        console.log('[table-data]<', res)
        if (res.total) this.total = res.total;
        this.tableData = res.list;
      })
    },
  }
}
</script>

<style scoped>
.data-warp {
    height: 100%;
    overflow: hidden;
}
</style>