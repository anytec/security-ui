<template>
	<div style="width:100%;height:100%">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">设备配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
					<div class="export_btn" @click="click_to_add_info('')">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn m3_right_box">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
						<select class="center_select input_right" v-model="search_data.groupId">
							<option selected="selected">选择组/不限</option>
							<option v-for="item in init_data.video_groups">{{ item.name }}</option>
						</select>
						<select class="center_select input_right" v-model="search_data.type">
							<option selected="selected">类型/不限</option>
							<option v-for="item in init_data.type">{{ item }}</option>
						</select>
						<select class="center_select input_right" v-model="search_data.status">
							<option selected="selected">摄像头状态/不限</option>
							<option v-for="item in init_data.status">{{ item }}</option>
						</select>
						<select class="center_select input_right" v-model="search_data.serverLabel">
							<option selected="selected">地址标识/不限</option>
							<option v-for="item in init_data.serverLabels">{{ item }}</option>
						</select>
						<input class="center_input id_card input_right" type="text" v-model="search_data.name" placeholder="通过摄像机名称搜索"/>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td4">设备名称</td>
								<td class="td td4">地址标识</td>
								<td class="td td4">所在组</td>
								<td class="td td5">流地址</td>
								<td class="td td9">状态</td>
								<td class="td td9">类型</td>
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
											{{ item.serverLabel }}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{ item.groupName }}
										</div>
									</div>
								</td>
								<td class="td td5">
									<div class="table_text">
										<div class="cell_text">
											{{ item.streamAddress }}
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text" @click="isreal_change(item.uuid)">
											<el-switch
											  v-model="item.cameraStatus"
											  active-color="#13ce66"
	  										  inactive-color="#626262"
											  >
											</el-switch>
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text">
											{{ item.cameraType }}
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
										<div class="td_icon">
											<img src="../assets/historyface/icon7.png" @click="skip_to_realtimem(item.sdkId,item.name)" title="跳转到实时监控"/>
											<img src="../assets/historyface/icon6.png" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"/>
											<img src="../assets/historyface/icon2.png" @click="click_to_change_gallery(item.uuid)" title="修改该设备信息"/>
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
		<div class="mack_box" v-show="is_request2add" @click="clear_show_data"></div>
		<!--弹出框-新建人员库-->
		<div class="bounced_add mm4_bounced" v-show="is_request2add">
			<div class="bounced_box mm4_bouncedbox">
				<div class="bounced_top">
					<div class="bounced_title">添加设备</div>
				</div>
				<div class="mm4_inputbox">
					<div class="inputbox01">
						<select class="mm4_select" v-model="add_data.groupName">
							<option v-for="item in init_data.video_groups">{{ item.name }}</option>
						</select>
						<input class="mm4_text1" type="text" placeholder="设备名称" v-model="add_data.name"/>
						<select class="mm4_select" v-model="add_data.serverLabel" v-show="add_data.cameraType === '视频流'">
							<option v-for="item in map_serverLabels_list">{{ item }}</option>
						</select>
						<select class="mm4_select" v-model="add_data.serverLabel" v-show="add_data.cameraType === '抓拍机'">
							<option>mac1</option>
							<option>mac2</option>
							<option>mac3</option>
						</select>
						<select class="mm4_select" v-model="add_data.cameraType">
							<option>视频流</option>
							<option>抓拍机</option>
						</select>
						
					</div>
					<div class="inputbox01">
						<input class="mm4_text1_1" type="text" placeholder="流地址rtsp://" v-model="add_data.streamAddress"/>
						<input class="mm4_text4" type="text" placeholder="附加备注信息" v-model="add_data.remarks"/>
					</div>
				</div>
				<div class="mm4_map">
					<div class="map_bg" id="container"></div>
					<div class="mm4_mapbottom">
						<div class="map_input">
							<div class="mm4map_text">鼠标点击设置经纬度</div>
							<input class="mm4map_text1" type="text" placeholder="设备坐标" v-model="add_data.location"/>
						</div>
						<div class="map_input">
							<div class="mm4map_text">按关键字搜索</div>
							<input class="mm4map_text1" type="text" id="tipinput"/>
						</div>
						<div class="mm4btn_box" @click="click_to_addinfo_data" v-show="model === 'add' && is_confirm_show" >添加设备</div>
						<div class="mm4btn_box mm4btn_no" v-show="model === 'add' && !is_confirm_show" >添加设备</div>
						<div class="mm4btn_box mm4btn_no" @click="clear_show_data" v-show="model === 'add'" >暂不添加</div>
						<div class="mm4btn_box" @click="click_to_change_info_data" v-show="model === 'update' && is_confirm_show" >修改设备</div>
						<div class="mm4btn_box mm4btn_no"  v-show="model === 'update' && !is_confirm_show" >修改设备</div>
						<div class="mm4btn_box mm4btn_no" @click="clear_show_data" v-show="model === 'update'" >暂不修改</div>
					</div>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_add_serverLabels"></div>
		<!--弹出框-新增地址标志-->
		<div class="bounced_add mm3_bounced mm_hiddenx" v-show="is_add_serverLabels">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">新增地址标志</div>
				</div>
				<div class="choose_input mm3_choose mm4_add_labels">
					<span>地址标志：</span>
					<input class="mm3_inputname" type="text" v-model="add_serverLabel"/>
					<div class="mmbtn_box mm3_btn" @click="click_to_add_serverLabels">新建地址标志</div>
					<div class="mmbtn_box left_mmbox mm3_btn" @click="click_to_close_serverLabels">暂不新建</div>
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
				init_data:{
					status: ["正常","闲置"],
					type:["抓拍机","视频流"],
					pageNum: 1,
					pageSize: 10,
					is_get_init_data : false,
				},
				// 搜索数据
				search_data:{
					name: "",
					groupId: "选择组/不限",
					type: "类型/不限",
					status: "摄像头状态/不限",
					serverLabel: "地址标识/不限",
				},
				save_search_data:{

				},
				delete_data: [],
				add_data:{
					location: "",
					serverLabel: "",
					cameraType: "视频流",
					name: "",
					streamAddress: "",
				},

				tabledata: null,

				isallchecked: false,

				// 弹窗
				is_request2add: false,
				is_confirm_show: true,
				autocomplete: null,
				map: null,
				// 弹窗类型标志
				model: "",

				// 添加事件-添加地址标志
				is_add_serverLabels:false,
				add_serverLabel: null,
				map_serverLabels_list:[],

				
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

			// 开关判断
			isreal_change:function(uuid){
				if( this.tabledata[uuid].cameraStatus ){
					this.$confirm('确定打开该摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.require_to_change({"cameraStatus":1,"id":this.tabledata[uuid].id},"status",uuid)
					}).catch(() => {
						this.tabledata[uuid].cameraStatus = false
					})
				}else{
					this.$confirm('确定关闭该摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.require_to_change({"cameraStatus":0,"id":this.tabledata[uuid].id},"status",uuid)
					}).catch(() => {
						this.tabledata[uuid].cameraStatus = true
					})
				}
			},

			// 删除事件
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
					// for( let i = 0; i < this.tabledata.length; i++ ){
					// 	this.tabledata[i].ischecked = false
					// }
				}else{
					this.warning_info("请选择删除项")
				}
			},
			// 添加事件
			click_to_add_info:function(change_data){
				this.map_serverLabels_list = []
				// 弹窗添加
				for(let i = 0; i < this.init_data.serverLabels.length; i++){
					this.map_serverLabels_list.push(this.init_data.serverLabels[i])
				}
				// this.map_serverLabels_list.splice(0,0,"新建地址标志")
				this.add_data.groupName = this.init_data.video_groups[0].name
				this.add_data.serverLabel = this.map_serverLabels_list[1]

				if( change_data ){
					for( let item in change_data ){
						this.add_data[item] = change_data[item]
					}
					this.model = "update"
				}else{
					this.model = "add"
				}

				this.is_request2add = true
				this.add_info_map_init()
			},
			// 添加事件-地图初始化
			add_info_map_init:function(){
				this.map = new AMap.Map('container', {
				        resizeEnable: true,
				        zoom:16,
				        center: [114.059777,22.541492],
				        mapStyle: 'amap://styles/darkblue',
				 })
				this.map.on('click', (e) => {
			        // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
			        this.add_data.location = e.lnglat.getLng() + ',' + e.lnglat.getLat()
			    });

			    // 获取经纬度事件
			    AMap.plugin('AMap.Autocomplete',() => {//回调函数
				    var autoOptions = {
				        city: "", //城市，默认全国
				        input:"tipinput"//使用联想输入的input的id
				    };
				    this.autocomplete= new AMap.Autocomplete(autoOptions);

				    AMap.event.addListener(this.autocomplete, "select", (data) => {
				    	console.log(data)
				        if (data.poi && data.poi.location) {
				            this.map.setZoom(16);
				            this.map.setCenter(data.poi.location);
				        }
				    }); 
				});
			},

			// }
			// 添加事件-弹窗
			click_to_addinfo_data:function(){
				// console.log(this.add_data)

				let temp_data = {}
				for( let item in this.add_data ){
					// console.log(this.add_data[item] +  "  " + item)
					if( this.add_data[item] === "" ){
						if( item === "name" ){
							this.warning_info("设备名称不能为空")
							return ;
						}else if( item === "streamAddress" ){
							this.warning_info("流地址不能为空")
							return ;
						}else if( item === "location" ){
							this.warning_info("设备坐标不能为空")
							return ;
						}
					}
					temp_data[item] =  this.add_data[item]
					if( item === "groupName" ){
						for( let i = 0; i < this.init_data.video_groups.length; i++ ){
							if( this.init_data.video_groups[i].name === temp_data[item] ){
								temp_data.groupId = this.init_data.video_groups[i].id
								break
							}
						}
					}
				}
				this.is_confirm_show = false
				this.require_to_add(this.add_data)
			},
			// 添加事件-清除数据
			clear_show_data:function(){
				this.is_request2add = false
				this.is_confirm_show = true
				this.add_data = {
					location: "",
					serverLabel: "",
					cameraType: "视频流",
					name: "",
					streamAddress: "",
				}
				this.model = ""
			},
			// 添加事件-添加地址标志
			click_to_add_serverLabels:function(){
				if( this.add_serverLabel.indexOf(" ") === -1 ){
					this.map_serverLabels_list.splice(-1,0,this.add_serverLabel)
					this.add_data.serverLabel = this.add_serverLabel
					this.add_serverLabel = null
					this.is_add_serverLabels = false
				}else{
					this.error_info("地址标志不能包含空格")
				}	
			},
			click_to_close_serverLabels:function(){
				this.add_data.serverLabel = this.init_data.serverLabels[0]
				this.add_serverLabel = null
				this.is_add_serverLabels = false
			},

			// 修改事件
			click_to_change_info_data:function(){
				let temp_data = {}
				for( let item in this.add_data ){
					if( this.add_data[item] === "" && item != "remarks"){
						this.error_info("修改信息不能为空")
						return ;
					}
				}

				let name_list = ["groupName","name","serverLabel","cameraType","location","streamAddress","remarks"]
				for( let item1 of name_list ){
					if( this.add_data[item1] != this.tabledata[this.add_data.uuid][item1] ){
						if( item1 === "groupName" ){
							for( let i = 0; i < this.init_data.video_groups.length; i++ ){
								if( this.init_data.video_groups[i].name === this.add_data.groupName ){
									temp_data["groupId"] = this.init_data.video_groups[i].id
								}
							}
						}
						temp_data[item1] = this.add_data[item1]
					}
				}
				if( JSON.stringify(temp_data) != "{}"){
					temp_data.id = this.tabledata[this.add_data.uuid].id
					this.is_confirm_show = false
					this.require_to_change(temp_data)
				}else{
					this.is_confirm_show = true
					this.error_info("未修改信息")
				}
			},


			// 搜索事件
			click_to_search:function(search_data){
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},

			// 页面跳转
			skip_to_realtimem:function(sdkId,name){
				// 实时监控
				this.$store.state.realtime_data.sdkId = sdkId
				this.$store.state.realtime_data.name = name
				this.$store.state.is_search_data = true
				this.$router.push('/realtimem')
			},
			skip_to_historyface1:function(num){
				console.log(this.tabledata[num])
				this.$store.state.search_data.cameraGroupName = this.tabledata[num].groupName
				this.$store.state.search_data.cameraGroupId = this.tabledata[num].groupId
				this.$store.state.search_data.cameraName = this.tabledata[num].name
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			click_to_change_gallery:function(num){
				let temp_data = JSON.parse(JSON.stringify(this.tabledata[num]))
				this.click_to_add_info(temp_data)
			},

			// 请求数据
			get_init_data:function(){
				var params = new URLSearchParams()
				// 地址标志请求
				this.$ajax.post("/camera/getServerLabel",params).then((res) => {
                    if( res.data.status === 0){
            			this.init_data.serverLabels = res.data.data
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
                	this.error_info('网络连接出错')
                    return ;
                })
				// 设备组列表请求
				this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
            			this.init_data.video_groups = res.data.data.list
            			this.init_data.is_get_init_data = !this.init_data.is_get_init_data
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
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			post_to_change_page:function(search_data){
				// console.log(this.search_data)
                var params = new URLSearchParams()
                for( let item in search_data ){
                	if( search_data[item].indexOf("不限") == -1 &&  search_data[item] != ""){
                		// 此处 groupId 为设备组名
                		if( item === "groupId" ){
	                		for(let i = 0; i < this.init_data.video_groups.length; i++){
	                			if( search_data[item] === this.init_data.video_groups[i].name ){
	                				params.append(item,this.init_data.video_groups[i].id)
	                			}
	                		}
                		}else if( item === "status" ){
                			if( search_data.status === "正常" ){
                				params.append(item,1)
                			}else{
                				params.append(item,0)
                			}
                		}else{
                			params.append(item,search_data[item])
                		}
                	}
                }
                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
				this.$ajax.post("/camera/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			// console.log(this.tabledata)
            			for( let i = 0; i < this.tabledata.length; i++){
            				if( this.tabledata[i].cameraStatus === 0 ){
            					this.tabledata[i].cameraStatus = false
            				}else{
            					this.tabledata[i].cameraStatus = true
            				}
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
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_delete:function( delete_data ){
				var params = new URLSearchParams()

				// console.log(delete_data) 
                params.append("cameraIds",delete_data) // 删除列表id数组
				this.$ajax.post("/camera/delete",params).then((res) => {
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
			require_to_add:function( temp_data ){
				// console.log(temp_data)
				var params = new URLSearchParams()
				for( let item in temp_data ){
					params.append(item,temp_data[item])
					// if( item === "groupName" ){
					// 	for( let i = 0; i < this.init_data.video_groups.length; i++ ){
					// 		if( this.init_data.video_groups[i].name === temp_data[item] ){
					// 			params.append("groupId",this.init_data.video_groups[i].id)
					// 			break
					// 		}
					// 	}
					// }
				}
				params.append("cameraStatus",1)

				this.$ajax.post("/camera/add",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('添加成功')
	                    this.is_request2add = false
	                    this.post_to_change_page(this.save_search_data)
	                    this.clear_show_data()
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
                    this.is_confirm_show = true
                }).catch((error) => {
                	console.log(error)
                    this.error_info('网络连接出错')
                    this.is_confirm_show = true
                    return ;
                })
			},
			require_to_change:function( temp_data ,model="default",uuid=null){
				// console.log(temp_data)
				var params = new URLSearchParams()
				for( let item in temp_data ){
					params.append(item,temp_data[item])
				}

				this.$ajax.post("/camera/update",params).then((res) => {
                    if( res.data.status === 0){
                    	if( model === "default" ){
                    		this.success_info('修改设备成功')
	                    	this.post_to_change_page(this.save_search_data)
                    	}else{
                    		this.success_info('修改设备状态成功')
                    	}
                    	this.clear_show_data()
                    }else if( res.data.status === 1 ){
                    	if( model === "status" ){
                    		this.tabledata[uuid].cameraStatus = !this.tabledata[uuid].cameraStatus
                    	}
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
                    	if( model === "status" ){
                    		this.tabledata[uuid].cameraStatus = !this.tabledata[uuid].cameraStatus
                    	}
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }
                    this.is_confirm_show = true
                }).catch((error) => {
                	if( model === "status" ){
                		this.tabledata[uuid].cameraStatus = !this.tabledata[uuid].cameraStatus
                	}
                	console.log(error)
                	this.is_confirm_show = true
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
		mounted:function(){
			this.get_init_data()
		},
		watch:{
			'add_data.serverLabel':function(newVal,old){
				if( newVal === "新建地址标志" ){
					this.is_add_serverLabels = true
				}
			},
			'init_data.is_get_init_data':function(newval,old){
				if(	newval ){
					if( this.$store.state.is_search_data ){
						this.search_data.groupId = this.$store.state.search_data.groupId
						this.save_search_data = this.$store.state.search_data

						let search_data = this.$store.state.search_data
						// console.log(search_data)
						this.post_to_change_page( search_data )
						this.$store.state.is_search_data = false
						this.$store.state.search_data = {}
					}else{
						this.post_to_change_page({})
					}
					
				}
			}
		},
	}
</script>

<style>
	/* 地图搜索 */
	.amap-sug-result {
	    z-index: 9999;
    	top:-webkit-calc(15% + 570px) !important;
    	top:-moz-calc(15% + 570px) !important;
		top:calc(15% + 570px) !important;
    	left:-webkit-calc(25% + 446px) !important;
    	left:-moz-calc(25% + 446px) !important;
		left:calc(25% + 446px) !important;
	}

/*	.el-date-editor .el-range-input {
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