<template>
  <div class="layout">
    <Row type="flex" style="height: 100%; min-height: 100%;">
      <i-col span="3" class="layout-menu-left">
        <side-menu></side-menu>
      </i-col>

      <i-col span="21">
        <div class="error-wrapper" v-if="errorMessage && errorMessage.length">
          <Alert type="warning" show-icon>
            <i class="error-message">{{ errorMessage }}</i>
          </Alert>
        </div>

        <div class="layout-header"></div>

        <navigator></navigator>

        <main-content></main-content>

        <div class="layout-copy">
          2011-2016 &copy; TalkingData
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import SideMenu from '@/components/layout/SideMenu';
import Navigator from '@/components/layout/Navigator';
import MainContent from '@/components/layout/MainContent';

export default {
  props: ['user'],
  watch: {
    user() {
      console.log('user change');
    }
  },
  data() {
    return {
      errorMessage: ''
    };
  },
  computed: {
  },
  methods: {
  },
  created: function () {
    // TODO 执行初始化工作
    // this.$http.get('gets').then(function () {
    // }, function (err) {
    //   console.error(err);
    // });
  },
  components: {
    'side-menu': SideMenu,
    'navigator': Navigator,
    'main-content': MainContent
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
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.layout-menu-left {
  background: #464c5b;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}
</style>
