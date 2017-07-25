<template>
  <router-view :user="user"></router-view>
</template>

<script>
export default {
  data() {
    return {
      user: this.$store.user || {}
    };
  },
  created() {
    // 查询登录用户
    this.$http.get('sessions').then((res) => {
      const data = res.data ? res.data.data[0] : null;
      if (data && data.id && data.username) {
        this.$store.commit('updateUserInfo', {
          id: data.id,
          username: data.username
        });
        this.$router.replace('/');
      } else {
        this.$store.commit('clearUser');
        if (this.$route.path !== '/login') {
          this.$router.replace('/login');
        }
      }
    }, (err) => {
      this.$store.commit('clearUser');
      this.$router.replace('/login');
      console.error('App - session request error', err);
    });
  }
};
</script>

<style scoped>

</style>
