<template>
	<div>
		<div class="left_nav">
			<ul class="left_ul">
				<li class="left_one" :class="{'leftli_active':isactive1}" @click="change_active(1)" @mouseenter="enter(0)" @mouseleave="leave">
					<div class="left_icondiv"><img  src="../assets/nav_icon/sys1_icon1.svg" /></div>
					<div class="left_icontext">用户列表</div>
				</li>
				<li class="left_two" :class="{'leftli_active':isactive2}" @click="change_active(2)" @mouseenter="enter(1)" @mouseleave="leave">
					<div class="left_icondiv"><img  src="../assets/nav_icon/sys1_icon2.svg" /></div>
					<div class="left_icontext">操作记录</div>
				</li>
				<div class="left_active" :style="{ top: 50*listnum + 'px' }"></div>
			</ul>
			<div class="left7set_up" @click="set_confidence"></div>
		</div>
		<!--弹窗3-->
	    <div class="sysadd_user3" v-show="syshidden">
	        <div class="systitle_user3">
	        	<div class="systitle_text">
	        		<div class="editorUser">预设参数</div>
	        	</div>
	        	<div class="sysconter_box">
	        		<div class="syssimilar_box">
	                    <div class="syssimilar_text">识别阈值：</div>
	                    <div class="slider_box sysslider_box">
	                        <el-slider v-model="confidence"></el-slider>
	                    </div>
	                    <div class="syspercentage"><input readonly="readonly" type="text" v-model="confidence"/></div>
	                    <div class="percentage_text">%</div>
	                </div>
	        	</div>
	        	<div class="sys_cancelbtn3" @click="syshidden = false" title="取消"></div>
	        	<div class="sys_addbtn3" @click="confirm_to_post" title="确认修改"></div>
	        </div>	
	    </div>
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

				// 弹窗
				syshidden: false,
				confidence: 75,
			}
		},
		methods:{
			change_active:function(num){
				this.isactive1 = false
				this.isactive2 = false
				this["isactive"+num] = true
				this.active_num = num-1

				if(num === 1){
					this.$router.push('/systemm1');
				}else if(num === 2){
					this.$router.push('/systemm2');
				}
			},
			enter:function(num){
				this.listnum = num
			},
			leave:function(){
				this.listnum = this.active_num
			},
			change_leftnav_active:function(){
				if(this.$route.path === "/systemm2"){
					this.isactive1 = false
					this.isactive2 = true
					this.listnum = 1
				}else if( this.$route.path === "/systemm1" ){
					this.isactive1 = true
					this.isactive2 = false
					this.listnum = 0
				}
			},

			// 弹窗
			set_confidence:function(){
				this.syshidden = true
				this.get_confidence()
			},

			// 获取阈值
			// mes_handling:function(status, msg){
   //              if( status === 1 ){
   //                  this.error_info(msg)
   //                  return ;
   //              }else if( status === 2 ){
   //                  this.error_info(msg)
   //                  return ;
   //              }else if( status === 10 ){
   //                  this.error_info('请先登录')
   //                  return ;
   //              }else{
   //                  if( status === 401 && msg === "未登录" ){
   //                      this.error_info(msg)
   //                      this.$router.push("/login")
   //                  }else{
   //                      this.error_info(status + "  " + msg)
   //                  }
   //              }
   //          },
			get_confidence:function(){
				var params = new URLSearchParams()

				this.$ajax.post("/getWarningThreshold",params).then((res) => {
                    if( res.data.status === 0){
                    	this.confidence = res.data.data
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			confirm_to_post:function(){
				var params = new URLSearchParams()
				
                params.append("threshold",this.confidence)
				this.$ajax.post("/setWarningThreshold",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("修改阈值成功")
                    	this.syshidden = false
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},

			// 消息窗口
			error_info:function(mes){
				this.is_confirm_show = true
				this.$message({
                    type: 'error',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
			warning_info:function(mes){
				this.$message({
                    type: 'warning',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
			success_info:function(mes){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
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
