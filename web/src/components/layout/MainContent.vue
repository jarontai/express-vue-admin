<template>
  <div class="layout-content">
    <div class="layout-content-main">内容区域</div>
  </div>
</template>

<script>
export default {
  name: 'Content',
  props: [],
  computed: {
  }
};
</script>

<style scoped>
.layout-content {
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

.layout-content-main {
  padding: 10px;
}
</style>
