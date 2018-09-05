<template>
	<!--html,不用head和body-->
	<div class="max_box">
		<div class="left_nav">
			<el-menu default-active="2" class="el-menu-vertical-demo" text-color="#fff" active-text-color="#00fcff">
				<el-submenu :index="item_group.uuid" v-for="item_group in groupNames" :key="item_group.uuid">
					<template slot="title">
						<img src="../assets/nav_icon/nav_icon5_1.png" />
						<span>{{item_group.name}}</span>
					</template>
					<el-menu-item-group>
						<el-menu-item :index="item_group.uuid+'-'+video_item.uuid" v-for="video_item in video_names[item_group.uuid]" :key="video_item.uuid" @click="click_to_change_video(video_item.sdkId,video_item.name)">{{video_item.name}}</el-menu-item>
					</el-menu-item-group>
				</el-submenu>	
			</el-menu>
		</div>
	</div>

</template>

<script>
	export default {
		data(){
			return {
				groupNames:[],
				video_names:[],
			}
		},
		methods:{
			// 请求数据
			get_init_data:function(){
				// 请求设备组列表
				var params = new URLSearchParams()
				params.append( "status", "activated" )
				this.$ajax.post("/groupCamera/getAllCameras",params).then((res) => {
			        if( res.data.status === 0){
						for( let item in res.data.data ){
							// console.log(item)
							let [name,uuid] = item.split(",")
							this.groupNames.push( {"name":name,"uuid":uuid} )
							this.video_names.push( res.data.data[item] )
						}
						for( let i = 0; i < this.video_names.length; i++ ){
							for( let j = 0; j < this.video_names[i].length; j++ ){
								this.video_names[i][j].uuid = j
								// this.$store.state.facepath_search_data.allcamera_list.splice(-1,0,this.video_names[i][j])
							}
						}
						for (let i = 0; i < this.groupNames.length; i++) {
							this.groupNames[i].uuid = i + ""
						}
						this.$store.state.realtime_data.groupNames = this.groupNames
						this.$store.state.realtime_data.video_names = this.video_names
			        }else if( res.data.status === 1 ){
			            this.error_info(res.data.msg)
			        	return ;
			        }else if( res.data.status === 2 ){
			            this.error_info(res.data.msg)
			        	return ;
			        }else if( res.data.status === 10 ){
			            this.error_info('请先登录')
			        	return ;
			        }
			    }).catch((error) => {
			    	// console.log(error)
			    	this.error_info('网络连接出错1')
			        return ;
			    })
			},
			click_to_change_video(sdkId,name){
				// console.log(sdkId)
				this.$store.state.realtime_data.sdkId = sdkId
				this.$store.state.realtime_data.name = name
			}
		},
		mounted:function(){
			this.get_init_data()
			// console.log(this.show_allcamera)
		},
	}
</script>

<style>
	/*css*/
	
	@import "../css/left_nav5.css";
</style>