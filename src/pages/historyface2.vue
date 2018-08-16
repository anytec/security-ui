<template>
	<div class="list_box">
		<div class="mask_box">
			<div class="top_title">
				<div class="title_lefttext">抓拍记录</div>
				<div class="title_righttext">结果{{init_data.allnum}}个</div>
			</div>
			<div class="input_box">
				<select class="center_select" v-model="search_data.cameraGroupName">
					<option selected="selected">设备组/不限</option>
					<option v-for="item in init_data.cameraGroupNames">{{ item.name }}</option>
				</select>
				<input class="center_input" type="text" v-model="search_data.cameraName" placeholder="设备名称"/>
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
								<img class="td_img"  :src="item.snapshotUrl"/>
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
								<div class="td_icon1">
									<img src="../assets/historyface/icon1.png" @click="skip_to_facepath(item.snapshotUrl)"/>
								</div>
								<div class="td_icon2">
									<img src="../assets/historyface/icon8.png" @click="click_to_addface(item.uuid)"/>
								</div>
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
				},
				search_data:{
					cameraGroupName: "设备组/不限",
					cameraName: "",
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
			}//返回数据最外围
		}, // data end
		methods: {
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
				this.post_to_change_page(search_data)
			},

			// 页面跳转(操作)
			skip_to_facepath:function(img){
				// this.$store.state.search_data
				this.$store.state.facepath_data.photo = img
                this.$store.state.is_search_data = true
				this.$router.push('/facepath')
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

			// 数据初始化请求数据
			get_init_data:function(){
				var params = new URLSearchParams()
                // 设备组列表请求
				this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
            			this.init_data.cameraGroupNames = res.data.data.list
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
                this.$ajax.post("/history/getSnapshotList",params).then((res) => {
                    if( res.data.status === 0){
            			this.tabledata = res.data.data.list
            			this.init_data.allnum = res.data.data.total
            			for( let i = 0; i < this.tabledata.length; i++){
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                	this.tabledata[i].emotions = this.emotion_analysis(this.tabledata[i].emotions)
		                	console.log(this.tabledata[i].emotions)
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
			post_to_change_page:function(search_data){
				// console.log(this.search_data)
				var params = new URLSearchParams()
                for( let item in search_data ){
                	if( search_data[item].indexOf("不限") == -1 &&  search_data[item] != ""){
                		if( item === "cameraGroupName" ){
	                		for(let i = 0; i < this.init_data.cameraGroupNames.length; i++){
	                			if( search_data[item] === this.init_data.cameraGroupNames[i].name ){
	                				// params.append(item,search_data[item])
	                				params.append("cameraGroupId",this.init_data.cameraGroupNames[i].id)
	                			}
	                		}
                		}else{
                			params.append(item,search_data[item])
                		}
                	}
                	if( this.date_value ){
            			params.append("startTime",this.date_value[0]-1)
            			params.append("endTime",this.date_value[1]-1)
            		}
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
							this.tabledata[i].emotions = this.emotion_analysis(this.tabledata[i].emotions)
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
			success_info:function(mes){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
		},// methods end
		mounted:function(){
			this.get_init_data()
		},
	}
	
</script>

<style>
	/*.el-date-editor .el-range-input{
		width: 50%;
	}
	.el-date-editor>.el-range__icon,
	.el-date-editor .el-range-separator,
	.el-date-editor .el-range__close-icon{
	    line-height: 21px;
	}
	.el-input__inner{
		border: 1px solid #015758; 
	    background-color: rgba(0,0,0,0);
	}
	.el-pagination button:disabled,
	.el-pagination .btn-next, 
	.el-pagination .btn-prev,
	.el-pager li{
		background-color: rgba(0,0,0,0);
	}
	.el-icon-arrow-left:before,
	.el-icon-arrow-right:before{
		color: #00fcff;
	}
	.el-pager li{
		color:#017576;
		font-size: 16px;
	}
	.el-pager li.active{
		color: #06fafd;
	}
	.el-pagination__total,
	.el-pagination .el-select .el-input .el-input__inner,
	.el-icon-arrow-up:before,
	.el-select-dropdown__item.selected,
	.el-pagination__jump,
	.el-pagination__editor.el-input .el-input__inner{
		color:#02d0d3;
	}
	.el-pagination{
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
	  box-shadow: 1px 1px 5px (200,203,206,0.5) inset;
	}
	 
	::-webkit-scrollbar-thumb {
	  min-height: 20px;
	  background-clip: content-box;
	  box-shadow: 0 0 0 5px rgba(200,203,206,0.5) inset;
	}
	 
	::-webkit-scrollbar-corner {
	  background: transparent;
	}
	.el-range-editor.el-input__inner{
		width: 100%;
		height: 100%;
		background-color: white;
	}
	.el-date-editor .el-range-input{
		width: 50% !important;
	}*/
</style>
<style scoped>
	@import "../css/historyface.css";
</style>