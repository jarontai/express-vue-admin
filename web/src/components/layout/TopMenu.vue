<template>
  <div class="top-menu">
    <Dropdown placement="bottom-end" @on-click="test">
      <a href="javascript:void(0)">
        <Icon type="person" size="15"></Icon>
        <Icon type="arrow-down-b" size="15"></Icon>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item name="password">修改密码</Dropdown-item>
        <Dropdown-item name="logout">登出</Dropdown-item>
      </Dropdown-menu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  methods: {
    test(name) {
      if (name === 'logout') {
        this.$http.delete('sessions').then(() => {
          this.$store.commit('clearUser');
        });
      } else if (name === 'password') {
        // TODO - update password
      }
    }
  }
};
</script>

<style scoped>

</style>
