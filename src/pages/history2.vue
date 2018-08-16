<template>
	<!--html,不用head和body-->
	<div class="main_box">
		<left-nav></left-nav>
		<my-nav></my-nav>
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">抓拍记录</div>
					<div class="title_righttext">结果2个</div>
				</div>
				<div class="input_box">
					<select class="center_select" v-model="search_data.choose_group">
						<option selected="selected">设备组/不限</option>
						<option v-for="item in init_data.group">{{ item }}</option>
					</select>
					<input class="center_input" type="text" v-model="search_data.device_name" placeholder="设备名称或设备ID"/>
					<div class="right_btn h2_right_btn">
						<div class="time_box">时间范围</div>
						<div class="time_input">
							<el-date-picker 
							  v-model="search_data.date_value"
							  type="datetimerange"
							  :picker-options="pickeroptions"
							  range-separator="至"
	      					  start-placeholder="开始日期"
	      					  end-placeholder="结束日期">
	      					</el-date-picker>
						</div>
						<div class="export_btn" @click="export_data2excel">导出</div>
						<div class="search h2_search" @click="post_to_search">搜索</div>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table>
							<tr>
								<td class="td td1">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" @click="click_to_checkedall"/>
								</td>
								<td class="td td2">抓拍人脸</td>
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
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked"/>
								</td>
								<td class="td td2">
									<img class="td_img"  :src="item.img"/>
								</td>
								<td class="td td7">
									<div class="table_text">
										<div class="cell_text">
											{{item.time}}
										</div>
									</div>
								</td>
								<td class="td td9">
									<div class="table_text">
										<div class="cell_text">
											{{item.area.area}}-{{item.area.group}}-{{item.area.camera}}
										</div>
									</div>
								</td>
								<td class="td td10">
									<div class="td_icon1">
										<img src="../assets/historyface/icon1.png"/>
									</div>
									<div class="td_icon2">
										<img src="../assets/historyface/icon2.png"/>
									</div>
								</td>
							</tr>
						</table>
					</div>
					<div class="pag">
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page="currentPage"
					      :page-sizes="[10, 20, 30, 50]"
					      :page-size="page_num"
					      layout="total, sizes, prev, pager, next, jumper"
					      :total="pages_num"
					      class="haha">
					    </el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import MyNav from "./mynav"
	import LeftNav from "./left_nav"
	
	//js
	export default {
		data(){
			return {
				init_data:{
					group: ['组1','组2','组3'],
				},
				search_data:{
					choose_group: "设备组/不限",
					device_name: "",
					date_value:[(new Date() - 3600 * 1000 * 24 * 1),new Date()],
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
				currentPage: 1,
				page_num: 10,
				pages_num: 100,
				tabledata: [{
					id: 1,
					ischecked: false,
					// img: require("../assets/list/img1.jpg"),
					img: "http://img1.imgtn.bdimg.com/it/u=3044191397,2911599132&fm=27&gp=0.jpg",
					time: '2018-7-12 17:39:27',
					area:{
						area: '区域1',
						group: '组1',
						camera: 'camera1',
					},
				},{
					id: 2,
					ischecked: false,
					img: require("../assets/historyface/img1.jpg"),
					time: '2018-7-12 17:39:27',
					area:{
						area: '区域1',
						group: '组1',
						camera: 'camera1',
					},
				},{
					id: 3,
					ischecked: false,
					img: require("../assets/historyface/img1.jpg"),
					time: '2018-7-12 17:39:27',
					area:{
						area: '区域1',
						group: '组1',
						camera: 'camera1',
					},
				},{
					id: 4,
					ischecked: false,
					img: require("../assets/historyface/img1.jpg"),
					time: '2018-7-12 17:39:27',
					area:{
						area: '区域1',
						group: '组1',
						camera: 'camera1',
					},
				},{
					id: 5,
					ischecked: false,
					img: require("../assets/historyface/img1.jpg"),
					time: '2018-7-12 17:39:27',
					area:{
						area: '区域1',
						group: '组1',
						camera: 'camera1',
					},
				}],
				isallchecked: false,
			}//返回数据最外围
		},
		components:{
			MyNav,
			LeftNav
		},
		methods: {
			handleSizeChange:function(val) {
				console.log(val);
			},
			handleCurrentChange:function(val) {
				console.log(val);
			},
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

			// 导出数据为excel
			export_data2excel:function(){
				require.ensure([], () => {
					const { export_json_to_excel } = require('../vendor/Export2Excel');
					const tHeader = ['图片','时间','地点'];
					const filterVal = ['img','time','area'];
					let export_list = [];
					for ( let i = 0; i < this.tabledata.length; i++){
						if(this.tabledata[i].ischecked){
							export_list.push(this.tabledata[i])
						}
					}
					console.log(export_list)
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
				this.$ajax.get("/history").then((res) => {
                    if( res.data["result"] ){
                        this.init_data.group = res.data["result"].group
                        // console.log("get success!")
                        this.tabledata = res.data["result"].tabledata
                    }
                })
			},
			post_to_search:function(){
				console.log(this.search_data)
				var params = new URLSearchParams()
                params.append("device_name",this.search_data.device_name)
                params.append("choose_group",this.search_data.choose_group)
                params.append("date_value",this.search_data.date_value)
                this.$ajax.post("history",params).then((res) => {
                    if(res.data["result"]){
                        this.tabledata = res.data["result"].tabledata
                    }else{
                        
                    }
                }).catch((error) => {
                    this.$message({
                        type: 'error',
                        message: '网络连接出错',
                        showClose: true,
                        center: true
                    })
                    return false
                })
			},
			created:function(){
				// this.get_init_data()
			},
		},
	}
	
</script>

<style>
	.el-date-editor .el-range-input{
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
	}
</style>
<style scoped>
	@import "../css/historyface.css";
</style>