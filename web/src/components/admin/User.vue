<template>
  <div class="admin-user-view">
    <Card>
      <p slot="title">用户列表</p>
      <Table border :data="tableData" :columns="tableColumns" stripe>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="editModal" title="编辑用户信息" @on-ok="edit(true)" @on-cancel="edit(false)">
      <Form ref="dataModel" :model="dataModel" :rules="rules" :label-width="80">
        <Form-item label="姓名" prop="username">
          <Input v-model="dataModel.username" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="dataModel.password" placeholder="********"></Input>
        </Form-item>
        <Form-item label="启用" prop="enabled">
          <i-switch v-model="dataModel.enabled"></i-switch>
        </Form-item>
      </Form>
    </Modal>

  </div>
</template>

<script>
export default {
  data() {
    return {
      dataModel: {},
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { type: 'string', min: 3, message: '姓名不能少于3位', trigger: 'blur' }
        ],
        password: [
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ]
      },
      editModal: false,
      totalCount: 1,
      pageCount: 10,
      tableData: [],
      tableColumns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          align: 'center'
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          render: (h, params) => {
            const roles = params.row.roles || [];
            const roleNames = roles.map(role => role.name);
            return roleNames.join(', ');
          }
        },
        {
          title: '状态',
          key: 'disabled',
          align: 'center',
          render: (h, params) => {
            const disabled = params.row.disabled;
            const color = disabled ? 'red' : 'green';
            const text = disabled ? '禁用' : '启用';
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text);
          }
        },
        {
          title: '创建时间',
          key: 'createdAt',
          align: 'center',
          render: (h, params) => moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '更新时间',
          key: 'updatedAt',
          align: 'center',
          render: (h, params) => moment(params.row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '操作',
          key: 'actions',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showEdit(params.index);
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index);
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.changePage(1);
  },
  methods: {
    changePage(page) {
      page = page || 1;
      this.$http.get(`admin/users?limit=10&offset=${(page - 1) * 10}`).then((res) => {
        const data = res.data.data;
        this.tableData = data.rows;
        this.totalCount = data.count;
      });
    },
    showEdit(index) {
      const data = this.tableData[index];
      this.dataModel.id = data.id;
      this.dataModel.username = data.username;
      this.dataModel.enabled = !data.disabled;
      this.dataModel.password = '';
      this.editModal = true;
    },
    edit(result) {
      if (result) {
        this.$refs['dataModel'].validate((valid) => {
          if (valid) {
            this.$http.put(`admin/users/${this.dataModel.id}`, {
              password: this.dataModel.password || undefined,
              username: this.dataModel.username || undefined,
              disabled: !this.dataModel.enabled
            }).then(() => {
              this.$Message.success('编辑成功!');
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      } else {
        this.$refs['dataModel'].resetFields();
        // TODO - 页面值不会被重置 - https://github.com/iview/iview/issues/970
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
