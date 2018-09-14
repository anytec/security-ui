// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './element'
import './axios'
import store from './vuex'
// import echarts from 'echarts'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data:{
  	charts: [],
  }
})


// 登录拦截
router.beforeEach((to, from, next) => {
	// console.log(to)
	if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否跳转到需要登陆权限的页面
		if (!store.state.user.uname) {// 判断是否登录
			next({
				path: '/login',  //没登录则跳转到登录界面
			})
			Vue.prototype.$message({
				type: 'warning',
				message: "请先登录",
				showClose: true,
				center: true
			})
		}else{
			next()
		}
	}else{
		next()
	}
})
