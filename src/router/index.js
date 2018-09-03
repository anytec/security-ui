import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'homepage');
// const mylist = r => require.ensure([], () => r(require('@/pages/list')), 'list');

// 数据可视化
const dataview = r => require.ensure([], () => r(require('@/pages/dataview')), 'dataview');
const dataview1 = r => require.ensure([], () => r(require('@/pages/dataview/dataview1')), 'dataview1');
const dataview2 = r => require.ensure([], () => r(require('@/pages/dataview/dataview2')), 'dataview2');
const dataview3 = r => require.ensure([], () => r(require('@/pages/dataview/dataview3')), 'dataview3');

// 人脸检索
const facepath = r => require.ensure([], () => r(require('@/pages/facepath')), 'facepath');
const facepath_offline = r => require.ensure([], () => r(require('@/pages/facepath_offline')), 'facepath_offline');

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
const mmanage4_offline = r => require.ensure([], () => r(require('@/pages/mmanage4_offline')), 'mmanage4_offline');

// 系统管理
const systemm = r => require.ensure([], () => r(require('@/pages/systemm')), 'systemm');
const systemm1 = r => require.ensure([], () => r(require('@/pages/systemm1')), 'systemm1');
const systemm2 = r => require.ensure([], () => r(require('@/pages/systemm2')), 'systemm2');

// const history2 = r => require.ensure([], () => r(require('@/pages/history2')), 'history2');

Vue.use(Router)

const  routes=[
	{
		path: '/',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'login',
		component: login,
		meta:{
			title: '登录',
			index: 1,
			requireAuth: false,
			keep_alive: false, // 是否缓存
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
			keep_alive: false, // 是否缓存
		},
		children:[
		{
			path: '/dataview',
			name: 'dataview',
			component: dataview,
			meta:{
				title: '数据可视化',
				index: 3,
				requireAuth: true,
				keep_alive: false,
			},
			redirect: '/dataview2',
			children:[
				{
					path: '/dataview1',
					name: 'dataview1',
					component: dataview1,
					meta:{
						title: '数据可视化',
						index: 2,
						requireAuth: true,
						keep_alive: false,
					},
				},
				{
					path: '/dataview2',
					name: 'dataview2',
					component: dataview2,
					meta:{
						title: '数据可视化',
						index: 3,
						requireAuth: true,
						keep_alive: false,
					},
				},
				{
					path: '/dataview3',
					name: 'dataview3',
					component: dataview3,
					meta:{
						title: '数据可视化',
						index: 4,
						requireAuth: true,
						keep_alive: false,
					},
				},
			]
		},
		{
			path: '/facepath',
			name: 'facepath',
			component: facepath,
			meta:{
				title: '人脸检索-在线',
				index: 3,
				requireAuth: true,
				keep_alive: true,
			},
		},
		{
			path: '/facepath_offline',
			name: 'facepath_offline',
			component: facepath_offline,
			meta:{
				title: '人脸检索-离线',
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
				title: '实时监控',
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
				title: '历史人脸',
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
					title: '历史人脸-历史报警',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/historyface2',
				name: 'historyface2',
				component: historyface2,
				meta:{
					title: '历史人脸-历史抓拍',
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
				title: '布控管理',
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
					title: '布控管理-底库管理',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage2',
				name: 'mmanage2',
				component: mmanage2,
				meta:{
					title: '布控管理-底库人员配置',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage3',
				name: 'mmanage3',
				component: mmanage3,
				meta:{
					title: '布控管理-设备组配置',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage4',
				name: 'mmanage4',
				component: mmanage4,
				meta:{
					title: '布控管理-设备配置',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/mmanage4_offline',
				name: 'mmanage4_offline',
				component: mmanage4_offline,
				meta:{
					title: '布控管理-设备配置',
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
			redirect: '/systemm1',
			children:[{
				path: '/systemm1',
				name: 'systemm1',
				component: systemm1,
				meta:{
					title: '系统管理-用户列表',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			},{
				path: '/systemm2',
				name: 'systemm2',
				component: systemm2,
				meta:{
					title: '系统管理-操作记录',
					index: 4,
					requireAuth: true,
					keep_alive: false,
				},
			}]
		},
		]
	},
]

export default new Router({
	// mode: 'history',
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
