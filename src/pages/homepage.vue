<template>
	<!--html,不用head和body-->
	<div class="main_box">
		<my-nav></my-nav>
		
		<transition :name="transitionName">
			<!-- <keep-alive> -->
				<router-view></router-view>
			<!-- </keep-alive> -->
		</transition>

	</div>
</template>

<script>
	import myNav from "./mynav" 
	//js
	export default {
		components : {
			myNav,
		},
		data(){
			return {
				transitionName: '',
			}
		},
		watch:{
			$route(to,from){
				this.transitionName = 'slide-left';
			}
		}
	}
</script>


<style scoped> 
	/*css*/
	/*@import "../css/list.css";*/
	.main_box{
		width: 100%;
		height: 100%;
		position: relative;
		margin: 0;
		min-width: 1920px;
		min-height: 974px;
		background: url(../assets/historyface/bg.jpg) no-repeat;
		background-size: 100% 100%;
	}

	/*界面切换样式*/
	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active{
		will-change: transform;
		transition: all 2000ms ease;
		position: absolute;
	}
	.slide-left-leave-active {
		will-change: transform;
		transition: all 1000ms ease;
		position: absolute;
	}
	.slide-right-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	.slide-right-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	.slide-left-enter {
		opacity: 0;
		/*-webkit-transform: translate3d(100%,0, 0);*/
		transform: translate3d(100%, 0, 0);
	}
	.slide-left-leave-active {
		opacity: 0;
		/*-webkit-transform: translate3d(-100%,0, 0);*/
		transform: translate3d(-100%, 0, 0);
	}
</style>