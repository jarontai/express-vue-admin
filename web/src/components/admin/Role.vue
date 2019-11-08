<template>
  <div class="admin-user-view">
    <Card dis-hover>

      <Row type="flex" justify="center" class="table-action-section">
        <Col span="22">
          <b>角色列表</b>
        </Col>
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

    <Modal width="400" v-model="editModal" title="编辑角色信息" @on-ok="edit(true)" @on-cancel="edit(false)">
      <Form ref="dataModel" :model="dataModel" :rules="rules" :label-width="80">
        <Form-item label="角色" prop="name">
          <Input v-model="dataModel.name" placeholder="请输入角色名称" :disabled="dataModel.name === 'admin'"></Input>
        </Form-item>
        <Form-item label="备注" prop="comment">
          <Input v-model="dataModel.comment" placeholder="请输入角色备注" :disabled="dataModel.name === 'admin'"></Input>
        </Form-item>
      </Form>
    </Modal>

    <!--// TODO - use tree component-->
    <Modal width="400" v-model="permissionModal" title="编辑角色权限" @on-ok="editPermission(true)" @on-cancel="editPermission(false)">
      <Form :label-width="80">
        <Form-item label="权限">
          <Checkbox-group>
            <Checkbox :disabled="permission.name === 'dashboard'" v-for="permission in allPermissions" :label="permission.name" :key="permission.name" v-model="permission.selected"></Checkbox>
          </Checkbox-group>
        </Form-item>
      </Form>
    </Modal>

    <Modal width="300" v-model="destroyModal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>角色删除确认</span>
      </p>
      <div style="text-align:center; font-size:14px">
        <p>角色：{{ destroyData ? destroyData.name : '-'}}</p>
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
      allPermissions: [],
      dataModel: {},
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { type: 'string', min: 3, message: '名称不能少于3位', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '角色备注不能为空', trigger: 'blur' },
          { type: 'string', min: 2, message: '备注不能少于2位', trigger: 'blur' }
        ]
      },
      permissionModal: false,
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
          title: '角色',
          key: 'name',
          align: 'center'
        },
        {
          title: '备注',
          key: 'comment',
          align: 'center'
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
                  size: 'small',
                  disabled: (params.row.name && (params.row.name === 'admin' || params.row.name === 'member'))
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
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showEditPermissions(params.index);
                  }
                }
              }, '权限'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: (params.row.name && (params.row.name === 'admin' || params.row.name === 'member'))
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
    this.$http.get('admin/permissions?limit=1000').then((res) => {
      const data = res.data.data;
      this.allPermissions = data.rows;
    });
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.$http.get(`admin/roles?limit=10&offset=${((page || 1) - 1) * this.pageSize}`).then((res) => {
        const data = res.data.data;
        this.tableData = data.rows;
        this.totalCount = data.count;
      });
    },
    showCreate() {
      this.dataModel = {};
      this.editModal = true;
    },
    showEditPermissions(index) {
      const data = this.tableData[index];
      this.dataModel.id = data.id;
      const allPermissions = this.allPermissions;
      const userPermissions = data.permissions;
      _.forEach(allPermissions, (permission) => {
        permission.selected = false;
        _.forEach(userPermissions, (userPermission) => {
          if (permission.name === userPermission.name) {
            permission.selected = true;
            return false;
          }
        });
      });
      this.dataModel.permissions = allPermissions;
      this.permissionModal = true;
    },
    editPermission(result) {
      if (result) {
        const permissions = [];
        _.forEach(this.dataModel.permissions, (permission) => {
          if (permission.selected) {
            permissions.push(permission.name);
          }
        });
        this.$http.put(`admin/roles/${this.dataModel.id}/permissions`, {
          permissions: permissions
        }).then(() => {
          this.$Message.success('更新成功!');
          this.refresh();
        });
      }
      this.permissionModal = false;
    },
    showDestroy(index) {
      this.destroyData = this.tableData[index];
      this.destroyModal = true;
    },
    destroy(result) {
      if (result && this.destroyData) {
        this.$http.delete(`admin/roles/${this.destroyData.id}`).then(() => {
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
      this.dataModel.name = data.name;
      this.dataModel.comment = data.comment;
      this.editModal = true;
    },
    edit(result) {
      if (result) {
        this.$refs['dataModel'].validate((valid) => {
          if (valid) {
            const dataId = this.dataModel.id;
            if (dataId) { // 编辑
              this.$http.put(`admin/roles/${dataId}`, {
                name: this.dataModel.name || undefined,
                comment: this.dataModel.comment || undefined
              }).then(() => {
                this.$Message.success('编辑成功!');
                this.refresh();
              });
            } else { // 新增
              this.$http.post('admin/roles', {
                name: this.dataModel.name || undefined,
                comment: this.dataModel.comment || undefined
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
