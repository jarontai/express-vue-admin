<template>
  <div>
    <Row justify="center" align="middle" class="login-row">
      <Col :xs="{ span: 14, offset: 5 }" :sm="{ span: 8, offset: 8 }" :md="{ span: 8, offset: 8 }" :lg="{ span: 4, offset: 10 }" class="login-col">
      <div class="login-title">
        <Spin size="large" class="login-spin" v-show="loading"></Spin>&nbsp;&nbsp;express-vue-admin
      </div>
      <Card class="login-card">
        <p slot="title">
          请登录
        </p>
        <Form ref="formLogin" :model="formLogin" :rules="ruleCustom" :label-width="40">
          <Form-item label="邮箱" prop="email">
            <Input type="text" v-model="formLogin.email"></Input>
          </Form-item>
          <Form-item label="密码" prop="password">
            <Input type="password" v-model="formLogin.password"></Input>
          </Form-item>
          <Form-item>
            <Button long type="success" @click="handleSubmit('formLogin')">登录</Button>
          </Form-item>
        </Form>
      </Card>
      </Col>

      <Col offset="1" span="1" class="tip-col">
      <Poptip trigger="hover" placement="right">
        <Button type="ghost" shape="circle">登录信息</Button>
        <div class="tip-table" slot="content">
          <table>
            </thead>
            <tbody>
              <tr>
                <td>admin / adminpwd</td>
              </tr>
              <tr>
                <td>user / userpwd</td>
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
    function validateEmail(rule, value, callback) {
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
      loading: false,
      tip: true,
      formLogin: {
        email: '',
        password: ''
      },
      ruleCustom: {
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('sessions', {
            username: this.formLogin.email,
            password: this.formLogin.password
          }).then((res) => {
            const data = res.data.data;
            if (data && data.id && data.username) {
              this.$store.commit('updateUser', data);
              this.$router.replace('/dashboard'); // 默认所有后台用户都拥有dashboard权限
            }
            setTimeout(() => {
              this.loading = false;
            }, 2000);
          });
        } else {
          this.$Message.error('信息验证失败，请检查!');
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    mouseover() {
      if (!this.tip) {
        this.tip = true;
      }
    },
    mouseout() {
      this.tip = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-row {
  height: 100px;
}

.login-card {
  width: 100%;
  margin-top: 10%;
}

.login-row {
  height: 100%;
}

.login-title {
  margin-top: 145px;
  text-align: center;
  font-size: 24px;
}

.login-tip {
  background: #5cb85c;
}

.login-spin {
  width: 35px;
}

.tip-col {
  padding-top: 210px;
}
</style>
