<template>
	<div style="width:100%;height:100%;">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">抓拍记录</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box">
					<select class="center_select" v-model="search_data.cameraGroupName_data" >
						<option selected="selected">设备组/不限</option>
						<option v-for="item in init_data.video_groups" :value="item">{{ item.name }}</option>
					</select>
					<select class="center_select" v-model="search_data.cameraName_data" @change="test">
						<option selected="selected">设备/不限</option>
						<option v-for="item in init_data.cameraNames" :value="item">{{ item.name }}</option>
					</select>
					<!-- <input class="center_input" type="text" v-model="search_data.cameraName" placeholder="设备名称"/> -->
					<div class="right_btn h2_right_btn">
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
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall"/>
								</td>
								<td class="td td2">抓拍人脸</td>
								<td class="td td2">性别</td>
								<td class="td td2">情绪</td>
								<td class="td td7">抓拍时间</td>
								<td class="td td9">设备信息</td>
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
								<td class="td td2">
									<img class="td_img" :src="item.snapshotUrl" @click="show_pic(item.wholePhoto)" title="点击显示原图" />
								</td>
								<td class="td td2">
										{{item.gender}}
								</td>
								<td class="td td2">
										{{item.emotions}}
								</td>
								<td class="td td7">
									<div class="table_text">
										<div class="cell_text">
											{{item.catchTime}}
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text">
											{{item.cameraGroupName}}-{{item.cameraName}}
										</div>
									</div>
								</td>
								<td class="td td10">
									<div class="td_icon1 icon1" title="跳转到人脸检索" @click="skip_to_facepath(item.snapshotUrl)"></div>
									<div class="td_icon2 icon8" title="跳转添加该人脸" @click="click_to_addface(item.uuid)"></div>
								</td>
							</tr>
						</table>
					</div>
					<div class="pag">
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page="init_data.pageNum"
					      :page-sizes="[10, 20, 30, 50]"
					      :page-size="init_data.pageSize"
					      layout="total, sizes, prev, pager, next, jumper"
					      :total="init_data.allnum"
					      class="haha">
					    </el-pagination>
					</div>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_show_pic" @click="is_show_pic = false"></div>
		<div class="t_graphBox" v-show="is_show_pic" @click="is_show_pic = false">
			<div class="t_graph" >
				<div class="graph_table">
					<div class="graph_cell">
						<img style="max-width:800px; max-height:800px;" :src="total_pic" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>	
	//js
	export default {
		data(){
			return {
				init_data:{
					cameraGroupNames: null,
					pageNum: 1,
					pageSize: 10,
					video_names: [],
					video_groups: [],
				},
				search_data:{
					cameraGroupName_data: "设备组/不限",
					cameraName_data: "设备/不限",
					startTime: "",
					endTime: ""
				},
				date_value:[(new Date() - 3600 * 1000 * 24 * 1),new Date()-1],
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

				tabledata:null,

				// 复选框数据
				isallchecked: false,

				// 原图
				is_show_pic: false,
				total_pic: "",

			}//返回数据最外围
		}, // data end
		methods: {
			test:function(){
				console.log(this.search_data.cameraName_data)
			},

			// 分页栏函数
			handleSizeChange:function(val) {
				// 单页面显示数量
				this.init_data.pageSize = val
				this.post_to_change_page(this.save_search_data)
			},
			handleCurrentChange:function(val) {
				// 页面切换
				// console.log(val);
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
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
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(this.save_search_data)
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
			click_to_addface:function(num){
				// 可以直接弹窗添加，也可以跳转到库添加
				this.$store.state.add_data = {}
				this.$store.state.add_data.photo = this.tabledata[num].snapshotUrl
				this.$store.state.is_add_data = true
				this.$router.push('/mmanage2')
			},

			// 导出数据为excel
			export_data2excel:function(){
				require.ensure([], () => {
					const { export_json_to_excel } = require('../vendor/Export2Excel');
					const tHeader = ['抓拍人脸','抓拍时间','设备组','设备'];
					const filterVal = ['snapshotUrl','catchTime','cameraGroupName','cameraName'];
					let export_list = [];
					for ( let i = 0; i < this.tabledata.length; i++){
						if(this.tabledata[i].ischecked){
							export_list.push(JSON.parse(JSON.stringify(this.tabledata[i])))
						}
					}
					// console.log(export_list)
					const list = export_list;
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '导出列表');
				})
			},
			formatJson:function(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},

			// 从别的页面跳转到该页面
			skip_from_other:function(){
				if( this.$store.state.is_search_data ){
    				let search_data = {
    					"faceSdkId": this.$store.state.search_data.faceSdkId
    				}

    				this.post_to_change_page(search_data)
    				this.$store.state.is_search_data = false
					this.$store.state.search_data = {}
    			}else{
    				this.post_to_change_page( {} )
    			}
			},
			// 数据初始化请求数据
			get_init_data:function(){
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

						this.skip_from_other()
			        }else if( res.data.status === 1 ){
			            this.error_info(res.data.msg)
			        	return ;
			        }else if( res.data.status === 2 ){
			            this.error_info(res.data.msg)
			        	return ;
			        }else if( res.data.status === 10 ){
			            this.error_info('请先登录')
			        	return ;
			        }else{
                    	this.error_info(res.data.status + "  " + res.data.msg)
                    }
			    }).catch((error) => {
			    	console.log(error)
			    	this.error_info('网络连接出错')
			        return ;
			    })
			},
			post_to_change_page:function(search_data){
				var params = new URLSearchParams()
               	
               	for( let item in search_data ){
            		// console.log(item)
            		if( item === "cameraName_data" ){
            			console.log(search_data[item])
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
                	if( search_data[item] != ""){
                		params.append(item,search_data[item])
                	}
                }
                if( this.date_value ){
    				// console.log(date_value)
        			params.append("startTime",this.date_value[0] - 1)
        			params.append("endTime",this.date_value[1] - 1)
    			}

                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
                this.$ajax.post("/history/getSnapshotList",params).then((res) => {
                    if( res.data.status === 0){
            			this.tabledata = res.data.data.list
            			this.init_data.allnum = res.data.data.total
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
							if( this.tabledata[i].emotions ){
		                		this.tabledata[i].emotions = this.emotion_analysis(this.tabledata[i].emotions)
		                	}
		                	if( this.tabledata[i].gender === "female" ){
		                		this.tabledata[i].gender = "女"
		                	}else if( this.tabledata[i].gender === "male" ){
		                		this.tabledata[i].gender = "男"
		                	}
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
                    }else{
                    	this.error_info(res.data.status + "  " + res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			emotion_analysis:function(emotions){
				let emotions_new = []
				for( let i = 0; i < emotions.length; i++ ){
					let emotion = emotions[i]
					if( emotion === "sad" ){
						emotions_new.push("伤心")
					}else if( emotion === "happy"){
						emotions_new.push("快乐")
					}else if( emotion === "surprise" ){
						emotions_new.push("惊讶")
					}else if( emotion === "fear" ){
						emotions_new.push("害怕")
					}else if( emotion === "neutral"){
						emotions_new.push("常态")
					}else if( emotion === "angry" ){
						emotions_new.push("生气")
					}else if( emotion === "disgust"){
						emotions_new.push("嫌弃")
					}
				}
				return emotions_new.join(',')
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
		},// methods end
		mounted:function(){
			this.get_init_data()
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
				for( let i = 0; i < this.init_data.video_names[active_groups_num].length; i++ ){
					this.init_data.cameraNames.splice(i,0,
						{
							name: this.init_data.video_names[active_groups_num][i].name,
							cameraSdkId: this.init_data.video_names[active_groups_num][i].sdkId						}
					)
				}
			},
		},

		beforeRouteLeave(to, from, next) {
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