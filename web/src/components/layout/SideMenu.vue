<template>
  <Menu active-name="1-2" theme="dark" width="auto" :open-names="['admin']" :active-name="'admin-user'">
    <Row justify="center" align="middle">
      <Col span="22" offset="1" class="layout-logo-left">express-vue-admin</Col>
    </Row>

    <Submenu name="admin">
      <template slot="title">
        后台管理
      </template>
      <Menu-item name="admin-user">后台用户列表</Menu-item>
      <Menu-item name="admin-role">角色权限设置</Menu-item>
      <Menu-item name="admin-permission">后台权限列表</Menu-item>
    </Submenu>
  </Menu>
</template>

<script>
export default {
  name: 'SideMenu',
  props: ['menuNames'],
  computed: {
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
