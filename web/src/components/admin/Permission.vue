<template>
  <Card class="admin-role-view">
    <p slot="title">权限列表</p>
    <Table border :data="tableData" :columns="tableColumns" stripe>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalCount" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  data() {
    return {
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
          title: '权限名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createdAt',
          align: 'center',
          render(h, params) {
            return moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          title: '更新时间',
          key: 'updatedAt',
          align: 'center',
          render(h, params) {
            return moment(params.row.updatedAt).format('YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          title: '操作',
          key: 'actions',
          align: 'center',
          render(h, params) {
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
                    this.show(params.index);
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
      this.$http.get(`admin/permissions?limit=10&offset=${(page - 1) * 10}`).then((res) => {
        const data = res.data.data;
        this.tableData = data.rows;
        this.totalCount = data.count;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
