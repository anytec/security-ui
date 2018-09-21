<template>
	<div class="left_nav">
		<ul class="left_ul">
			<li class="left_one" :class="{'leftli_active':isactive1}" @click="change_active(1)" @mouseenter="enter(0)" @mouseleave="leave">
				<div class="left_icondiv"><img  src="../assets/nav_icon/hi1_icon1.png" /></div>
				<div class="left_icontext">历史报警</div>
			</li>
			<li class="left_two" :class="{'leftli_active':isactive2}" @click="change_active(2)" @mouseenter="enter(1)" @mouseleave="leave">
				<div class="left_icondiv"><img  src="../assets/nav_icon/hi1_icon2.png" /></div>
				<div class="left_icontext">历史抓拍</div>
			</li>
			<div class="left_active" :style="{ top: 50*listnum + 'px' }"></div>
		</ul>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				isactive1: true,
				isactive2: false,
				listnum: 0,
				active_num: 0,
			}
		},
		methods:{
			change_active:function(num){
				this.isactive1 = false
				this.isactive2 = false
				this["isactive"+num] = true
				this.active_num = num-1

				if(num === 1){
					this.$router.push('/historyface1');
				}else if(num === 2){
					this.$router.push('/historyface2');
				}
			},
			enter:function(num){
				this.listnum = num
			},
			leave:function(){
				this.listnum = this.active_num
			},
			change_leftnav_active:function(){
				if(this.$route.path === "/historyface2"){
					this.isactive1 = false
					this.isactive2 = true
					this.listnum = 1
				}else if( this.$route.path === "/historyface1" ){
					this.isactive1 = true
					this.isactive2 = false
					this.listnum = 0
				}
			}
		},
		created:function(){
			this.change_leftnav_active()
		},
		watch:{
        	$route(to,from){
				// console.log(this.$route.path)
				this.change_leftnav_active()
			}
        }
	}
</script>

<style scoped>
	@import "../css/left_nav.css";
</style>
