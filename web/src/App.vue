<template>
  <div class="app-section" style="height: 100%; min-height: 100%;">
    <login-view v-if="notLogin" v-show="loginSettle" v-cloak></login-view>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Login from '@/components/user/Login';

export default {
  data() {
    return {
      loginSettle: false
    };
  },
  computed: {
    notLogin: function () {
      let result = true;
      if (this.$store.state.user && this.$store.state.user.userInfo) {
        result = false;
      }
      return result;
    }
  },
  created() {
    // 查询登录用户
    this.$http.get('sessions').then((res) => {
      this.loginSettle = true;

      const data = res.data ? res.data.data[0] : null;
      if (data && data.id && data.username) {
        this.$store.commit('updateUserInfo', {
          id: data.id,
          username: data.username
        });
      } else {
        this.$store.commit('clearUser');
      }
    }, (err) => {
      this.$store.commit('clearUser');
      console.error('App - session request error', err);
    });
  },
  components: {
    'login-view': Login
  }
};
</script>

<style scoped>
</style>
