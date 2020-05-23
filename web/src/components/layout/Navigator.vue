<template>
  <div class="layout-breadcrumb">
    <Breadcrumb>
      <Breadcrumb-item v-for="itemName in itemNames" :key="itemName">{{ itemName }}</Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>

<script>
import EventBus from '@/event_bus';
import constant from '@/constant';

export default {
  name: 'Navigator',
  data() {
    return {
      itemNames: ['Dashboard']
    };
  },
  created() {
    // Update navigator when route chagnes
    EventBus.$on('route-change', (data) => {
      const toRoute = data.to;
      const toPath = toRoute.path.substr(1);
      const pathArr = toPath.split('/');
      const itemNames = [];
      let temp = '';
      pathArr.forEach((path) => {
        if (temp) {
          temp += ':';
        }
        temp += path;
        itemNames.push(constant.permissionMenuMap[temp] || 'Unknown menu');
      });
      this.itemNames = itemNames;
    });
  }
};
</script>

<style scoped>
.layout-breadcrumb {
  padding: 10px 15px 10px 15px;
}
</style>
