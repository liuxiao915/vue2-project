<!--
 @Description: 
 @Author: liux
 @Date: 2023-04-14 11:09:40
 @LastEditTime: 2023-04-14 11:09:40
-->
<template>
  <div @click="openMessage">openMessage</div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    openMessage() {
      this.$message.success('success')
    }
  }
}
</script>
<style lang="less" scoped>

</style>