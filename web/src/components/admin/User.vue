<template>
  <div class="admin-user-view">
    <Table border :data="tableData" :columns="tableColumns" stripe>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="100" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
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
            const roleNames = roles.map((role) => role.name);
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
          render: (h, params) => {
            return moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss');
          }
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
                    this.show(params.index)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    }
  },
  created() {
    this.changePage(1);
  },
  methods: {
    changePage(page) {
      // TODO - 分页
      this.$http.get('admin/users').then((res) => {
        const data = res.data.data;
        this.tableData = data;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
