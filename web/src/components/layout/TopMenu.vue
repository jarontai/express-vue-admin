<template>
  <div class="top-menu">
    <Dropdown trigger="click" @on-click="action">
      <a href="javascript:void(0)">
        <Icon type="person" size="15"></Icon>
        <Icon type="arrow-down-b" size="15"></Icon>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item name="password">修改密码</Dropdown-item>
        <Dropdown-item name="logout">登出</Dropdown-item>
      </Dropdown-menu>
    </Dropdown>

    <Modal width="400" v-model="passwordModal" title="修改密码" @on-ok="confirm(true)" @on-cancel="confirm(false)">
      <Form ref="dataModel" :model="dataModel" :rules="rules" :label-width="100">
        <Form-item label="原密码" prop="oldPassword">
          <Input type="password" v-model="dataModel.oldPassword" placeholder="请输入原密码"></Input>
        </Form-item>
        <Form-item label="新密码" prop="newPassword">
          <Input type="password" v-model="dataModel.newPassword" placeholder="请输入新密码"></Input>
        </Form-item>
        <Form-item label="重复新密码" prop="newPasswordRepeat">
          <Input type="password" v-model="dataModel.newPasswordRepeat" placeholder="请重复新密码"></Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  data() {
    return {
      passwordModal: false,
      dataModel: {},
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ],
        newPasswordRepeat: [
          { required: true, message: '新密码重复不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    action(name) {
      if (name === 'logout') {
        this.$http.delete('sessions').then(() => {
          this.$store.commit('clearUser');
        });
      } else if (name === 'password') {
        this.dataModel = {};
        this.passwordModal = true;
      }
    },
    confirm(result) {
      if (result) {
        this.$refs['dataModel'].validate((valid) => {
          if (valid) {
            this.$http.post('sessions/update-password', {
              oldPassword: this.dataModel.oldPassword,
              newPassword: this.dataModel.newPassword,
              newPasswordRepeat: this.dataModel.newPasswordRepeat
            }).then(() => {
              this.$Message.success('修改成功!');
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      } else {
        // TODO - 页面值不会被重置 - https://github.com/iview/iview/issues/970
        this.$refs['dataModel'].resetFields();
      }
    }
  }
};
</script>

<style scoped>

</style>
