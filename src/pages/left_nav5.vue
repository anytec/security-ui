<template>
	<!--html,不用head和body-->
	<div class="left_nav">
		<el-menu :default-active="activeIndex" class="el-menu-vertical-demo"  text-color="#fff" active-text-color="#00fcff" router>
			<el-submenu index="1">
				<template slot="title">
					<img src="../assets/nav_icon/nav_icon5_1.png" />
					<span>底库管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/mmanage1">底库配置</el-menu-item>
					<el-menu-item index="/mmanage2">底库人员配置</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<img src="../assets/nav_icon/nav_icon5_2.png" />
					<span>设备管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/mmanage3">设备组配置</el-menu-item>
					<el-menu-item index="/mmanage4">设备配置</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				activeIndex:"/mmanage1"
			}
		},
		watch:{
			$route(to,from){
				this.activeIndex = to.path
			}
		},
		created:function(){
			this.activeIndex = this.$route.path
		}
	}
</script>

<style>
	/*css*/
	@import "../css/left_nav5.css";
</style>