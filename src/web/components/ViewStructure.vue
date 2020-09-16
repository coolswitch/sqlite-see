<template>
  <div class="structure-warp">
    {{ structure }}
  </div>
</template>

<script>
export default {
  name: "ViewStructure",
  props: {
    msg: String
  },
  computed: {
    structure() {
      return this.$store.state.activeTable.sql.replace(/ {6}/g, "\n      ");
    }
  }
};
</script>

<style scoped>
.structure-warp {
  padding: 20px;
  white-space: pre-wrap;
}
</style>
