<template>
  <div class="data-warp">
    <el-table
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
      tableData: []
    }
  },
  computed: {
    tablename () { return this.$store.state.active_table.name },
    fields () { return this.$store.state.active_table.fields }
  },
  watch: {
    tablename () { this.Selete(); }
  },
  created () {
    this.Selete()
  },
  methods: {
    Selete () {
      if (!this.tablename) return;

      this.$sendmsg2main('table-data', this.tablename).then((res) => {
        // ...
          console.log(44, res)
          this.tableData = res;
      })
    }
  }
}
</script>

<style scoped>
.data-warp {
    height: 100%;
    overflow: hidden;
}
</style>