<template>
  <div class="sql-warp">
    <textarea></textarea>
    <div class="btn-box">
      <button class="fl ml-20">执行（crtl + F5）</button>
      <button class="fr mr-20" style="">查</button>
      <button class="fr mr-20" style="">更</button>
      <button class="fr mr-20" style="">删</button>
      <button class="fr mr-20" style="">插</button>
    </div>
    <div class="result-box"></div>
  </div>
</template>

<script>
export default {
  name: 'ViewSql',
  data () {
    return {

    }
  },
  computed: {
    active_table () { return this.$store.state.active_table }
  }
}
</script>

<style scoped>
.sql-warp {
    display: flex;
    flex-direction: column;
    height: 100%;
}
textarea {
    width: 100%;
    min-height: 100px;
    display: block;
    resize: vertical;
    box-sizing: border-box;
    padding: 20px;
    line-height: 26px;
    max-height: 80vh;
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
}
</style>
