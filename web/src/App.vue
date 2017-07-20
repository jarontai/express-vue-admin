<template>
  <router-view :user="user"></router-view>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  beforeCreate() {
    // 路由改变前检查用户信息是否存在
    const that = this;
    this.$router.beforeEach(function (to, from, next) {
      if (to.path !== '/login' && !that.user) {
        next('/login');
      } else {
        next();
      }
    });
  },
  created() {
    // 查询登录用户
    this.$http.get('sessions').then(function (res) {
      const data = res.data ? res.data[0] : null;
      if (data && data.id) {
        this.user = data;
        this.$router.replace('/');
      } else {
        this.user = null;
        if (this.$route.path !== '/login') {
          this.$router.replace('/login');
        }
      }
    }, function (err) {
      this.user = null;
      this.$router.replace('/login');
      console.error('App - session request error', err);
    });
  }
};
</script>

<style scoped>

</style>
