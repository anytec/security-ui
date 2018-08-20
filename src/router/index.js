import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'homepage');
// const mylist = r => require.ensure([], () => r(require('@/pages/list')), 'list');

// 数据可视化
const dataview = r => require.ensure([], () => r(require('@/pages/dataview')), 'dataview');

// 人脸检索
const facepath = r => require.ensure([], () => r(require('@/pages/facepath')), 'facepath');

// 实时监控
const realtimem = r => require.ensure([], () => r(require('@/pages/realtimem')), 'realtimem');

// 历史人脸
const historyface = r => require.ensure([], () => r(require('@/pages/historyface')), 'historyface');
const historyface1 = r => require.ensure([], () => r(require('@/pages/historyface1')), 'historyface1');
const historyface2 = r => require.ensure([], () => r(require('@/pages/historyface2')), 'historyface2');

// 布控管理
const mmanage = r => require.ensure([], () => r(require('@/pages/mmanage')), 'mmanage');
const mmanage1 = r => require.ensure([], () => r(require('@/pages/mmanage1')), 'mmanage1');
const mmanage2 = r => require.ensure([], () => r(require('@/pages/mmanage2')), 'mmanage2');
const mmanage3 = r => require.ensure([], () => r(require('@/pages/mmanage3')), 'mmanage3');
const mmanage4 = r => require.ensure([], () => r(require('@/pages/mmanage4')), 'mmanage4');

// 系统管理
const systemm = r => require.ensure([], () => r(require('@/pages/systemm')), 'systemm');

// const history2 = r => require.ensure([], () => r(require('@/pages/history2')), 'history2');

Vue.use(Router)

const  routes=[
	{
		path: '/',
		name: 'login',
		component: login,
		meta:{
			title: '登录',
			index: 1,
		},
	},
	// {
	// 	path: '/list',
	// 	name: 'mylist',
	// 	component: mylist,
	// 	meta:{
	// 		title: 'mylist',
	// 		index: 2,
	// 	},
	// },
	// {
	// 	path: '/history2',
	// 	name: 'history2',
	// 	component: history2,
	// 	meta:{
	// 		title: 'history2',
	// 		index: 2,
	// 	},
	// },
	{
		path: '/homepage',
		name: 'homepage',
		component: homepage,
		meta:{
			title: 'homepage',
			index: 2,
			requireAuth: true,
			keep_alive: true, // 是否缓存
		},
		children:[
		{
			path: '/dataview',
			name: 'dataview',
			component: dataview,
			meta:{
				title: 'dataview',
				index: 3,
				requireAuth: true,
				keep_alive: true,
			},
		},
		{
			path: '/facepath',
			name: 'facepath',
			component: facepath,
			meta:{
				title: 'facepath',
				index: 3,
				requireAuth: true,
				keep_alive: true,
			},
		},
		{
			path: '/realtimem',
			name: 'realtimem',
			component: realtimem,
			meta:{
				title: 'realtimem',
				index: 3,
				requireAuth: true,
				keep_alive: true,
			},
		},
		{
			path: '/historyface',
			name: 'historyface',
			component: historyface,
			meta:{
				title: 'historyface',
				index: 3,
				requireAuth: true,
				keep_alive: false,
			},
			redirect: '/historyface1',
			children:[{
				path: '/historyface1',
				name: 'historyface1',
				component: historyface1,
				meta:{
					title: 'historyface1',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/historyface2',
				name: 'historyface2',
				component: historyface2,
				meta:{
					title: 'historyface2',
					index: 5,
					requireAuth: true,
					keep_alive: false,
				},
			}]
		},
		{
			path: '/mmanage',
			name: 'mmanage',
			component: mmanage,
			meta:{
				title: 'mmanage',
				index: 3,
				requireAuth: true,
				keep_alive: false,
			},
			redirect: '/mmanage1',
			children:[{
				path: '/mmanage1',
				name: 'mmanage1',
				component: mmanage1,
				meta:{
					title: 'mmanage1',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage2',
				name: 'mmanage2',
				component: mmanage2,
				meta:{
					title: 'mmanage2',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage3',
				name: 'mmanage3',
				component: mmanage3,
				meta:{
					title: 'mmanage3',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage4',
				name: 'mmanage4',
				component: mmanage4,
				meta:{
					title: 'mmanage4',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},]
		},
		{
			path: '/systemm',
			name: 'systemm',
			component: systemm,
			meta:{
				title: 'systemm',
				index: 3,
				requireAuth: true,
				keep_alive: true,
			},
		},
		]
	},
]

export default new Router({
	// mode: 'history',
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
