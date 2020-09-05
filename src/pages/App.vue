<template>
  <div id="app">
    
  </div>
</template>

<script> 
import DBO from './sqlite/index'

export default {
    name: 'App',
    components: { 
    },
    created () {
      const ts = new DBO('')
      console.log(ts)
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
