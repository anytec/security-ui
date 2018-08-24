<template>
	<div style="width:100%;height:100%;">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">底库人员配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
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
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td4">
									人脸图像
								</td>
								<td class="td td4">姓名</td>
								<td class="td td4">性别</td>
								<td class="td td5">标识编号</td>
								<td class="td td9">所在底库</td>
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
									<img class="td_img"  :src="item.thumbnail"/>
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
											{{item.gender}}
										</div>
									</div>
								</td>
								<td class="td td5">
									<div class="table_text">
										<div class="cell_text">
											{{item.idNumber}}
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text">
											{{item.groupName}}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="table_text">
										<div class="cell_text">
											{{item.remarks}}
										</div>
									</div>
								</td>
								<td class="td td4">
									<div class="td_icon">
										<div class="td_icon">
											<img src="../assets/historyface/icon1.png" @click="skip_to_facepath(item.thumbnail)" title="跳转到人脸检索"/>
											<img src="../assets/historyface/icon6.png" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"/>
											<img src="../assets/historyface/icon2.png" @click="click_to_change_gallery(item.uuid)" title="修改该人员信息"/>
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
		<div class="mack_box" v-show="is_request2add"></div>
		<div class="bounced_add" v-show="is_request2add">
			<div class="bounced_box">
				<div class="file_box">
					<img :src="add_data.dataUrl" v-show="add_data.dataUrl">
				</div>
				<div class="file_img" v-show="!add_data.dataUrl"><img src="../assets/mmanage/add_file.png"/></div>
				<input class="input_file" @change="handleFileChange" ref="inputer" type="file"></input>
				<div class="bounced_top">
					<div class="bounced_title">添加人员</div>
				</div>
				<div class="choose_input">
					<div class="choose_top">
						<input type="text" placeholder="姓名" v-model="add_data.name"/>
						<select v-model="add_data.gender">
							<option>男</option>
							<option>女</option>
						</select>
						<input type="text" placeholder="标识编码" v-model="add_data.idNumber"/>
						<select v-model="add_data.groupName">
							<option v-for="item in init_data.galleries">{{ item }}</option>
						</select>
					</div>
					<div class="mmbtn_box" @click="click_to_addinfo_data">确认添加</div>
					<div class="mmbtn_box left_mmbox" @click="click_to_addinfo_close">暂不添加</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" placeholder="备注" v-model="add_data.remarks"/>
				</div>
			</div>
		</div>
		<div class="mack_box" v-show="is_request2change"></div>
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
						<input type="text" placeholder="姓名"  v-model="change_data.name" />
						<select v-model="change_data.gender">
							<option>男</option>
							<option>女</option>
						</select>
						<input type="text" placeholder="标识编码"  v-model="change_data.idNumber" />
						<select v-model="change_data.groupName">
							<option v-for="item in init_data.galleries">{{ item }}</option>
						</select>
					</div>
					<div class="mmbtn_box" @click="click_to_change_infodata">确认修改</div>
					<div class="mmbtn_box left_mmbox" @click="click_to_close_change_infodata">暂不修改</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" placeholder="标识编码" v-model="change_data.remarks"/>
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
					remarks:"--",
					name:"",
					photo: "",
					groupName: "",
					dataUrl: "",
				},
				change_data:{
					photo: "",
					dataUrl:"",
				},

				tabledata: null,
				
				// 复选框
				isallchecked: false,

				// 弹窗
				is_request2add: false,
				is_request2change: false,

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
			click_to_add_info:function(){
				// 弹窗添加
				this.is_request2add = true
			},

			// 页面跳转
			skip_to_facepath:function(img){
				// this.$store.state.search_data
				this.$store.state.facepath_data.photo = img
                this.$store.state.is_search_data_facepath = true
				this.$router.push('/facepath')
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
			},

			// 请求数据
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

					this.init_data.is_get_init_data = false
					this.$store.state.add_data = null
					this.$store.state.is_add_data = false
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
			post_to_change_page:function(search_data,change_page=0){
				// console.log(search_data)
                var params = new URLSearchParams()
                if( search_data.groupName && !change_page ){
                	if( this.init_data.galleries_id[this.init_data.galleries.indexOf(search_data.groupName)] ){
                		params.append( "groupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(search_data.groupName)]) // 搜索底库名
                	}
                	if( search_data.gender != "性别/不限" && search_data.gender ){
                		params.append( "gender", search_data.gender )   // 搜索性别
                	}
                	if( search_data.idNumber ){
                		params.append( "idNumber", search_data.idNumber )   // 搜索身份证号 该三个信息不一定有，且可能只有其中一个
                	}
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
                params.append("personSdkIds",delete_data) // 删除列表id数组
				this.$ajax.post("/person/delete",params).then((res) => {
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
			require_to_addpeople:function(add_data){
				var params = new FormData()
                
            	if( this.init_data.galleries_id[this.init_data.galleries.indexOf(add_data.groupName)] ){
            		params.append( "groupName", add_data.groupName)
            		params.append( "groupId", this.init_data.galleries_id[this.init_data.galleries.indexOf(add_data.groupName)]) // 搜索底库名
            	}
            	if( add_data.idNumber ){
            		params.append( "idNumber", add_data.idNumber )   // 搜索身份证号 该三个信息不一定有，且可能只有其中一个
            	}else{
            		this.error_info("请添加标志编号")
                    return ;
            	}
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.error_info("请添加姓名")
                    return ;
            	}
            	if( add_data.photo ){
            		params.append( "photo", add_data.photo )
            	}else if( add_data.dataUrl){
            		params.append( "photoUrl", add_data.dataUrl )
            	}else{
            		console.log(add_data)
            		this.error_info("请添加图片")
                    return ;
            	}
            	if( add_data.remarks ){
            		params.append("remarks",add_data.remarks)
            	}
            	params.append("gender",add_data.gender)
                // 请求人员数据
                this.$ajax.post("/person/add",params,{headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                    if( res.data.status === 0){
                    	this.is_request2add = false
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.add_data = {
	                    	gender:"男",
							idNumber:"",
							remarks:"--",
							name:"",
							photo: "",
							groupName: this.init_data.galleries[0],
							dataUrl: "",
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
                    	this.change_data = { photo: "",dataUrl:"" },
                    	this.success_info("修改成功")
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

			// 弹窗
			// 上传图片
			imgPreview:function(file,model){
	            let self = this;
	            // 看支持不支持FileReader
	            if (!file || !window.FileReader) return;
	    
	            if (/^image/.test(file.type)) {
	                // 创建一个reader
	                var reader = new FileReader()
	                // 将图片将转成 base64 格式
	                reader.readAsDataURL(file)
	                // 读取成功后的回调
	                reader.onloadend = function () {
	                	if( model === "add"){
	                		self.add_data.dataUrl = this.result
	                	}else if( model === "change" ){
	                		self.change_data.dataUrl = this.result
	                	}
	                    
	                }
	            }
	        },
			handleFileChange:function(e){
				let inputDOM = this.$refs.inputer;
				this.add_data.photo = inputDOM.files[0];
				this.imgPreview(this.add_data.photo,"add");
			},
			handleFileChange_change:function(e){
				let inputDOM = this.$refs.inputer_change;
				this.change_data.photo = inputDOM.files[0];
				this.imgPreview(this.change_data.photo,"change");
			},

			// 弹窗事件-添加人员
			click_to_addinfo_data:function(){
				// this.add_data.dataUrl = ""
				this.require_to_addpeople(this.add_data)
			},
			click_to_addinfo_close:function(){
				this.is_request2add = false
			},
			// 弹窗事件-修改人员
			click_to_change_infodata:function(){
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
				}else{
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