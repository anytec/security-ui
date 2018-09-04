<template>
	<div style="height:100%;width:100%">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">设备组配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
					<div class="export_btn" @click="click_to_add_info">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn m3_right_box">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
						<input class="center_input id_card input_right" type="text" v-model="search_data.groupName" placeholder="通过摄像机组名称搜索"/>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td4">组名称</td>
								<td class="td td4">区域</td>
								<td class="td td4">状态</td>
								<td class="td td4">备注</td>
								<td class="td td4">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2">
						<table>
							<tr class="tr" v-for="item in tabledata">
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)" />
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{ item.name }}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{item.area}}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text" @click="isreal_change(item.uuid)">
											<el-switch
											  v-model="item.groupStatus"
											  active-color="#13ce66"
	  										  inactive-color="#626262"
											  >
											</el-switch>
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{ item.remarks }}
										</div>
									</div>
								</td>
								
								<td class="td td4">
									<div class="td_icon">
										<img src="../assets/historyface/icon9.png" @click="skip_to_camera(item.uuid)" title="跳转到设备配置"/>
										<img src="../assets/historyface/icon6.png" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"/>
										<img src="../assets/historyface/icon2.png" @click="click_to_change_gallery(item.uuid)" title="修改该人员信息"/>
									</div>
								</td>
							</tr>
						</table>
					</div>
					<div class="pag">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="init_data.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="init_data.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="init_data.allnum" class="haha">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2add" @click="is_request2add = false"></div>
		<!--弹出框-新增设备组-->
		<div class="bounced_add mm3_bounced mm_hiddenx" v-show="is_request2add">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">新增设备组</div>
				</div>
				<div class="choose_input mm3_choose">
					<span>设备组名称：</span>
					<input class="mm3_inputname" type="text" v-model="add_data.name"/>
					<div class="mmbtn_box mm3_btn" @click="click_to_addinfo_data" v-show="is_confirm_show">新建设备组</div>
					<div class="mmbtn_box mm3_btn left_mmbox" v-show="!is_confirm_show">新建设备组</div>
					<div class="mmbtn_box left_mmbox mm3_btn" @click="click_to_close_addinfo">暂不添加</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" placeholder="附加备注信息" v-model="add_data.remarks"/>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2change" @click="is_request2change = false"></div>
		<!--弹出框-编辑设备组信息-->
		<div class="bounced_add mm3_bounced" v-show="is_request2change">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">编辑设备组信息</div>
				</div>
				<div class="choose_input mm3_choose">
					<span>底库名称：</span>
					<input class="mm3_inputname" type="text" v-model="change_data.name"/>
					<div class="mmbtn_box mm3_btn" @click="click_to_change_infodata" v-show="is_confirm_show">确认修改</div>
					<div class="mmbtn_box mm3_btn left_mmbox" v-show="!is_confirm_show">确认修改</div>
					<div class="mmbtn_box left_mmbox mm3_btn" @click="click_to_close_change_info">暂不修改</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" placeholder="附加备注信息" v-model="change_data.remarks"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	//js
	export default {
		data() {
			return {
				// 初始化数据
				init_data: {
					// galleries: ['扒窃人员','涉恐人员','重点人员'],
					
					pageNum: 1,
					pageSize: 10,
					// allnum: 50,
				},

				// 搜索数据
				search_data:{
					groupName: ""
				},
				save_search_data:{

				},
				delete_data: [],
				add_data:{
					name: "",
					remarks: "",
				},
				change_data: {},

				// 显示数据
				tabledata: null,

				isallchecked: false,

				// 弹窗
				is_request2add: false,
				is_request2change: false,
				is_confirm_show : true,
			} //返回数据最外围
		},
		methods: {
			// 页面切换函数
			handleSizeChange:function(val) {
				// 单页面显示数量
				this.init_data.pageSize = val
				this.post_to_change_page(this.save_search_data)
			},
			handleCurrentChange:function(val) {
				// 页面切换
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
			},

			// 复选框函数
			click_to_checkedall: function() {
				if(!this.isallchecked) {
					this.isallchecked = true
					for(let i = 0; i < this.tabledata.length; i++) {
						this.tabledata[i].ischecked = true
					}
				} else {
					this.isallchecked = false
					for(let i = 0; i < this.tabledata.length; i++) {
						this.tabledata[i].ischecked = false
					}
				}
			},
			click_to_checkedone:function(num){
				// console.log(this.tabledata[num].ischecked)
				let flag = true
				if( this.tabledata[num].ischecked ){
					this.isallchecked = false
				}else{
					for(let i = 0; i < this.tabledata.length; i++){
						if( i != num ){
							flag = this.tabledata[i].ischecked && flag
						}
					}
					this.isallchecked = flag
				}
			},

			// 搜索事件
			click_to_search:function(search_data){
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},
			// 添加事件
			click_to_add_info:function(){
				// 弹窗添加
				this.is_request2add = true
			},
			// 添加事件-弹窗
			click_to_addinfo_data:function(){
				this.is_confirm_show = false
				this.require_to_add(this.add_data)
			},
			click_to_close_addinfo:function(){
				this.is_request2add = false
			},
			// 修改事件
			click_to_change_gallery:function(num){
				this.change_data = JSON.parse(JSON.stringify(this.tabledata[num]))
				this.is_request2change = true
			},
			// 修改事件-弹窗
			click_to_change_infodata:function(){
				if( this.change_data.remarks === this.tabledata[this.change_data.uuid].remarks &&
					this.change_data.name === this.tabledata[this.change_data.uuid].name ){
					this.error_info("信息未更改")
				}else if( this.change_data.name === "" ){
					this.warning_info("设备组名称不能为空")
				}else{
					let template = {"id":this.change_data.id,"name":this.change_data.name,"remarks":this.change_data.remarks}
					this.is_confirm_show = false
					this.require_to_change(template)
				}
			},
			click_to_close_change_info:function(){
				this.is_request2change = false
			},

			// 添加删除事件
			click_to_delete:function(){
				for ( let i = 0; i < this.tabledata.length; i++){
					if(this.tabledata[i].ischecked){
						this.delete_data = this.delete_data + this.tabledata[i].id + ","
					}
				}
				if( this.delete_data.length ){
					this.$confirm('是否删除该数据？','提示',{
						confirmButtonText: '是',
			            cancelButtonText: '否',
			            type: 'warning'
					}).then(() => {
						this.require_to_delete(this.delete_data)
						this.delete_data = ""
					}).catch(() => {
						;
					})
				}else{
					this.warning_info("请选择删除项")
				}
			},
			// 清除数据
			clear_data:function(){
				this.is_request2add = false
				this.is_request2change = false
				this.change_data = {}
				this.add_data = { name: "", remarks: "--" }
			},

			// 页面跳转
			skip_to_camera:function(num){
				// 此处groupId 为设备组名
				this.$store.state.search_data.groupId = this.tabledata[num].name
				this.$store.state.is_search_data = true
				this.$router.push('/mmanage4')
			},
			skip_to_facepath:function(num){
				// 人脸轨迹
				this.$router.push('/facepath')
			},
			skip_to_historyface1:function(num){
				// console.log(this.tabledata[num].name)
				this.$store.state.search_data.cameraGroupName = this.tabledata[num].name
				this.$store.state.search_data.cameraGroupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			
			// 开关判断
			isreal_change:function(uuid){
				if( this.tabledata[uuid].groupStatus ){
					this.$confirm('确定打开该区域摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":this.tabledata[uuid].groupStatus},"status",uuid)
					}).catch(() => {
						this.tabledata[uuid].groupStatus = false
					})
				}else{
					this.$confirm('确定关闭该区域摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":this.tabledata[uuid].groupStatus},"status",uuid)
					}).catch(() => {
						this.tabledata[uuid].groupStatus = true
					})
				}
				// console.log(this.tabledata[uuid].groupStatus)
			},

			// 请求数据
			get_init_data:function(){
				// 请求设备组列表
				var params = new URLSearchParams()
				this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			// console.log(this.tabledata)
            			for( let i = 0; i < this.tabledata.length; i++){
            				if( this.tabledata[i].groupStatus === 0 ){
            					this.tabledata[i].groupStatus = false
            				}else{
            					this.tabledata[i].groupStatus = true
            				}
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
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
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			post_to_change_page:function(search_data){
				// console.log(this.search_data)
                var params = new URLSearchParams()
                if( search_data.groupName ){
                	params.append("groupName",search_data.groupName)
                }

                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
                this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			// console.log(this.tabledata)
            			for( let i = 0; i < this.tabledata.length; i++){
            				if( this.tabledata[i].groupStatus === 0 ){
            					this.tabledata[i].groupStatus = false
            				}else{
            					this.tabledata[i].groupStatus = true
            				}
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
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
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_delete:function( delete_data ){
				var params = new URLSearchParams()

				// console.log(delete_data) 
                params.append("groupCameraIds",delete_data) // 删除列表id数组
				this.$ajax.post("/groupCamera/delete",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('删除成功')
	                    this.isallchecked = false
	                    this.post_to_change_page(this.save_search_data)
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
                	console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_add:function( add_data ){
				var params = new URLSearchParams()
                
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.is_confirm_show = true
            		this.error_info("设备组名称不能为空")
                    return ;
            	}
            	params.append( "remarks", add_data.remarks)

                // 请求人员数据
                this.$ajax.post("/groupCamera/add",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.clear_data()
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
                    this.is_confirm_show = true
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                	this.is_confirm_show = true
                    return ;
                })
			},
			require_to_change:function(change_data,model="default",uuid=null){
				var params = new URLSearchParams()

				for( let item in change_data ){
					params.append(item,change_data[item])
				}

                // 请求人员数据
                this.$ajax.post("/groupCamera/update",params).then((res) => {
                    if( res.data.status === 0){
                    	if( model === "default" ){
                    		this.success_info("修改设备组信息成功")
	                    	this.post_to_change_page(this.save_search_data)
	                    	this.clear_data()
                    	}else if( model === "status" ){
                    		this.success_info('修改设备状态成功')
                    	}
                    }else if( res.data.status === 1 ){
                    	if( model === "status" ){
                    		this.tabledata[uuid].groupStatus = !this.tabledata[uuid].groupStatus
                    	}
	                    this.error_info(res.data.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
                    	if( model === "status" ){
                    		this.tabledata[uuid].groupStatus = !this.tabledata[uuid].groupStatus
                    	}
	                    this.error_info(res.data.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }
                    this.is_confirm_show = true
                }).catch((error) => {
                	if( model === "status" ){
                		this.tabledata[uuid].groupStatus = !this.tabledata[uuid].groupStatus
                	}
                	console.log(error)
                	this.error_info('网络连接出错')
                	this.is_confirm_show = true
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
		mounted:function(){
			this.get_init_data()
		},
	}
</script>

<style>
	
</style>
<style scoped>
	@import "../css/historyface.css";
</style>