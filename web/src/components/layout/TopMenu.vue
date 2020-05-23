<template>
  <div class="top-menu">
    <Dropdown trigger="click" @on-click="action">
      <a href="javascript:void(0)">
        <Icon type="ios-person" size="18"></Icon>
        <Icon type="ios-arrow-down" size="18"></Icon>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item name="password">Password</Dropdown-item>
        <Dropdown-item name="logout">Logout</Dropdown-item>
      </Dropdown-menu>
    </Dropdown>

    <Modal width="400" v-model="passwordModal" title="Change password" @on-ok="confirm(true)" @on-cancel="confirm(false)">
      <Form ref="dataModel" :model="dataModel" :rules="rules" :label-width="100">
        <Form-item label="Old" prop="oldPassword">
          <Input type="password" v-model="dataModel.oldPassword" placeholder="Input old password" />
        </Form-item>
        <Form-item label="New" prop="newPassword">
          <Input type="password" v-model="dataModel.newPassword" placeholder="Input new password" />
        </Form-item>
        <Form-item label="Repeat" prop="newPasswordRepeat">
          <Input type="password" v-model="dataModel.newPasswordRepeat" placeholder="Repeat new Password" />
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
          { required: true, message: 'Invalid old password', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: 'Invalid new password', trigger: 'blur' },
          { type: 'string', min: 6, message: 'Length >= 6', trigger: 'blur' }
        ],
        newPasswordRepeat: [
          { required: true, message: 'Invalid new password', trigger: 'blur' },
          { type: 'string', min: 6, message: 'Length >= 6', trigger: 'blur' }
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
              this.$Message.success('Password updated!');
            });
          } else {
            this.$Message.error('Form invalid!');
          }
        });
      } else {
        // TODO: remove workround
        // Workround for - https://github.com/iview/iview/issues/970
        this.$refs['dataModel'].resetFields();
      }
    }
  }
};
</script>

<style scoped>

</style>
