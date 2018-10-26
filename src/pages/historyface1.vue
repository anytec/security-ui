<template>
	<div style="width:100%;height:100%;">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">报警记录</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
					<select class="center_select" v-model="search_data.cameraGroupName_data">
						<option selected="selected">设备组/不限</option>
						<option v-for="item in init_data.video_groups" :value="item">{{ item.name }}</option>
					</select>
					<select class="center_select" v-model="search_data.cameraName_data" @change="show_sub">
						<option selected="selected">设备/不限</option>
						<option v-for="item in init_data.cameraNames" :value="item">{{ item.name }}</option>
					</select>
					<select class="center_select" v-model="search_data.personGroupName_data">
						<option selected="selected">底库/不限</option>
						<option v-for="item in init_data.galleries" :value="item">{{ item.name }}</option>
					</select>
				</div>
				<div class="input_box" @keyup.enter="keyup_to_search">
					<input class="center_input id_card" type="text" v-model="search_data.personName" placeholder="姓名(最长20个字符)" maxlength="20"/>
					<input class="center_input id_card" type="text" v-model="search_data.idNumber" placeholder="标识编码(最长50个字符)" maxlength="50"/>
					<select class="center_select" v-model="search_data.gender">
						<option selected="selected">性别/不限</option>
						<option>男</option>
						<option>女</option>
					</select>
					<!-- <input class="center_input" type="text" v-model="search_data.cameraName" placeholder="设备名称或设备ID"/> -->
					<div class="h1_right">
						<div class="time_box">时间范围</div>
						<div class="time_input">
							<el-date-picker 
							  v-model="date_value"
							  type="datetimerange"
							  :picker-options="pickeroptions"
							  range-separator="至"
		  					  start-placeholder="开始日期"
		  					  end-placeholder="结束日期">
		  					</el-date-picker>
						</div>
						<div class="export_btn" @click="export_data2excel">导出</div>
						<div class="search h1_search" @click="click_to_search(search_data)">搜索</div>
					</div>
				</div>
				<div class="table_box">
					<div class="table_thbox">
						<table :style="{'width': tabledata_style}">
							<tr>
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall"/>
								</td>
								<td class="td td8">抓拍人脸</td>
								<td class="td td8">目标人脸</td>
								<td class="td td6">相似度</td>
								<td class="td td6">姓名</td>
								<td class="td td4">性别</td>
								<td class="td td14">标识编码</td>
								<td class="td td18">抓拍时间</td>
								<td class="td td6">所在底库</td>
								<td class="td td18">设备信息</td>
								<td class="td td6">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2" ref="table_f">
						<table id="tabledata" ref="table_c">
							<tr class="tr" v-for="item in tabledata">
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)"/>
								</td>
								<td class="td td8">
									<img class="td_img"  :src="item.snapshotUrl"  @click="show_pic(item.wholePhoto)" title="点击显示原图" />
								</td>
								<td class="td td8">
									<!-- <img class="td_img"  :src="item.faceUrl"  @click="show_pic(item.photo)" title="点击显示原图"/> -->
									<img class="td_img"  :src="item.faceUrl" />
								</td>
								<td class="td td6">
									<div class="table_text">
										<div class="cell_text">
											{{item.confidence}}%
										</div>
									</div>
								</td>
								<td class="td td6">
									<div class="table_text">
										<div class="cell_text">
											{{item.personName}}
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
								<td class="td td14">
									<div class="table_text">
										<div class="cell_text">
											{{item.idNumber}}
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											{{item.catchTime}}
											<!-- {{ item.catchTime.split(" ")[0] }}
											<br>
											{{ item.catchTime.split(" ")[1] }} -->
										</div>
									</div>
								</td>
								<td class="td td6">
									<div class="table_text">
										<div class="cell_text">
											{{item.personGroupName}}
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											{{item.cameraGroupName}}-{{item.cameraName}}
										</div>
									</div>
								</td>
								<td class="td td6">
									<div class="icon_fa icon_hi">
	                                	<div class="td_icon2 icon5" title="跳转到底库人员" @click="skip_to_mmanage2(item.uuid)"></div>
	                                    <div class="td_icon2 icon1" title="跳转到人脸检索" @click="skip_to_facepath(item.snapshotUrl)"></div>
	                                </div>
                                </td>
							</tr>
						</table>
					</div>
					<el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="init_data.pageNum"
				      :page-sizes="[10, 20, 30, 50]"
				      :page-size="init_data.pageSize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="init_data.allnum">
				    </el-pagination>
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
	</div>

</template>


<script>
	import LeftNav from "./left_nav"
	
	//js
	export default {
		data(){
			return {
				init_data: {
					galleries: null,
					pageNum: 1,
					pageSize: 10,
					allnum: 0,
					video_groups: [],
					video_names: [],
					cameraNames: [],
				},
				// 搜索数据
				search_data:{
					idNumber: "",
					cameraName: "",
					personName: "",
					cameraGroupName_data: "设备组/不限",
					personGroupName_data: "底库/不限",
					// cameraName: "",
					gender: "性别/不限",
					startTime: "",
					endTime: "",
					cameraId: "",
					cameraName_data: "设备/不限",
				},
				date_value: [],
				save_search_data:{
				},
				pickeroptions:{
					shortcuts: [{
						text: '最近三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
						},{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
						}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
						}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				
				tabledata: null,
				// 多选判断
				isallchecked: false,

				// 原图
				is_show_pic: false,
				total_pic: "",

				// 滚动条
				tabledata_style: "width:100%",
			}//返回数据最外围
		},
		components:{
			LeftNav
		},
		methods: {
			handleSizeChange:function(val) {
				// 单页面显示数量
				this.isallchecked = false
				this.init_data.pageSize = val
				this.post_to_change_page(this.save_search_data)
                this.$refs.table_f.scrollTop = 0;
			},
			handleCurrentChange:function(val) {
				// 页面切换
				// console.log(val);
				this.isallchecked = false
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
                this.$refs.table_f.scrollTop = 0;
			},

			// 选择框获取值
			show_sub:function(){
				// console.log(this.search_data.cameraName_data)
			},

			// 复选框函数
			click_to_checkedall:function(){
				if(!this.isallchecked){
					this.isallchecked = true
					for( let i = 0; i < this.tabledata.length; i++){
						this.tabledata[i].ischecked = true
					}
				}else{
					this.isallchecked = false
					for( let i = 0; i < this.tabledata.length; i++){
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
			click_to_search:function(search_data){
				if( !this.check_idNumber(search_data.idNumber) ){
					this.warning_info("标识编码应输入字母、数字;长度小于50")
					return ;
				}
				this.isallchecked = false
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
				this.isallchecked = false
				for( let i = 0; i < this.tabledata.length; i++ ){
					this.tabledata[i].ischecked = false
				} 
			},
			check_idNumber:function(idNumber){
				let reg = /^[a-zA-Z0-9\-]{0,50}$/

                return reg.test(idNumber)
			},
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				// this.save_search_data = this.search_data
				// this.post_to_change_page(this.search_data)
				this.click_to_search(this.search_data)
			},

			// 页面跳转(操作)
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
			skip_to_mmanage2:function(num){
				this.$store.state.search_data.groupName = this.tabledata[num].personGroupName
				this.$store.state.search_data.groupId = this.tabledata[num].personGroupId
				this.$store.state.search_data.faceSdkId = this.tabledata[num].faceSdkId
				this.$store.state.is_search_data = true
				this.$router.push('/mmanage2')
			},

			// 导出数据为excel
			export_data2excel:function(){
				require.ensure([], () => {
					const { export_json_to_excel } = require('../vendor/Export2Excel');
					const tHeader = ['抓拍人脸','目标人脸','相似度','姓名','性别','抓拍时间','设备组','设备'];
					const filterVal = ['snapshotUrl','faceUrl','confidence','personName','gender','catchTime','cameraGroupName','cameraName'];
					let export_list = [];
					for ( let i = 0; i < this.tabledata.length; i++){
						if(this.tabledata[i].ischecked){
							export_list.push(JSON.parse(JSON.stringify(this.tabledata[i])))
							// delete export_list.area
							// export_list[i].area_group = this.tabledata[i].cameraGroupName
							// export_list[i].area_camera = this.tabledata[i].cameraName
						}
					}
					// console.log(export_list)
					const list = export_list;
					const data = this.formatJson(filterVal, list);
					// console.log(data)
					export_json_to_excel(tHeader, data, '导出列表');
					this.isallchecked = false
					for( let i = 0; i < this.tabledata.length; i++ ){
						this.tabledata[i].ischecked = false
					}
				})
			},
			formatJson:function(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},

			// 数据初始化请求数据
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
                    	this.init_data.galleries = []
                    	for( let i = 0; i < res.data.data.list.length; i++ ){
                    		this.init_data.galleries.splice(i, 0, { name:res.data.data.list[i].name, id:res.data.data.list[i].id })
                    	}
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })

				// 请求设备组列表
				var params = new URLSearchParams()
				this.$ajax.post("/groupCamera/getAllCameras",params).then((res) => {
					this.init_data.video_groups,this.init_data.video_names,this.init_data.cameraNames = [],[],[]
			        if( res.data.status === 0){
						for( let item in res.data.data ){
							let [name,id] = item.split(",")
							this.init_data.video_groups.push( {"name":name,"id":id} )
							this.init_data.video_names.push( res.data.data[item] )
							for( let i = 0; i < res.data.data[item].length; i++ ){
								this.init_data.cameraNames.push( {"name":res.data.data[item][i].name,"cameraSdkId":res.data.data[item][i].sdkId} )
							}
						}
						this.get_init_data3()
			        }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
			    }).catch((error) => {
			    	console.log(error)
			    	this.error_info('网络连接出错')
			        return ;
			    })
			},
			get_init_data3:function(){
				if ( this.$store.state.is_search_data ){

					// 清空搜索条件
					this.save_search_data = {}

					let get_data = JSON.parse(JSON.stringify(this.$store.state.search_data))

					// console.log( get_data )
					for( let item in get_data ){
						if( item === "personGroupName" ){
							this.search_data.personGroupName_data = { name:get_data.personGroupName, id:get_data.personGroupId }
						}else if( item === "cameraGroupName" ){
							this.search_data.cameraGroupName_data = { name:get_data.cameraGroupName, id:get_data.cameraGroupId }
						}else if( item === "cameraName"){
							this.search_data.cameraName_data = { name:get_data.cameraName, cameraSdkId:get_data.cameraSdkId }
						}else if( item === "faceSdkId" || item === "cameraGroupId" || item === "personGroupId" || item === "idNumber" || item === "cameraSdkId"){
							if( item === "idNumber" ){
								this.search_data.idNumber = get_data[item]
							}
							this.save_search_data[item] = get_data[item]
						}
					}
					
					// console.log(this.save_search_data)

					this.post_to_change_page(this.save_search_data,true)
					this.$store.state.is_search_data = false
					this.$store.state.search_data = {}
				}else{
					this.get_init_data2()
				}
			},
			get_init_data2:function(){
				var params = new URLSearchParams()
				this.$ajax.post("/history/getWarningFaceList",params).then((res) => {
                    if( res.data.status === 0){
            			this.tabledata = res.data.data.list
            			this.init_data.allnum = res.data.data.total
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                	this.tabledata[i].confidence = Math.round(this.tabledata[i].confidence * 100)
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
			post_to_change_page:function(search_data,change_page=false){
				// console.log(search_data)
                var params = new URLSearchParams()
                if( !change_page ){
                	for( let item in search_data ){
                		// console.log(item)
                		if( item === "cameraName_data" ){
                			if( search_data[item].cameraSdkId ){
                				params.append( "cameraSdkIds",search_data[item].cameraSdkId )
                			}
                			continue ;
                		}
                		if( item === "cameraGroupName_data" ){
	                		if( search_data[item].id ){
                				params.append( "cameraGroupId",search_data[item].id )
                			}
                			continue ;
                		}
                		if( item === "personGroupName_data"){
                			if( search_data[item].id ){
                				params.append( "personGroupId",search_data[item].id )
                			}
                			continue ;
                		}
                		if( item === "gender" ){
                			if( search_data[item].indexOf("不限") === -1){
                				params.append( "gender",search_data[item] )
                			}
                			continue ;
                		}
	                	if( search_data[item] != ""){
	                		params.append(item,search_data[item])
	                	}
	                }
                }else if ( change_page ){
                	for(let key in search_data ){
                		params.append(key,search_data[key])
                	}
                }

                if( this.date_value ){
    				// console.log(date_value)
   					if( this.date_value.length ){
   						params.append("startTime",this.date_value[0] - 1)
        				params.append("endTime",this.date_value[1] - 1)
   					}
    			}
                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
                this.$ajax.post("/history/getWarningFaceList",params).then((res) => {
                    if( res.data.status === 0){
            			this.tabledata = res.data.data.list
            			this.init_data.allnum = res.data.data.total
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                	this.tabledata[i].confidence = Math.round(this.tabledata[i].confidence *100)
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

			// 消息窗口
			error_info:function(mes){
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
		},
		mounted:function(){
			this.get_init_data1()
		},
		watch:{
			'search_data.cameraGroupName_data.name':function(newval,old){
				let value = this.search_data.cameraGroupName_data.name

				if( !value ){
					this.init_data.cameraNames = []
					for( let i = 0; i < this.init_data.video_names.length; i++ ){
						for( let j = 0; j < this.init_data.video_names[i].length; j++ ){
							this.init_data.cameraNames.push( {"name":this.init_data.video_names[i][j].name,"cameraSdkId":this.init_data.video_names[i][j].sdkId} )
						}
					}
					return ;
				}
				let active_groups_num = 0
				this.init_data.cameraNames = []
				for( let i = 0; i < this.init_data.video_groups.length; i++ ){
					if( newval === this.init_data.video_groups[i].name ){
						active_groups_num = i
						break
					}
				}
				// console.log(this.init_data.video_names)
				for( let i = 0; i < this.init_data.video_names[active_groups_num].length; i++ ){
					this.init_data.cameraNames.splice(i,0,
						{
							name: this.init_data.video_names[active_groups_num][i].name,
							cameraSdkId: this.init_data.video_names[active_groups_num][i].sdkId,					
						}
					)
				}
			},
			'search_data.idNumber':function(newval,old){
				if( newval === "" ){
					this.click_to_search(this.search_data)
				}
			},
            'search_data.personName':function(newval,old){
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
			// console.log(to.path)
			if( to.path === "/facepath" && this.$store.state.is_search_data_facepath ){
				to.meta.keepAlive = false; 
			}
			next()
	    }
	}
</script>

<style scoped>
	@import "../css/historyface.css";
</style>
