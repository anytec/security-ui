<template>
	<div class="syslist_box1">
		<div class="mask_box">
			<div class="top_title">
				<div class="sys_lefttext">操作记录</div>
				<div class="sys_input" @keyup.enter="keyup_to_search">
					<input type="text" placeholder="搜索用户名" v-model="search_data.uname" />
					<div class="sysSearch_box" @click="click_to_search">
						<img :src="alert_src" @mouseover="alert_src=ale_imgsrc2" @mouseout="alert_src=ale_imgsrc1"/>
					</div>
				</div>
				<select v-model="search_data.operationObj" v-show="false">
					<option v-for="item in operands">{{item}}</option>
				</select>
				<select v-model="search_data.operationType" >
					<option v-for="item in optypes">{{item}}</option>
				</select>
			</div>
			<div class="systable_box">
				<div class="table_thbox systable_thbox">
					<table>
						<tr>
							<td class="td td1">用户名</td>
							<td class="td td1">操作时间</td>
							<td class="td td1">操作类型</td>
							<td class="td td1">操作对象</td>
							<!-- <td class="td td1">操作内容</td> -->
							<td class="td td1">操作结果</td>
						</tr>
					</table>
				</div>
				<div class="table_thbox2 systable_thbox2">
					<table>
						<tr class="tr" v-for="item in tabledata">
							<td class="td td1">
								<div class="table_text">
									<div class="cell_text">
										{{item.uname}}
									</div>
								</div>
							</td>
							<td class="td td1">
								<div class="table_text">
									<div class="cell_text">
										{{item.operationTime}}
									</div>
								</div>
							</td>
							<td class="td td1">
								<div class="table_text">
									<div class="cell_text">
										{{item.operationType}}
									</div>
								</div>
							</td>
							<td class="td td1">
								<div class="table_text">
									<div class="cell_text">
										{{item.operationObj}}
									</div>
								</div>
							</td>
							<!-- <td class="td td1">
								<div class="td_icon2 sys2_tdtext" :title="item.objId" v-if="item.objId"> 查看详情 </div>
								<div class="td_icon2 sys2_tdtext" title="无内容" v-if="!item.objId"> 查看详情 </div>
							</td> -->
							<td class="td td1">
								<div class="td_icon2 sys2_tdtext">
									{{item.operationResult}}
								</div>
							</td>
						</tr>
					</table>
					
				</div>
				<div class="pag system_pag">
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
	</div>
</template>

<script>
	import MyNav from "./mynav"
	import LeftNav from "./left_nav7"
	
	//js
	export default {
		data(){
			return {
				alert_src:require('../assets/system/sys_search.svg'),
				ale_imgsrc1:require('../assets/system/sys_search.svg'),
				ale_imgsrc2:require('../assets/system/sys_search_1.svg'),
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
				value:[(new Date() - 3600 * 1000 * 24 * 1),new Date()],
				init_data: {
					pageNum: 1,
					pageSize: 10,
					allnum: 0,
				},
				tabledata: [],

				operands: [ "操作对象/全部","底库","底库人员","设备组","设备" ],
				optypes: [ "操作类型/全部","添加","删除","查找","修改" ],
				search_data: {
					operationObj: "操作对象/全部",
					operationType: "操作类型/全部",
					uname: "",
				},
				save_search_data: {},

				isallchecked: false,
			}//返回数据最外围
		},
		components:{
			MyNav,
			LeftNav
		},
		methods: {
			test:function(value){
				console.log(value)
			},

			handleSizeChange:function(val) {
				this.init_data.pageSize = val
				this.get_init_data( this.save_search_data )
			},
			handleCurrentChange:function(val) {
				this.init_data.pageNum = val
				this.get_init_data( this.save_search_data )
			},

			// 输入-校验
            check_input:function(input_data,model=""){
                let reg = /^.{0,20}$/

                return reg.test(input_data)
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

			// 搜索事件
			click_to_search:function(){
				if(!this.check_input(this.search_name)){
					this.warning_info("用户名应输入不超过20个字或字符")
					return ;
				}

				this.init_data.pageNum = 1
				
				let search_data = {}
				if( this.search_data.operationType != "操作类型/全部" ){
					search_data.operationType = this.search_data.operationType
				}
				if( this.search_data.uname != "" )
				search_data.uname = this.search_data.uname
				
				this.save_search_data = search_data
				this.get_init_data( search_data )
			},
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				this.click_to_search()
			},

			// 请求
			mes_handling:function(status, msg){
                if( status === 1 ){
                    this.error_info(msg)
                    return ;
                }else if( status === 2 ){
                    this.error_info(msg)
                    return ;
                }else if( status === 10 ){
                    this.error_info('请先登录')
                    return ;
                }else{
                    if( status === 401 && msg === "未登录" ){
                        this.error_info(msg)
                        this.$router.push("/login")
                    }else{
                        this.error_info(status + "  " + msg)
                    }
                }
            },
			get_init_data:function( search_data = {} ){
    			search_data.pageNum = this.init_data.pageNum
    			search_data.pageSize = this.init_data.pageSize
				this.$ajax.get("/log/operationRecordList",{params: search_data }).then((res) => {
                    if( res.data.status === 0){
                    	this.init_data.allnum = res.data.data.total
                		this.tabledata = res.data.data.list
                		for( let i = 0; i < this.tabledata.length; i++ ){
                			// let time_ymd = this.tabledata[i].operationTime.split("T")[0]
                			// let time_hms = this.tabledata[i].operationTime.split("T")[1].split(".")[0]
                			// this.tabledata[i].operationTime = time_ymd + " " + time_hms
                			if(this.tabledata[i].operationResult){
                				this.tabledata[i].operationResult = "操作成功"
                			}else{
                				this.tabledata[i].operationResult = "操作失败"
                			}
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
			success_info:function(mes){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
		},
		mounted(){
			this.get_init_data()
		},
		watch:{
			'search_data.uname':function(newval,old){
				if( newval === "" ){
					this.click_to_search()
				}
			},
		}
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