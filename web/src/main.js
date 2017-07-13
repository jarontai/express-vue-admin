// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'iview/dist/styles/iview.css';
import iView from 'iview';
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import EventBus from './event_bus';

Vue.use(VueResource);
Vue.use(iView);
Vue.config.productionTip = false;
// Vue.http.options.root = 'http://localhost:8080/api';
Vue.http.options.root = 'http://localhost:6060';
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    // 通过event bus发送错误消息
    const body = response.body;
    if (body && body.code !== undefined && body.code !== 0) {
      EventBus.$emit('error', { 'code': body.code, 'message': body.message });
    } else if (response && response.status !== 200) {
      let message = response.statusText;
      switch (response.status) {
        case 404:
          message = '页面或接口不存在!';
          break;
        case 500:
          message = '服务器内部错误!';
          break;
        default:
          break;
      }
      EventBus.$emit('error', { 'code': response.status, 'message': message });
    }

    if (body && body.data) {
      response.data = body.data;
    } else {
      response.data = body;
    }
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
