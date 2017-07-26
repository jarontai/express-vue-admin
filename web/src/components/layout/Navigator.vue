<template>
  <div class="layout-breadcrumb">
    <Breadcrumb>
      <Breadcrumb-item>首页</Breadcrumb-item>
      <Breadcrumb-item>应用中心</Breadcrumb-item>
      <Breadcrumb-item>某应用</Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Navigator',
  props: [],
  computed: {
  }
};
</script>

<style scoped>
.layout-breadcrumb {
  padding: 10px 15px 0;
}
</style>
