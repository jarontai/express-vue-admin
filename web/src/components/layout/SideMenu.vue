<template>
  <Menu theme="dark" width="auto" :open-names="menuItemArr" :active-name="activeMenu" @on-select="routeTo">
    <Row justify="center" align="middle">
      <Col span="22" offset="1" class="layout-logo-left">express-vue-admin</Col>
    </Row>

    <Menu-item name="dashboard" v-if="permissionMap['dashboard']">
      Dashboard
    </Menu-item>

    <Submenu name="admin" v-if="permissionMap['admin']">
      <template slot="title">
        后台管理
      </template>
      <Menu-item name="admin:user" v-if="permissionMap['admin:user']">后台用户列表</Menu-item>
      <Menu-item name="admin:role" v-if="permissionMap['admin:role']">角色权限设置</Menu-item>
      <Menu-item name="admin:permission" v-if="permissionMap['admin:permission']">后台权限列表</Menu-item>
    </Submenu>
  </Menu>
</template>

<script>
import EventBus from '@/event_bus';

export default {
  name: 'SideMenu',
  props: ['permissions'],
  data() {
    return {
      menuItemArr: [],
      activeMenu: ''
    };
  },
  computed: {
    permissionMap() {
      const result = {};
      (this.permissions || []).forEach((permission) => {
        result[permission] = true;
      });
      return result;
    }
  },
  methods: {
    routeTo(route) {
      if (route) {
        const toRoute = `/${route.split(':').join('/')}`;
        this.$router.push(toRoute);
      }
    }
  },
  created() {
    const route = this.$router.currentRoute;
    const path = route.path.substr(1);
    this.menuItemArr = [path.split('/')[0]];
    this.activeMenu = path.split('/').join(':');

    EventBus.$on('route-change', (data) => {
      const toRoute = data.to;
      const toPath = toRoute.path.substr(1);
      this.menuItemArr = [toPath.split('/')[0]];
      this.activeMenu = toPath.split('/').join(':');
    });
  }
};
</script>

<style scoped>
.layout-logo-left {
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 16px;
}
</style>
