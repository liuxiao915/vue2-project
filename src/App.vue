<template>
  <div id="app">
    <sapiTable />
    <Message />
  </div>
</template>

<script>
import sapiTable from './views/table.vue'
import Message from './views/message.vue'

export default {
  name: 'App',
  components: {
    sapiTable,
    Message
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
