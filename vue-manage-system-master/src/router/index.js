import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/inventory',
                    component: () => import('../components/page/Inventory.vue'),
                    meta: {title: '库存情况'}
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '商品上传' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    path: '/orderTable',
                    component: ()=> import('../components/page/OrderTable.vue'),
                    meta: {title: '订单表'}
                },
                {
                    path: '/profitTable',
                    component: ()=> import('../components/page/ProfitTable.vue'),
                    meta: {title: '销售情况'}
                },
                {
                    path: '/orderDetail',
                    component: () => import('../components/page/OrderDetail.vue'),
                    meta: {title: '订单详情'}

                },
                {
                    path: '/orderDetailAll',
                    component: ()=> import('../components/page/OrderDetailAll.vue'),
                    meta: {title: '所有订单'}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/RegisterForm',
                    component: ()=>import('../components/page/RegisterForm'),
                    meta: { title: '用户注册'}
                },
                {
                    path: 'UserTable',
                    component: () => import('../components/page/UserTable.vue'),
                    meta: { title:'用户管理'}
                }



            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
