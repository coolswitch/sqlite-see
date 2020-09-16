<template>
  <div class="data-warp">
    <el-table ref="table" size="mini" height="100%" :data="tableData">
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
  name: "ViewData",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      loading: false
    };
  },
  computed: {
    tablename() {
      return this.$store.state.activeTable.name;
    },
    fields() {
      return this.$store.state.activeTable.fields;
    }
  },
  watch: {
    tablename() {
      this.Select();
    }
  },
  mounted() {
    this.Select();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.Select();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.Select();
    },
    Select() {
      if (!this.tablename || this.loading) return;
      this.loading = true;
      const params = {
        tablename: this.tablename,
        index: this.pageIndex - 1,
        size: this.pageSize
      };
      console.log("[table-data]>", params);
      this.$sendmsg2main("table-data", params).then(res => {
        this.loading = false;
        console.log("[table-data]<", res);
        if (res.total) this.total = res.total;
        this.tableData = res.list;
      });
    }
  }
};
</script>

<style scoped>
.data-warp {
  height: 100%;
  overflow: hidden;
}
</style>
