<template>
  <div class="admin-user-view">
    <Card dis-hover>

      <Row type="flex" justify="center" class="table-action-section">
        <Col span="22"><b>用户列表</b></Col>
        <Col span="2">
          <Button type="primary" size="small" @click="showCreate">新增</Button>
        </Col>
      </Row>

      <Table border :data="tableData" :columns="tableColumns" stripe>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total :total="totalCount" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>

    <Modal width="400" v-model="editModal" title="编辑用户信息" @on-ok="edit(true)" @on-cancel="edit(false)">
      <Form ref="dataModel" :model="dataModel" :rules="rules" :label-width="80">
        <Form-item label="姓名" prop="username">
          <Input v-model="dataModel.username" placeholder="请输入姓名" :disabled="dataModel.username === 'admin'"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="dataModel.password" placeholder="********"></Input>
        </Form-item>
        <Form-item label="启用" prop="enabled">
          <i-switch v-model="dataModel.enabled" :disabled="dataModel.username === 'admin'"></i-switch>
        </Form-item>
        <Form-item label="角色">
          <Checkbox-group>
            <Checkbox v-for="role in allRoles" :label="role.name" :key="role.name" v-model="role.selected" :disabled="dataModel.username === role.name"></Checkbox>
          </Checkbox-group>
        </Form-item>
      </Form>
    </Modal>

    <Modal width="300" v-model="destroyModal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>用户删除确认</span>
      </p>
      <div style="text-align:center; font-size:14px" >
        <p>用户：{{ destroyData ? destroyData.username : '-'}}</p>
        <p>将被删除且无法恢复，是否继续？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="destroy(true)">删除</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
const _ = require('lodash');
const moment = require('moment');

export default {
  data() {
    return {
      allRoles: [],
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
      destroyModal: false,
      destroyData: null,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
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
            return h('span', {}, roleNames.join(', ') || '-');
          }
        },
        {
          title: '状态',
          key: 'disabled',
          align: 'center',
          render: (h, params) => {
            const disabled = params.row.disabled;
            const color = disabled ? 'error' : 'success';
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
          render: (h, params) => h('span', {}, moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'))
        },
        {
          title: '更新时间',
          key: 'updatedAt',
          align: 'center',
          render: (h, params) => h('span', {}, moment(params.row.updatedAt).format('YYYY-MM-DD HH:mm:ss'))
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
                  size: 'small',
                  disabled: (params.row.username && params.row.username === 'admin')
                },
                on: {
                  click: () => {
                    this.showDestroy(params.index);
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
    this.$http.get('admin/roles?limit=100').then((res) => {
      const data = res.data.data;
      this.allRoles = data.rows;
    });
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.$http.get(`admin/users?limit=10&offset=${((page || 1) - 1) * this.pageSize}`).then((res) => {
        const data = res.data.data;
        this.tableData = data.rows;
        this.totalCount = data.count;
      });
    },
    showCreate() {
      this.dataModel = {};
      const allRoles = this.allRoles;
      _.forEach(allRoles, (role) => {
        role.selected = false;
      });
      this.dataModel.roles = allRoles;
      this.editModal = true;
    },
    showDestroy(index) {
      this.destroyData = this.tableData[index];
      this.destroyModal = true;
    },
    destroy(result) {
      if (result && this.destroyData) {
        this.$http.delete(`admin/users/${this.destroyData.id}`).then(() => {
          this.$Message.success('删除成功!');
          this.refresh();
        });
      }
      this.destroyModal = false;
    },
    refresh() {
      if (this.currentPage) {
        this.changePage(this.currentPage);
      }
    },
    showEdit(index) {
      const data = this.tableData[index];
      this.dataModel.id = data.id;
      this.dataModel.username = data.username;
      this.dataModel.enabled = !data.disabled;
      this.dataModel.password = '';
      const allRoles = this.allRoles;
      const userRoles = data.roles;
      _.forEach(allRoles, (role) => {
        role.selected = false;
        _.forEach(userRoles, (userRole) => {
          if (role.name === userRole.name) {
            role.selected = true;
            return false;
          }
        });
      });
      this.dataModel.roles = allRoles;
      this.editModal = true;
    },
    edit(result) {
      if (result) {
        this.$refs['dataModel'].validate((valid) => {
          if (valid) {
            const dataId = this.dataModel.id;
            const roles = [];
            _.forEach(this.dataModel.roles, (role) => {
              if (role.selected) {
                roles.push(role.name);
              }
            });
            if (dataId) { // 编辑
              this.$http.put(`admin/users/${dataId}`, {
                password: this.dataModel.password || undefined,
                username: this.dataModel.username || undefined,
                disabled: !this.dataModel.enabled,
                roles: roles
              }).then(() => {
                this.$Message.success('编辑成功!');
                this.refresh();
              });
            } else { // 新增
              this.$http.post('admin/users', {
                password: this.dataModel.password || undefined,
                username: this.dataModel.username || undefined,
                disabled: !this.dataModel.enabled,
                roles: roles
              }).then(() => {
                this.$Message.success('新增成功!');
                this.refresh();
              });
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      } else {
        // TODO - 页面值不会被重置 - https://github.com/iview/iview/issues/970
        // this.$refs['dataModel'].resetFields();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-action-section {
  border-bottom: 1px solid #e9eaec;
  height: 32px;
  margin-bottom: 12px;
}
</style>
