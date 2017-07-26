import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import AdminUser from '@/components/admin/User';
import AdminRole from '@/components/admin/Role';
import AdminPermission from '@/components/admin/Permission';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/dashboard',
      component: Dashboard
    },
    {
      path: '/admin/user',
      component: AdminUser
    },
    {
      path: '/admin/role',
      component: AdminRole
    },
    {
      path: '/admin/permission',
      component: AdminPermission
    }
  ]
});
