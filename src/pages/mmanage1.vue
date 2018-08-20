<template>
	<!--html,不用head和body-->
	<div style="width:100%;height:100%">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">底库配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
					<div class="export_btn" @click="click_to_add_info">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
						<input class="center_input bottom_name" v-model="search_data.groupName" type="text" placeholder="底库名称搜索" />
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td4">底库名称</td>
								<td class="td td4">人员数量</td>
								<td class="td td4">标记颜色</td>
								<td class="td td9">备注</td>
								<td class="td td10">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2">
						<table>
							<tr class="tr" v-for="item in tabledata">
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)"/>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{item.name}}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{item.totalNumber}}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											<div class="tag_color" :style="{'background-color': item.colorLabel}"></div>
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text">
											{{item.remarks}}
										</div>
									</div>
								</td>
								<td class="td td10">
									<div class="td_icon">
										<div class="td_icon">
											<img src="../assets/historyface/icon5.png" @click="skip_to_mmanage2(item.uuid)"/>
										    <img src="../assets/historyface/icon6.png" @click="skip_to_historyface1(item.uuid)"/>
										    <img src="../assets/historyface/icon2.png" @click="click_to_change_persongroup(item)"/>
										</div>
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
		<div class="mack_box" v-show="is_request2add"></div>
		<!--弹出框-新建人员库-->
		<div class="bounced_add mm1_bounced" v-show="is_request2add">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">新建人员库</div>
				</div>
				<div class="mm1_addbox1">
					<div class="addbox1_text">标记色设置</div>
					<input class="mm1_inputname" type="text" v-model="add_data.name"/>
					<span>底库名称：</span>
				</div>
				<div class="mm1_addbox2">
					<div class="left_colordiv">
						<div class="color_box" 
							 :style="{'background-color':item.color,'border':item.border,'margin-top':item.margin_top,'box-shadow':item.shadow}" 
							 v-for="item in box_color" 
							 @click="choose_color(item.uuid,'add')" 
							 @mouseover="mouseover_event(item.uuid)" 
							 @mouseout="mouseout_event(item.uuid)">
						</div>
					</div>
					<div class="right_btndiv">
						<div class="mmbtn_box mm1_btn" @click="request_add_persongroup">新建底库</div>
						<div class="mmbtn_box left_mmbox mm1_btn" @click="close_add_persongroup">暂不添加</div>
					</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" placeholder="附加备注信息" v-model="add_data.remarks"/>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2change"></div>
		<!--弹出框-编辑设备组信息-->
		<div class="bounced_add mm1_bounced" v-show="is_request2change">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">编辑底库信息</div>
				</div>
				<div class="mm1_addbox1">
					<div class="addbox1_text">标记色设置</div>
					<input class="mm1_inputname" type="text" v-model="change_data.name"/>
					<span>底库名称：</span>
				</div>
				<div class="mm1_addbox2">
					<div class="left_colordiv">
						<div class="color_box" 
							 :style="{'background-color':item.color,'border':item.border,'margin-top':item.margin_top,'box-shadow':item.shadow}" 
							 v-for="item in box_color" 
							 @click="choose_color(item.uuid,'change')" 
							 @mouseover="mouseover_event(item.uuid)" 
							 @mouseout="mouseout_event(item.uuid)">
						</div>
					</div>
					<div class="right_btndiv">
						<div class="mmbtn_box mm1_btn" @click="request_change_persongroup">确认修改</div>
						<div class="mmbtn_box left_mmbox mm1_btn" @click="close_change_persongroup">暂不修改</div>
					</div>
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
				init_data:{
					pageNum: 1,
					pageSize: 10,
					allnum: 50,
				},
				// 搜索数据
				search_data:{
					groupName: ""
				},
				save_search_data:{

				},
				delete_data:[],
				add_data:{
					name: "",
					remarks: "--",
				},
				change_data:{
				},

				// 显示数据
				tabledata: null,
				
				isallchecked: false,

				// 添加底库弹窗
				is_request2add: false,
				is_request2change: false,
				box_color:[
					{
						uuid: 0,
						color: "#ff2f60",
						border: "3px solid white",
						margin_top: "-3px",
						shadow:"",
						is_choose: true,
					},{
						uuid: 1,
						color: "#ffdd23",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},{
						uuid: 2,
						color: "#3cafff",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},{
						uuid: 3,
						color: "#1bde5b",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},
				],
			} //返回数据最外围
		},
		methods: {
			// 页面切换函数
			handleSizeChange:function(val) {
				this.isallchecked = false
				// 单页面显示数量
				this.init_data.pageSize = val
				this.post_to_change_page(this.save_search_data)
			},
			handleCurrentChange:function(val) {
				this.isallchecked = false
				// 页面切换
				// console.log(val);
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
				// console.log(num)
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

			// 搜索按钮
			click_to_search:function(search_data){
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},

			// 添加删除事件
			click_to_delete:function(){
				for ( let i = 0; i < this.tabledata.length; i++){
					if(this.tabledata[i].ischecked){
						this.delete_data = this.delete_data + this.tabledata[i].id + ","
					}
				}
				if( this.delete_data ){
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
					this.error_info("请选择删除项")
				}
			},
			// 添加事件
			clear_data:function(){
				for( let i = 0; i < this.box_color.length; i++){
					if( i === 0 ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
				this.add_data = {
					name: "",
					remarks: "--",
				}
				this.change_data = {}
				this.is_request2add = false
				this.is_request2change = false
			},
			click_to_add_info:function(){
				// 弹窗添加
				this.is_request2add = true
				this.add_data.colorLabel = "#ff2f60"
			},
			// 添加事件-弹窗事件
			request_add_persongroup:function(){
				this.require_to_add_group(this.add_data)
				// this.clear_data()
			},
			close_add_persongroup:function(){
				// this.is_request2add = false
				this.clear_data()
			},
			// 添加事件-颜色选择
			choose_color:function(num,model){
				for( let i = 0; i < this.box_color.length; i++){
					if( i === num ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
						if( model === "add" ){
							this.add_data.colorLabel = this.box_color[i].color
						}else if( model === "change" ){
							this.change_data.colorLabel = this.box_color[i].color
						}
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
			},
			mouseover_event:function(num){
				if( !this.box_color[num].is_choose ){
					this.box_color[num].border = "1px solid white"
					this.box_color[num].shadow = "0px 0px 15px white"
				}
			},
			mouseout_event:function(num){
				if( !this.box_color[num].is_choose ){
					this.box_color[num].border = ""
				}
				this.box_color[num].shadow = ""
			},
			// 修改事件
			click_to_change_persongroup:function(change_data){
				this.change_data = JSON.parse(JSON.stringify(change_data))
				for( let i = 0; i < this.box_color.length; i++){
					if( this.box_color[i].color === change_data.colorLabel ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
				this.is_request2change = true
			},
			// 修改事件-弹窗事件
			request_change_persongroup:function(){
				if( this.change_data.colorLabel === this.tabledata[this.change_data.uuid].colorLabel &&
					this.change_data.name === this.tabledata[this.change_data.uuid].name &&
					this.change_data.remarks === this.tabledata[this.change_data.uuid].remarks ){
					this.error_info("信息未更改")
				}else{
					this.require_to_change_group(this.change_data)
				}
				// this.clear_data()
			},
			close_change_persongroup:function(){
				this.clear_data()
			},

			// 页面跳转
			skip_to_mmanage2:function(num){
				this.$store.state.search_data.groupName = this.tabledata[num].name
				this.$store.state.search_data.groupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/mmanage2')
			},
			skip_to_historyface1:function(num){
				this.$store.state.search_data.personGroupName = this.tabledata[num].name
				this.$store.state.search_data.personGroupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			click_to_change_gallery:function(num){
				// 弹窗修改
				console.log("点击")
			},

			// 请求数据
			get_init_data:function(){
				// 请求库名
				var params = new URLSearchParams()
				this.$ajax.post("/groupPerson/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
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
                	params.append("groupName",search_data.groupName) // 搜索底库名,最好可模糊搜索,不一有
                }

                params.append("pageNum",this.init_data.pageNum) // 请求页数
                params.append("pageSize",this.init_data.pageSize) // 请求每页数量
				this.$ajax.post("/groupPerson/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
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
                params.append("groupPersonIds",delete_data) // 删除列表id数组
				this.$ajax.post("/groupPerson/delete",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('删除成功')
	                    this.isallchecked = false
	                    this.post_to_change_page(this.save_search_data)
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
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
			require_to_add_group:function( add_data ){
				var params = new URLSearchParams()
                
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.error_info("请添加库名")
                    return ;
            	}
            	params.append( "colorLabel", add_data.colorLabel )
            	params.append( "remarks", add_data.remarks)

                // 请求人员数据
                this.$ajax.post("groupPerson/add",params).then((res) => {
                    if( res.data.status === 0){
                    	this.is_request2add = false
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.clear_data()
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错5')
                    return ;
                })
			},
			require_to_change_group:function( change_data ){
				var params = new URLSearchParams()
                // console.log(change_data)
            	if( change_data.name ){
            		params.append( "name", change_data.name )
            	}else{
            		this.error_info("请添加库名")
                    return ;
            	}
            	params.append("id", change_data.id)
            	params.append( "colorLabel", change_data.colorLabel )
            	params.append( "remarks", change_data.remarks)

				this.$ajax.post("groupPerson/update",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('信息修改成功')
	                    this.post_to_change_page(this.save_search_data)
	                    // this.tabledata.splice(change_data.uuid,1,change_data)
	                    this.clear_data()
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
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

			// 消息窗口
			error_info:function(mes){
				this.$message({
                    type: 'error',
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
	/*.el-date-editor .el-range-input {
		width: 50%;
	}
	
	.el-date-editor>.el-range__icon,
	.el-date-editor .el-range-separator,
	.el-date-editor .el-range__close-icon {
		line-height: 21px;
	}
	
	.el-input__inner {
		border: 1px solid #015758;
		background-color: rgba(0, 0, 0, 0);
	}
	
	.el-pagination button:disabled,
	.el-pagination .btn-next,
	.el-pagination .btn-prev,
	.el-pager li {
		background-color: rgba(0, 0, 0, 0);
	}
	
	.el-icon-arrow-left:before,
	.el-icon-arrow-right:before {
		color: #00fcff;
	}
	
	.el-pager li {
		color: #017576;
		font-size: 16px;
	}
	
	.el-pager li.active {
		color: #06fafd;
	}
	
	.el-pagination__total,
	.el-pagination .el-select .el-input .el-input__inner,
	.el-icon-arrow-up:before,
	.el-select-dropdown__item.selected,
	.el-pagination__jump,
	.el-pagination__editor.el-input .el-input__inner {
		color: #02d0d3;
	}
	
	.el-pagination {
		width: 660px;
		margin: 0 auto;
		margin-top: 5px;
	}
	
	::-webkit-scrollbar {
		width: 14px;
		height: 14px;
	}
	
	::-webkit-scrollbar-track,
	::-webkit-scrollbar-thumb {
		border-radius: 999px;
		border: 5px solid transparent;
	}
	
	::-webkit-scrollbar-track {
		box-shadow: 1px 1px 5px (200, 203, 206, 0.5) inset;
	}
	
	::-webkit-scrollbar-thumb {
		min-height: 20px;
		background-clip: content-box;
		box-shadow: 0 0 0 5px rgba(200, 203, 206, 0.5) inset;
	}
	
	::-webkit-scrollbar-corner {
		background: transparent;
	}
	
	.el-range-editor.el-input__inner {
		width: 100%;
		height: 100%;
		background-color: white;
	}
	
	.el-date-editor .el-range-input {
		width: 50% !important;
	}*/
</style>
<style scoped>
	@import "../css/historyface.css";
</style>