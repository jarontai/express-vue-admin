<template>
  <div>
    <Row justify="center" align="middle" class="top-row">
      <Col span="8" offset="8" class="title-col">express-vue-admin</Col>
    </Row>

    <Row justify="center" align="middle" class="login-row">
      <Col span="24" class="login-col">
        <Card class="login-card">
          <p slot="title">
            请登录
          </p>
          <div class="login-form">
            <Form ref="formLogin" :model="formLogin" :rules="ruleCustom" :label-width="40">
              <Form-item label="用户" prop="username">
                <Input type="text" v-model="formLogin.username" />
              </Form-item>
              <Form-item label="密码" prop="password">
                <Input type="password" v-model="formLogin.password" />
              </Form-item>
              <Form-item>
                <Button long type="primary" @click="handleSubmit('formLogin')">登录</Button>
              </Form-item>
            </Form>
          </div>
        </Card>

        <Poptip trigger="hover" placement="bottom-start" class="tip-section">
          <Button small type="dashed" shape="circle">登录信息</Button>
          <div class="tip-table" slot="content">
            <table>
              <tbody>
                <tr>
                  <td>admin / adminpwd</td>
                </tr>
                <tr>
                  <td>test / testpwd</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Poptip>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    function validateUsername(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入邮箱或用户名'));
      } else {
        callback();
      }
    }

    function validatePassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    }

    return {
      tip: true,
      formLogin: {
        username: '',
        password: ''
      },
      ruleCustom: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('sessions', {
            username: this.formLogin.username,
            password: this.formLogin.password
          }).then((res) => {
            const data = res.data.data;
            if (data && data.id && data.username) {
              this.$store.commit('updateUser', data);
              this.$router.replace('/dashboard'); // 默认所有后台用户都拥有dashboard权限
            }
          });
        } else {
          this.$Message.error('信息验证失败，请检查!');
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-row {
  height: 160px;
}

.title-col {
  padding-top: 100px;
  padding-bottom: 60px;
  height: 100px;
  text-align: center;
  font-size: 24px;
}

.login-col {
  text-align: center;
}

.login-form {
  padding: 20px 30px 0 30px;
}

.login-card {
  margin: auto;
  width: 380px;
  text-align: center;
}

.tip-section {
  position: relative;
  top: -335px;
  left: 270px;
}

.login-spin {
  padding-top: 80px;
}

</style>
