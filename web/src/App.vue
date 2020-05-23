<template>
  <div class="app-section" style="height: 100%; min-height: 100%;">
    <login-view v-if="notLogin" v-show="loginSettle" v-cloak></login-view>

    <div class="layout" v-else>
      <Row type="flex" style="height: 100%; min-height: 100%;">
        <i-col span="3" class="layout-menu-left">
          <side-menu :permissions="permissions"></side-menu>
        </i-col>

        <i-col span="21">
          <div class="error-wrapper" v-if="errorMessage && errorMessage.length">
            <Alert type="warning" show-icon>
              <i class="error-message">{{ errorMessage }}</i>
            </Alert>
          </div>

          <div class="layout-header">
            <Row>
              <Col span="22">&nbsp;</Col>
              <Col span="2" class="top-menu-section">
                <top-menu /></top-menu>
              </Col>
            </Row>
          </div>

          <navigator></navigator>

          <router-view></router-view>

          <div class="layout-copy">
            test
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/layout/SideMenu';
import Navigator from '@/components/layout/Navigator';
import TopMenu from '@/components/layout/TopMenu';
import Login from '@/components/Login';
import constant from '@/constant';

export default {
  data() {
    return {
      errorMessage: '',
      loginSettle: false
    };
  },
  computed: {
    permissions() {
      const permissionArr = this.$store.state.user.permissions || [];
      const result = {};
      permissionArr.forEach((permission) => {
        result[permission] = {
          name: permission,
          menuName: constant.permissionMenuMap[permission] || 'Unknown menu'
        };
      });
      return result;
    },
    notLogin() {
      let result = true;
      if (this.$store.state.user && this.$store.state.user.userInfo) {
        result = false;
      }
      return result;
    }
  },
  created() {
    // Get the login info or session
    this.$http.get('sessions').then((res) => {
      this.loginSettle = true;

      const data = res.data ? res.data.data[0] : null;
      if (data && data.id && data.username) {
        this.$store.commit('updateUser', data);
        this.$router.replace('dashboard'); // User should at least have the dashborad permission
      } else {
        this.$store.commit('clearUser');
      }
    }, (err) => {
      this.$store.commit('clearUser');
      console.error('App - session request error', err);
    });
  },
  components: {
    'login-view': Login,
    'side-menu': SideMenu,
    'navigator': Navigator,
    'top-menu': TopMenu
  }
};
</script>

<style scoped>
.error-message {
  font-size: 13px;
}

.error-wrapper {
  z-index: 1;
  position: absolute;
  width: 100%;
}

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  height: 100%;
  min-height: 100%;
}

.layout-breadcrumb {
  padding: 10px 15px 0;
}

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

.layout-copy {
  text-align: center;
  padding: 20px 0 20px;
  color: #9ea7b4;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.layout-menu-left {
  background: #464c5b;
}

.layout-header {
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.top-menu-section {
  padding-top: 15px;
}
</style>
