<template>
  <div id="app">
    <sapiTable />
  </div>
</template>

<script>
import sapiTable from './views/table.vue'

export default {
  name: 'App',
  components: {
    sapiTable
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
