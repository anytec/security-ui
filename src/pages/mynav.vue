<template>
	<!--html,不用head和body-->
		<div class="nav">
			<div class="left_logo">
				<img src="../assets/logo.png" />
			</div>
			<div class="center">
				<ul>
					<li class="one" :class="{ 'active_li': isactive1}"  @click="change_active(0)" @mouseenter="enter(0)" @mouseleave="leave">数据可视化</li>
					<li class="two" :class="{ 'active_li': isactive2}" @click="change_active(1)" @mouseenter="enter(1)" @mouseleave="leave">人脸检索</li>
					<li class="three" :class="{ 'active_li': isactive3}" @click="change_active(2)" @mouseenter="enter(2)" @mouseleave="leave">实时监控</li>
					<li class="four" :class="{ 'active_li': isactive4}" @click="change_active(3)" @mouseenter="enter(3)" @mouseleave="leave">历史人脸</li>
					<li class="five" :class="{ 'active_li': isactive5}" @click="change_active(4)" @mouseenter="enter(4)" @mouseleave="leave">布控管理</li>
					<li class="six" :class="{ 'active_li': isactive6}" @click="change_active(5)" @mouseenter="enter(5)" @mouseleave="leave">系统管理</li>
					<div class="active" id="active" :style="{ left: 150*listnum + 'px' }"></div>
					<div class="bg_active"></div>
				</ul>
			</div>
			<div class="right_user">
				<div class="map_model_box" @click="change_map_model">{{map_model}}</div>
				<div class="user_box">
					<div class="user_icon"><img src="../assets/user_icon.png"/></div>
					<div class="user_text" :title="username" >{{username}}</div>
				</div>
				<div class="cancellation" @click="logout">注销</div>
			</div>
		</div>
</template>

<script>
	//js
	export default {
		data(){
			return {
				isactive1 : true,
				isactive2 : false,
				isactive3 : false,
				isactive4 : false,
				isactive5 : false,
				isactive6 : false,
				listnum : 0,
				active_num: 0,
				// user: {},

				username: "",

				// 地图模式
				map_model: "在线",
			}
		},
		created:function(){
			this.change_mynav_active()
		},
		methods:{
			change_active:function(num){
				for(let i = 1; i < 7; i++){
					this["isactive"+i] = false
					if ( i === num + 1){
						this["isactive"+i] = true
						this.listnum = num
						this.active_num = num
					}
				}
				if( num === 0 ){
					this.$router.push('/dataview');
				}else if( num === 1 ){
					if( this.$store.state.facepath_model === "online" ){
						this.$router.push('/facepath')
					}else{
						this.$router.push('/facepath_offline')
					}
				}else if( num === 2 ){
					this.$router.push('/realtimem')
				}else if( num === 3 ){
					this.$router.push('/historyface1')
				}else if( num === 4 ){
					this.$router.push('/mmanage')
				}else if( num === 5 ){
					this.$router.push('/systemm')
				}
			},
			enter:function(num){
				this.listnum = num
			},
			leave:function(){
				this.listnum = this.active_num
			},
			logout:function(){
				this.$ajax.post("/user/logout").then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("注销成功")
                        this.$store.dispatch('logout').then(() => {
		                    this.$router.replace('/')
		                })
                    }else{
                        this.error_info('注销失败')
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
				
			},
			// 消息窗口
			error_info:function(mes){
				this.$message({
                    type: 'error',
                    message: mes,
                    showClose: true,
                    center: true,

                })
			},
			success_info:function(mes){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true,
                    duration: 1500,
                })
			},

			// 页面跳转导航响应
			change_mynav_active:function(){
				if( this.$route.path.indexOf("dataview") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive1 = true
					this.listnum = 0
					this.active_num = 0
				}else if( this.$route.path.indexOf("facepath") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive2 = true
					this.listnum = 1
					this.active_num = 1
				}else if( this.$route.path.indexOf("realtimem") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive3 = true
					this.listnum = 2
					this.active_num = 2
				}else if( this.$route.path.indexOf("historyface") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive4 = true
					this.listnum = 3
					this.active_num = 3
				}else if( this.$route.path.indexOf("mmanage") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive5 = true
					this.listnum = 4
					this.active_num = 4
				}else if( this.$route.path.indexOf("systemm") === 1 ){
					this["isactive"+(this.active_num+1)] = false
					this.isactive6 = true
					this.listnum = 5
					this.active_num = 5
				}
			},

			change_map_model:function(){
				if( this.$store.state.facepath_model === "online" ){
					this.map_model = "离线"
					this.$store.state.facepath_model = "offline"

					if( this.$route.path === "/mmanage4" ){
						this.$router.push("/mmanage4_offline")
					}else if( this.$route.path === "/facepath" ){
						this.$router.push("/facepath_offline")
					}
				}else{
					this.map_model = "在线"
					this.$store.state.facepath_model = "online"

					if( this.$route.path === "/mmanage4_offline" ){
						this.$router.push("/mmanage4")
					}else if( this.$route.path === "/facepath_offline" ){
						this.$router.push("/facepath")
					}
				}
				sessionStorage.setItem("map_model", this.map_model)
			},
		},
        computed:{

            // user:function() {
            //     return this.$store.state.user
            // }
        },
        mounted(){
        	this.username = sessionStorage.username
        	this.$store.state.user.uname = sessionStorage.username

			if( sessionStorage.map_model ){
				// console.log(sessionStorage.map_model)
				this.map_model = sessionStorage.map_model
				if( this.map_model === "在线" ){
					this.$store.state.facepath_model = "online"
				}else if( this.map_model === "离线" ){
					this.$store.state.facepath_model = "offline"
				}
			}else{
				console.log("heh")
				this.$store.state.facepath_model = "online"
				this.map_model = "在线"
				sessionStorage.setItem("map_model", this.map_model)
			}
			
			// console.log(this.$store.state.facepath_model,this.map_model)
        },
        watch:{
        	'$store.state.user.uname':function(newval,old){
				this.username = sessionStorage.username
			},
        	$route(to,from){
				this.change_mynav_active()
			},
        },
	}
</script>


<style scoped>
	/*css*/
	@import "../css/mynav.css";
</style>