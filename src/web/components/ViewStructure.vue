<template>
  <div class="structure-warp">
    {{ structure }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ViewStructure extends Vue {
  get structure() {
    return this.$store.state.activeTable.sql.replace(/ {6}/g, '\n      ');
  }
}
</script>

<style scoped>
.structure-warp {
  padding: 20px;
  white-space: pre-wrap;
}
</style>
