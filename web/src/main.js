// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'view-design/dist/styles/iview.css';
import iView from 'view-design';
import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import App from './App';
import EventBus from './event_bus';
import router from './router';

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(iView);

Vue.config.productionTip = false;

Vue.http.options.root = 'http://localhost:3000/api/v1';

Vue.http.interceptors.push(function (request, next) {
  request.credentials = true; // Enable cookie sending

  this.$Loading.start();

  // Global http error processing
  next(function (response) {
    const data = response.data;
    if (data && data.code > 0) {
      this.$Message.warning({
        content: data.message || 'Unknown error',
        duration: 5
      });
      this.$Loading.error();
    } else if (response && response.status !== 200) {
      let message = response.statusText;
      switch (response.status) {
        case 404:
          message = 'Page not found';
          break;
        case 500:
          message = 'Server internal error!';
          break;
        default:
          break;
      }
      this.$Message.warning({
        content: message || 'Unknown error',
        duration: 5
      });
      this.$Loading.error();
    } else {
      this.$Loading.finish();
    }
  });
});

const store = new Vuex.Store({
  state: {
    user: {
      userInfo: null,
      roles: [],
      permissions: []
    }
  },
  mutations: {
    /* eslint-disable */
    clearUser(state) {
      state.user.userInfo = null;
      state.user.roles = [];
      state.user.permissions = [];
    },
    updateUser(state, data) {
      if (data.id && data.username) {
        state.user.userInfo = {
          id: data.id,
          username: data.username
        };
        state.user.roles = data.roles || [];
        state.user.permissions = data.permissions || [];
      }
    }
  }
});

router.beforeEach((to, from, next) => {
  const path = to.path.substr(1);
  const pathPermission = path.split('/').join(':');
  const permissions = store.state.user.permissions || [];
  if (permissions.indexOf(pathPermission) < 0) {
    next(false);
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  EventBus.$emit('route-change', {
    to: to,
    from: from
  });
});

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
/* eslint-enable */
