<template>
	<div style="width:100%;height:100%;" @click="click_to_close_tip">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">底库人员配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box" @keyup.enter="keyup_to_search">
					<div class="export_btn" @click="click_to_add_info">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn m2_right_box">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>

						<select class="center_select input_right" v-model="search_data.groupName">
							<option selected="selected">底库/不限</option>
							<option v-for="item in init_data.galleries">{{ item }}</option>
						</select>
						<select class="center_select input_right" v-model="search_data.gender">
							<option selected="selected">性别/不限</option>
							<option>男</option>
							<option>女</option>
						</select>
						<input class="center_input id_card input_right" type="text" v-model="search_data.idNumber" placeholder="标识编码"/>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table :style="{'width': tabledata_style}">
							<tr>
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td12">
									人脸图像
								</td>
								<td class="td td13">姓名</td>
								<td class="td td13">性别</td>
								<td class="td td14">标识编码</td>
								<td class="td td14">所在底库</td>
								<td class="td td18">备注</td>
								<td class="td td12">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2" ref="table_f">
						<table id="tabledata" ref="table_c">
							<tr class="tr" v-for="item in tabledata">
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)" />
								</td>
								<td class="td td12">
									<!-- <img class="td_img"  :src="item.thumbnail" @click="show_pic(item.wholePhoto)" title="点击显示原图"/> -->
									<img class="td_img"  :src="item.thumbnail"/>
								</td>
								<td class="td td13">
									<div class="table_text">
										<div class="cell_text">
											{{item.name}}
										</div>
									</div>
								</td>
								<td class="td td13">
									<div class="table_text">
										<div class="cell_text">
											{{item.gender}}
										</div>
									</div>
								</td>
								<td class="td td14">
									<div class="table_text">
										<div class="cell_text">
											{{item.idNumber}}
										</div>
									</div>
								</td>
								<td class="td td14">
									<div class="table_text">
										<div class="cell_text">
											{{item.groupName}}
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											{{item.remarks}}
										</div>
									</div>
								</td>
								<td class="td td12">
									<div class="td_icon">
										<div class="td_icon">
											<div class="m_icon icon1" @click="skip_to_facepath(item.thumbnail)" title="跳转到人脸检索"></div>
											<div class="m_icon icon6" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"></div>
											<div class="m_icon icon2" @click="click_to_change_gallery(item.uuid)" title="修改该人员信息"></div>
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
		<!--添加窗口-->
		<div class="mack_box" v-show="is_request2add || is_request2add_batch" @click="click_to_clear" v-if="!uploading"></div>
		<div class="mack_box" v-else="uploading"></div>
		<div class="bounced_add" v-show="is_request2add">
			<div class="bounced_box">
				<div class="file_box">
					<img :src="add_data.dataUrl" v-show="add_data.dataUrl">
				</div>
				<div class="file_img" v-show="!add_data.dataUrl"><img src="../assets/mmanage/add_file.png"/></div>
				<input class="input_file" @change="handleFileChange" ref="inputer" type="file"></input>
				<div class="bounced_top">
					<div class="batch_title" @click="add_batch_data_">批量添加>></div>
					<div class="bounced_title">添加人员</div>
				</div>
				<div class="choose_input">
					<div class="choose_top">
						<input type="text" 
							placeholder="姓名" 
							v-model="add_data.name"
							@focus="focus_to_show(-136,234,'name')"
							@click.stop/>
						<select v-model="add_data.gender">
							<option>男</option>
							<option>女</option>
						</select>
						<input type="text" 
							placeholder="标识编码" 
							v-model="add_data.idNumber"
							@focus="focus_to_show(-97,234,'idNumber')"
							@click.stop/>
						<select v-model="add_data.groupName">
							<option v-for="item in init_data.galleries">{{ item }}</option>
						</select>
					</div>
					<div class="mmbtn_box" @click="click_to_addinfo_data" v-show="is_confirm_show">确认添加</div>
					<div class="mmbtn_box left_mmbox" v-show="!is_confirm_show">确认添加</div>
					<div class="mmbtn_box left_mmbox" @click="click_to_addinfo_close">暂不添加</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" 
						placeholder="备注" 
						v-model="add_data.remarks"
						@focus="focus_to_show(-18,18,'remarks')"
						@click.stop/>
				</div>
			</div>
		</div>
		<!--批量添加-->
		<div class="bounced_add" v-show="is_request2add_batch">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="batch_title2">批量添加</div>
					<div class="bounced_title bounced_title2" @click="add_one_data" v-if="!uploading">单个添加>></div>
				</div>
				<div class="mm2_leftbox">
					<select class="center_select input_right" v-model="add_data_batch.groupName">
						<option v-for="item in init_data.galleries">{{ item }}</option>
					</select>
					<div class="mm2_no " @click="click_to_clear" v-if="false">暂不添加</div>
				</div>
				<div class="mm2_leftbox mm2_leftbox2">
					<div class="mm2_file">
						<input type="file" multiple = "multiple" webkitdirectory @change="fileChange($event)" ref="inputer_batch"/>
					</div>
					<div class="mm2_no mm2_no2" v-if="false">确认上传</div>
					<div class="mm2_no" @click="click_to_clear" v-if="!uploading">暂不添加</div>
					<div class="mm2_no" style="cursor: not-allowed;" v-if="uploading">暂不添加</div>
				</div>
				<div class="loading_box">
					{{ uploading }}
				</div>
			</div>
		</div>
		<div class="mack_box" v-show="is_request2change" @click="click_to_clear"></div>
		<div class="bounced_add" v-show="is_request2change">
			<div class="bounced_box">
				<div class="file_box">
					<img :src="change_data.dataUrl" v-show="change_data.dataUrl">
				</div>
				<div class="file_img" v-show="!change_data.dataUrl"></div>
				<input class="input_file" @change="handleFileChange_change" ref="inputer_change" type="file"></input>
				<div class="bounced_top">
					<div class="bounced_title">修改人员信息</div>
				</div>
				<div class="choose_input">
					<div class="choose_top">
						<input type="text" 
							placeholder="姓名"  
							v-model="change_data.name"
							@focus="focus_to_show(-136,234,'name')"
							@click.stop/>
						<select v-model="change_data.gender">
							<option>男</option>
							<option>女</option>
						</select>
						<input type="text" 
							placeholder="标识编码"  
							v-model="change_data.idNumber"
							@focus="focus_to_show(-97,234,'idNumber')"
							@click.stop/>
						<select v-model="change_data.groupName">
							<option v-for="item in init_data.galleries">{{ item }}</option>
						</select>
					</div>
					<div class="mmbtn_box" @click="click_to_change_infodata" v-show="is_confirm_show">确认修改</div>
					<div class="mmbtn_box left_mmbox" v-show="!is_confirm_show">确认添加</div>
					<div class="mmbtn_box left_mmbox" @click="click_to_close_change_infodata">暂不修改</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" 
						placeholder="备注" 
						v-model="change_data.remarks"
						@focus="focus_to_show(-18,18,'remarks')"
						@click.stop/>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_show_pic" @click="is_show_pic = false"></div>
		<div class="t_graphBox" v-show="is_show_pic" @click="is_show_pic = false">
			<div class="t_graph" >
				<div class="graph_table">
					<div class="graph_cell">
						<img style="max-width:800px; max-height:800px;margin:0 auto;" :src="total_pic" />
					</div>
				</div>
			</div>
		</div>
		<div class="shape_minbox" v-if="is_show_tip" :style="{'left':'calc(35% + '+tip_left+'px)','top':'calc(35% + '+tip_top+'px)'}">
			<div class="shape_topbox">
				<div class="triangle"></div>
				<div class="triangle1"></div>
			</div>
			<div class="shape_border">
				<div class="shape_text">
					<div style="color:white">输入限制：</div>
					<div class="shape_text2" style="color:white" v-for="text,index in shape_text">{{index+1}}.{{text}}</div>
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
				// dataUrl: "",
				// 初始化数据
				init_data: {
					galleries: [],
					galleries_id: [],
					pageNum: 1,
					pageSize: 10,
					allnum: 0,
					is_get_init_data: false,
				},
				// 搜索数据
				search_data:{
					groupName: "底库/不限",
					gender: "性别/不限",
					idNumber: "",
				},
				// 保存的搜索数据
				save_search_data:{

				},
				delete_data: "",
				add_data:{
					gender:"男",
					idNumber:"",
					remarks:"",
					name:"",
					photo: "",
					groupName: "",
					dataUrl: "",
				},
				change_data:{
					photo: "",
					dataUrl:"",
					name: "",
					idNumber: "",
                    gender: "",
				},

				// 批量上传图片
				add_data_batch:{
					groupName: null,
				},
				photoPathList: null,
				uploading: "",
				biggist_pic_list: [],
				files: [],
				pic_num: [],

				tabledata: null,
				
				// 复选框
				isallchecked: false,

				// 弹窗
				is_request2add: false,
				is_request2change: false,
				is_request2add_batch: false,

				// 避免重复确认
				is_confirm_show: true,

				// 原图
				is_show_pic: false,
				total_pic: "",

				// 滚动条
				tabledata_style: "width:100%",

				// 输入框提示
				is_show_tip: false,
				tip_top: 0,
				tip_left: 0,
				shape_text: [],
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
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
			},

			// 输入-正则化
			check_input:function(input_data,model=""){
				// let reg = /^.{0,30}$/
				// if( model === "name" ){
				// 	reg = /^[\u4e00-\u9fa5]{0,10}$/
				// }else if( model === "remarks" ){
				// 	reg = /^[\u4e00-\u9fa5]{0,20}$/
				// }else if( model === "idNumber" ){
				// 	reg = /^[a-zA-Z0-9_-]{0,30}$/
				// }

				let reg = /^[\u4e00-\u9fa50-9a-zA-Z\_]{0,20}$/
				if( model === "remarks" ){
					reg = /^.{0,20}$/
				}else if( model === "idNumber"){
					reg = /^[0-9a-zA-Z]{0,20}$/
				}else if( model === "name" ){
					reg = /^[\u4e00-\u9fa50-9a-zA-Z]{0,20}$/
				}
                return reg.test(input_data)
			},
			// 输入框聚焦
			focus_to_show:function(tip_top,tip_left,model=""){
				this.tip_top = tip_top
				this.tip_left = tip_left
				if( model === "remarks" ){
					this.shape_text = ["不超过20个字符",]
				}else if(model === "idNumber"){
					this.shape_text = ["不超过20个字符","可输入数字、字母"]
				}else if(model === "name"){
					this.shape_text = ["不超过20个字符","可输入中文、数字、字母"]
				}else{
					this.shape_text = ["不超过20个字符","可输入中文、数字、字母、下划线"]
				}
				if( this.shape_text.length ){
					this.is_show_tip = true
				}
			},
			click_to_close_tip:function(event){
				this.is_show_tip = false
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

			// 搜索按钮
			click_to_search:function(search_data){
				// if( !this.check_input(search_data.idNumber) ){
				// 	this.warning_info("标识编码应输入字母、数字、_、- 或过长")
				// 	return ;
				// }
				this.isallchecked = false
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},

			// 添加删除事件
			click_to_delete:function(){
				// console.log(this.tabledata[0])
				for ( let i = 0; i < this.tabledata.length; i++){
					if(this.tabledata[i].ischecked){
						this.delete_data = this.delete_data + this.tabledata[i].sdkId + ","
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
			click_to_add_info:function(){
				// 弹窗添加
				this.is_request2add = true
				this.is_confirm_show = true
			},
			click_to_clear:function(){
				this.is_request2add = false
				this.is_request2change = false
				this.is_confirm_show = true
				this.is_request2add_batch = false
				this.uploading = ""
				this.$refs.inputer.value = ''
				this.$refs.inputer_batch.value = ''
				this.files = []
                this.biggist_pic_list = []
                this.pic_num = []

                this.is_show_tip = false
			},
			// 单个添加切换到批量添加
			add_batch_data_:function(){
				this.is_request2add = false
				this.is_request2add_batch = true
			},
			// 批量添加切换到单个添加
			add_one_data:function(){
				this.is_request2add = true
				this.is_request2add_batch = false
				this.add_data_batch.groupName = this.init_data.galleries[0]
			},
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				// this.save_search_data = this.search_data
				// this.post_to_change_page(this.search_data)
				this.click_to_search(this.search_data)
			},

			// 页面跳转
			skip_to_facepath:function(img){
				// this.$store.state.search_data
				this.$store.state.facepath_data.photo = img
                this.$store.state.is_search_data_facepath = true
				if( this.$store.state.facepath_model === "online" ){
                	this.$router.push('/facepath')
                }else{
                	this.$router.push('/facepath_offline')
                }
			},
			skip_to_historyface1:function(num){
				// console.log(this.tabledata[num])
				this.$store.state.search_data.personGroupName = this.tabledata[num].groupName
				this.$store.state.search_data.personGroupId = this.tabledata[num].groupId
				this.$store.state.search_data.idNumber = this.tabledata[num].idNumber
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			click_to_change_gallery:function(num){
				// 弹窗修改
				for ( let item in this.tabledata[num] ){
					this.change_data[item] = this.tabledata[num][item]
				}
				this.change_data.dataUrl = this.change_data.thumbnail
				this.is_request2change = true
				this.is_confirm_show = true
			},

			// 请求数据
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
			get_init_data1:function(){
				// 请求库名
				var params = new URLSearchParams()
				this.$ajax.post("/groupPerson/list",params).then((res) => {
                    if( res.data.status === 0){
                    	for( let item of res.data.data.list ){
                			this.init_data.galleries.push(item.name)
                			this.init_data.galleries_id.push(item.id)
                			this.init_data.is_get_init_data = true
                			this.add_data.groupName = this.init_data.galleries[0]
                			this.add_data_batch.groupName = this.init_data.galleries[0]
                    	}
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			get_push_page:function(){
				if ( this.$store.state.is_search_data ){
					// console.log(this.$store.state.search_data.groupName)
					this.search_data.groupName = this.$store.state.search_data.groupName
					this.save_search_data = this.$store.state.search_data

					this.post_to_change_page(this.save_search_data,true)
					this.$store.state.is_search_data = false
					this.$store.state.search_data = {}
					this.$store.state.is_add_data = false
				}else if( this.$store.state.is_add_data ){
					this.is_request2add = true
					let temp_data = JSON.parse(JSON.stringify(this.$store.state.add_data))
					this.add_data.dataUrl = temp_data.photo
					// this.add_data.photo = temp_data.photo
					this.add_data.groupName = this.init_data.galleries[0]
					this.add_data_batch.groupName = this.init_data.galleries[0]

					this.init_data.is_get_init_data = false
					this.$store.state.add_data = null
					this.$store.state.is_add_data = false

					this.get_init_data2()
				}else{
					this.get_init_data2()
				}
			},
			get_init_data2:function(){
				// 请求人员数据
               	var params = new URLSearchParams()
                this.$ajax.post("/person/list",params).then((res) => {
                    if( res.data.status === 0){
                    	this.tabledata = res.data.data.list
                    	this.init_data.allnum = res.data.data.total
                    	for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
                    	// console.log(this.tabledata)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			post_to_change_page:function(search_data,change_page=0){
				// console.log(search_data)
                var params = new URLSearchParams()
                if( search_data.groupName && !change_page ){
                	if( this.init_data.galleries_id[this.init_data.galleries.indexOf(search_data.groupName)] ){
                		params.append( "groupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(search_data.groupName)]) // 搜索底库名
                	}
                	if( search_data.gender != "性别性别/不限" && search_data.gender ){
                		params.append( "gender", search_data.gender )   // 搜索性别
                	}
                	if( search_data.idNumber ){
                		params.append( "idNumber", search_data.idNumber )   // 搜索身份证号 该三个信息不一定有，且可能只有其中一个
                	}
                	if( search_data.faceSdkId ){
                		params.append( "faceSdkId", search_data.faceSdkId )
                	}
                	// else{
                 //    	this.error_info("标志编码不能为空")
                 //    }
                }else if( change_page ){
                	for(let key in search_data ){
                		if( key != "groupName" ){
                			params.append(key,search_data[key])
                		}
                	}
                }
                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
                // 请求人员数据
                this.$ajax.post("/person/list",params).then((res) => {
                    if( res.data.status === 0){
                    	this.init_data.allnum = res.data.data.total
                    	this.tabledata = res.data.data.list
                    	for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
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
                params.append("personSdkIds",delete_data) // 删除列表id数组
				this.$ajax.post("/person/delete",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('删除成功')
	                    this.isallchecked = false
	                    this.post_to_change_page(this.save_search_data)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
                
			},
			require_to_addpeople:function(add_data){
				var params = new FormData()
                
            	if( this.init_data.galleries_id[this.init_data.galleries.indexOf(add_data.groupName)] ){
            		params.append( "groupName", add_data.groupName)
            		params.append( "groupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(add_data.groupName)]) // 搜索底库名
            	}
            	if( add_data.idNumber ){
            		params.append( "idNumber", add_data.idNumber )   // 搜索身份证号 该三个信息不一定有，且可能只有其中一个
            	}else{
            		this.warning_info("请添加标志编码")
                    return ;
            	}
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.warning_info("请添加姓名")
                    return ;
            	}
            	if( add_data.photo ){
            		params.append( "photo", add_data.photo )
            	}else if( add_data.dataUrl){
            		params.append( "photoUrl", add_data.dataUrl )
            	}else{
            		console.log(add_data)
            		this.warning_info("请添加图片")
                    return ;
            	}
            	if( add_data.remarks ){
            		params.append("remarks",add_data.remarks)
            	}
            	params.append("gender",add_data.gender)
                // 请求人员数据
                this.is_confirm_show = false
                this.$ajax.post("/person/add",params,{headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                    if( res.data.status === 0){
                    	this.is_request2add = false
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.add_data = {
	                    	gender:"男",
							idNumber:"",
							remarks:"",
							name:"",
							photo: "",
							groupName: this.init_data.galleries[0],
							dataUrl: "",
	                    }
	                    this.click_to_clear()
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                    this.is_confirm_show = true
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                	this.is_confirm_show = true
                    return ;
                })
			},
			require_to_change_people:function( change_data,photo_flag){
				var params = new FormData()

        		params.append( "groupName", change_data.groupName)
        		params.append( "groupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(change_data.groupName)]) // 搜索底库名
        		params.append( "idNumber", change_data.idNumber )   // 搜索身份证号 该三个信息不一定有，且可能只有其中一个
        		params.append( "name", change_data.name )
        		params.append("remarks",change_data.remarks)
        		params.append("gender",change_data.gender)
        		params.append("id",change_data.id)
        		params.append("sdkId",change_data.sdkId)

            	if( photo_flag ){
            		params.append( "photo", change_data.photo )
            	}
                // 请求人员数据
                this.$ajax.post("/person/update",params,{headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                    if( res.data.status === 0){
                    	this.is_request2change = false
                    	this.change_data = { photo: "",dataUrl:"",name:"", idNumber:"" },
                    	this.success_info("修改成功")
	                    this.post_to_change_page(this.save_search_data)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                    this.is_confirm_show = true
                    this.click_to_clear()
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			// 批量添加请求
			require_to_upload_batch_people:function( files ){
				var params = new FormData()
				for( let i = 0; i < files.length; i ++ ){
					params.append( "photos" , files[i], files[i].name )
				}

				this.$ajax.post("/uploadPhotos",params,{headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                    if( res.data.status === 0){
                    	this.photoPathList = res.data.data

                    	this.require_to_add_batch_people()
                    }else{
                    	this.uploading = ""
						this.$refs.inputer_batch.value = ""

                        this.mes_handling(res.data.status,res.data.msg)
                	}
                }).catch((error) => {
                	console.log(error)
                	this.uploading = ""
					this.$refs.inputer_batch.value = ""
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_add_batch_people:function(){
				// 请求库名
				var params = new URLSearchParams()

				if( this.init_data.galleries_id[this.init_data.galleries.indexOf(this.add_data_batch.groupName)] ){
            		params.append( "personGroupName", this.add_data_batch.groupName)
            		params.append( "personGroupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(this.add_data_batch.groupName)]) // 搜索底库名
            	}
				// params.append( "personGroupId", personGroupId )
				// params.append( "personGroupName", personGroupName )
				params.append( "photoPathList", this.photoPathList )

				this.$ajax.post("/addPhotos",params).then((res) => {
                    if( res.data.status === 0){
                    	let big_msg = ""
                    	if( this.biggist_pic_list.length ){
                    		big_msg = " 超过10M未上传照片：" + this.biggist_pic_list.join(",")
                    	}
                    	if( res.data.msg ){

                    		this.success_info(res.data.msg + "  " + big_msg,0)
                    	}else{
                    		this.success_info("录入成功"+ "  " + big_msg,0)
                    	}
	                    this.post_to_change_page(this.save_search_data)
	                    this.click_to_clear()
                    }else{
                    	this.uploading = ""
						this.$refs.inputer_batch.value = ''

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
			success_info:function(mes,showtime=3){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true,
                    duration: showtime,
                })
			},

			// 显示全图
            show_pic:function(imgUrl){
                if( imgUrl ){
                    this.total_pic = imgUrl
                    this.is_show_pic = true
                }else{
                    this.total_pic = ""
                    this.warning_info("未找到原图")
                }
            },

	        // 上传图片
            imgPreview:function(file,model){
                let self = this;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
        
                if (!/image\/\w+/.test(file.type)) {
                    self.warning_info("请选择图片")
                    return false;
                }

                // 创建一个reader
                var reader = new FileReader()
                // 将图片将转成 base64 格式
                reader.readAsDataURL(file)
                // 读取成功后的回调
                reader.onloadend = function (e) {
                    if( model === "add"){
                		self.add_data.dataUrl = e.target.result
                	}else if( model === "change" ){
                		self.change_data.dataUrl = e.target.result
                	}
                    let image = new Image()
                    let Maxpic = 4000
                    image.onload = () => {
                        let width = image.width
                        let height = image.height
                        if( width > Maxpic || height > Maxpic ){
                            let PicBaseText=self.compress(image,width*0.5,height*0.5,1)
                            if( model === "add" ){
                            	self.add_data.photo = self.dataURItoBlob(PicBaseText)
                            }else{
                            	self.change_data.photo = self.dataURItoBlob(PicBaseText)
                            }
                        }
                    }
                    image.src = e.target.result
                }
                
            },
			handleFileChange:function(e){
				let inputDOM = this.$refs.inputer
				
				let tempdata = inputDOM.files[0]
                if( tempdata.size < 10*1024*1024 ){
                    this.add_data.photo = inputDOM.files[0]
					this.imgPreview(this.add_data.photo,"add")
                }else{
                    this.$refs.inputer.value = ""
                    this.warning_info("图片大小不超过10M")
                } 
			},
			handleFileChange_change:function(e){
				let inputDOM = this.$refs.inputer_change
				
				let tempdata = inputDOM.files[0]
                if( tempdata.size < 10*1024*1024 ){
                    this.change_data.photo = inputDOM.files[0]
					this.imgPreview(this.change_data.photo,"change")
                }else{
                    this.$refs.inputer.value = ""
                    this.warning_info("图片大小不超过10M")
                }
			},
			// 图片压缩 canvas
            compress:function(img, width, height, ratio) {
                var canvas, ctx, img64;

                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                img64 = canvas.toDataURL("image/jpeg",ratio);

                return img64;
            },
            // base64 转 二进制 图片
            dataURItoBlob:function(dataURI) {
                let byteString = atob(dataURI.split(',')[1]);
                let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                let ab = new ArrayBuffer(byteString.length);
                let ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], {type: mimeString});
            },
            // 图片大小限制
            pic_astrict:function(file,index){
            	let name = file.name
            	// 创建一个reader
                var reader = new FileReader()
                // 将图片将转成 base64 格式
                reader.readAsDataURL(file)
                // 读取成功后的回调
                reader.onloadend =  (e) => {
                    let image = new Image()
                    let Maxpic = 4000
                    image.onload = () => {
                        let width = image.width
                        let height = image.height
                        if( width > Maxpic || height > Maxpic ){
                        	// console.log( name )
                            let PicBaseText = this.compress(image,width*0.5,height*0.5,1)
                            let temp_data = this.dataURItoBlob(PicBaseText)
                            temp_data.name = name
                            this.files.splice( this.files.length, 1, temp_data )
                        }else{
                        	this.files.push( file )
                        }
                        // this.pic_num[index].flag = true
                        this.pic_num.splice( index, 1, {flag:true, num:index} )
                        for( let file_num = 0; file_num < this.pic_num.length; file_num++ ){
                        	if( !this.pic_num[file_num].flag ){
                        		break
                        	}
                        	if( file_num === (this.pic_num.length - 1) ){
                        		this.uploading = "请勿操作,人脸入库中......"
                        		this.require_to_upload_batch_people(this.files)
                        		// console.log(this.files)
                        	}
                        }
                    }
                    image.src = e.target.result
                }
            },
            // 文件改变执行函数
            fileChange(e){
                if ( !e.target.files.length){
                	this.warning_info("文件夹下无文件,请重新选择文件夹")
                }
                this.files = []
                this.biggist_pic_list = []
                this.pic_num = []
                for( let i = 0; i < e.target.files.length; i++ ){
                	if( e.target.files[i].type.indexOf("image") != -1 ){
                		if( e.target.files[i].size > 10*1024*1024 ){
                			this.biggist_pic_list.push(e.target.files[i].name)
                			continue
                		}else{
                			this.pic_num.splice(i,0,{ flag:false, num: i })
                		}
                	}
                }
                if( !this.pic_num.length ){
                	this.uploading = ""
					this.$refs.inputer_batch.value = ''
					if( this.biggist_pic_list ){
						this.warning_info("图片大小不超过10M")
					}else{
						this.warning_info("文件夹下未包含图片")
					}
                	return ;
                }
                this.uploading = "图片检测中,请勿操作"
                for( let file_num = 0; file_num < this.pic_num.length; file_num++ ){
                	this.pic_astrict( e.target.files[this.pic_num[file_num].num], file_num )
                }
            },

			// 弹窗事件-添加人员
			click_to_addinfo_data:function(){
				if( !this.check_input(this.add_data.idNumber,"idNumber") ){
					this.warning_info("标识编码格式不正确")
					return ;
				}else if( !this.check_input(this.add_data.remarks,"remarks") ){
					this.warning_info( "备注格式不正确" )
					return ;
				}else if( !this.check_input(this.add_data.name,"name") ){
					this.warning_info( "姓名格式不正确" )
					return ;
				}
				// this.add_data.dataUrl = ""
				this.require_to_addpeople(this.add_data)
			},
			click_to_addinfo_close:function(){
				this.is_request2add = false
			},
			// 弹窗事件-修改人员
			click_to_change_infodata:function(){
				if( !this.check_input(this.change_data.idNumber,"idNumber") ){
					this.warning_info("标识编码格式不正确")
					return ;
				}else if( !this.check_input(this.change_data.remarks,"remarks") ){
					this.warning_info( "备注格式不正确" )
					return ;
				}else if( !this.check_input(this.change_data.name,"name") ){
					this.warning_info( "姓名格式不正确" )
					return ;
				}

				let photo_flag = false
				if( this.change_data.dataUrl != this.tabledata[this.change_data.uuid].thumbnail ){
					photo_flag = true
				}

				if( this.change_data.name === this.tabledata[this.change_data.uuid].name 
					&& this.change_data.idNumber === this.tabledata[this.change_data.uuid].idNumber 
					&& this.change_data.gender === this.tabledata[this.change_data.uuid].gender 
					&& this.change_data.groupName === this.tabledata[this.change_data.uuid].groupName
					&& this.change_data.remarks === this.tabledata[this.change_data.uuid].remarks 
					&& !photo_flag
					 ){
					this.error_info("信息未更改")
				}else if( this.change_data.idNumber === "" ){
					this.warning_info("标识编码不能为空")
				}else if( this.change_data.name === ""){
					this.warning_info("姓名不能为空")
				}else if( !this.change_data.gender ){
					this.warning_info("性别不能为空")
				}else{
					this.is_confirm_show = false
					this.require_to_change_people(this.change_data,photo_flag)
				}
			},
			click_to_close_change_infodata:function(){
				this.is_request2change = false
			}
		},
		mounted:function(){
			this.get_init_data1()
		},
		watch:{
			'init_data.is_get_init_data':function(newval,old){
				if(	newval ){
					this.get_push_page()
				}
			},
			'search_data.idNumber':function(newval,old){
				if( newval === "" ){
					this.click_to_search(this.search_data)
				}
			},

			// 滚动条
			'tabledata':function(){
			    // this.$nextTick(function(){
			    //     let table_height = document.getElementById("tabledata").scrollHeight
			    //     let box_height = this.$refs.table_f.offsetHeight
			    //     if( table_height > box_height ){
			    //     	this.tabledata_style = 'width: 100%'
			    //     }else{
			    //     	// console.log(table_height,box_height)
			    //     	this.tabledata_style = 'width: calc(100% - 20px)'
			    //     }
			    // });

			    // 全局函数-获取是否出现滚动条
			    this.get_scroll()
			}
		},
		beforeRouteLeave(to, from, next) {
			if( to.path === "/facepath" && this.$store.state.is_search_data_facepath ){
				to.meta.keepAlive = false; 
			}
	        next()
	    }
	}
</script>

<style>
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
	/*@import "../css/mmanage.css";*/
</style>
