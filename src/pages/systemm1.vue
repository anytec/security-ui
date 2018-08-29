<template>
	<div style="width:100%;height:100%;">
		<div class="syslist_box1">
            <div class="mask_box">
                <div class="top_title">
                    <div class="sys_lefttext">用户列表</div>
                    <div class="sys_addicon" @click="AddPerson" title="添加用户">
                    	<img :src="sys_imgsrc" @mouseover="sys_imgsrc=sys_imgsrc2" @mouseout="sys_imgsrc=sys_imgsrc1"/>
                    </div>
                    <div class="sys_input">
                        <input type="text" placeholder="搜索用户名" v-model="search_name"/>
                        <div class="sysSearch_box" @click="click_to_search">
                            <img :src="alert_src" @mouseover="alert_src=ale_imgsrc2" @mouseout="alert_src=ale_imgsrc1"/>
                        </div>
                    </div>
                </div>
                <div class="systable_box">
                    <div class="table_thbox systable_thbox">
                        <table>
                            <tr>
                                <td class="td td1">用户名</td>
                                <td class="td td1">ID</td>
                                <td class="td td1">权限</td>
                                <td class="td td9">备注</td>
                                <td class="td td10">设置</td>
                            </tr>
                        </table>
                    </div>
                    <div class="table_thbox2 systable_thbox2">
                        <table>
                            <tr class="tr" v-for="item,index in tabledata">
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
                                            {{item.id}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td1">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.role}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td9">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.notes}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td10">
                                    <div class="icon_fa">
                                    	<div class="td_icon2 systd_icon2" @click="click_to_update_person(item.id,index)">
	                                        <img src="../assets/historyface/icon2.png"/>
	                                    </div>
	                                    <div class="td_icon2 systd_icon2" @click="click_to_delete_person(index)">
	                                        <img src="../assets/system/trash.svg"/>
	                                    </div>
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
        <!--遮罩层-->
        <div class="mack_box" v-show="is_click_to_add || is_click_to_set"></div>
        <!--弹窗1-->
        <div class="sysadd_user" v-show="is_click_to_add">
            <div class="systitle_user">
                <div class="systitle_text">添加用户</div>
                <div class="sysconter_box">
                    <div class="sys_maxbox">
                        <div class="sysleft_text">用户名：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.uname" /></div>
                        <div class="sysleft_text">密码：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.upass"/></div>
                    </div>
                    <div class="sys_maxbox">
                        <div class="sysleft_text">备注：</div>
                        <div class="sysleft_input sysleft_input2"><input type="text" v-model="showData.notes" /></div>
                    </div>
                </div>
                <div class="sys_cancelbtn" @click="close_add_info">
                	<img title="取消" :src="sys_cancelbtn" @mouseover="sys_cancelbtn=sys_cancelbtn2" @mouseout="sys_cancelbtn=sys_cancelbtn1"/>
                </div>
                <div class="sys_addbtn" @click="confirm_add_data">
                	<img title="确认添加" :src="sys_confirmbtn" @mouseover="sys_confirmbtn=sys_confirmbtn2" @mouseout="sys_confirmbtn=sys_confirmbtn1"/>
                </div>
            </div>  
        </div>
        <!--弹窗2-->
        <div class="sysadd_user" v-show="is_click_to_set">
            <div class="systitle_user">
                <div class="systitle_text">编辑用户</div>
                <div class="sysconter_box">
                    <div class="sys_maxbox">
                        <div class="sysleft_text">用户名：</div>
                        <div class="sysleft_input"><input readonly="readonly" type="text" v-model="showData.uname"/></div>
                        <div class="sysleft_text">密码：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.upass"/></div>
                    </div>
                    <div class="sys_maxbox">
                        <div class="sysleft_text">备注：</div>
                        <div class="sysleft_input sysleft_input2"><input type="text" v-model="showData.notes"/></div>
                    </div>
                </div>
                <div class="sys_cancelbtn" @click="close_add_info">
                	<img title="取消" :src="sys_cancelbtn" @mouseover="sys_cancelbtn=sys_cancelbtn2" @mouseout="sys_cancelbtn=sys_cancelbtn1"/>
                	</div>
                <div class="sys_addbtn" @click="confirm_set_data">
                	<img title="确认修改" :src="sys_confirmbtn" @mouseover="sys_confirmbtn=sys_confirmbtn2" @mouseout="sys_confirmbtn=sys_confirmbtn1"/>
                </div>
                <!-- <div class="delete_box" @click="confirm_delete_data">
                	<img title="确认删除" :src="delete_box" @mouseover="delete_box=delete_box2" @mouseout="delete_box=delete_box1"/>
                </div> -->
            </div>  
        </div>
	</div>
</template>

<script>
	//js
	export default {
		data(){
			return {
				alert_src:require('../assets/system/sys_search.svg'),
				ale_imgsrc1:require('../assets/system/sys_search.svg'),
				ale_imgsrc2:require('../assets/system/sys_search_1.svg'),
				sys_imgsrc:require('../assets/system/add_icon.svg'),
				sys_imgsrc1:require('../assets/system/add_icon.svg'),
				sys_imgsrc2:require('../assets/system/add_icon1.svg'),
				sys_cancelbtn:require('../assets/system/cancel.svg'),
				sys_cancelbtn1:require('../assets/system/cancel.svg'),
				sys_cancelbtn2:require('../assets/system/cancel_1.svg'),
				sys_confirmbtn:require('../assets/system/confirm.svg'),
				sys_confirmbtn1:require('../assets/system/confirm.svg'),
				sys_confirmbtn2:require('../assets/system/confirm_1.svg'),
				delete_box:require('../assets/system/delete.svg'),
				delete_box1:require('../assets/system/delete.svg'),
				delete_box2:require('../assets/system/delete_1.svg'),
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
				tabledata: {},
				
				isallchecked: false,

				init_data: {
					pageNum: 1,
					pageSize: 10,
					allnum: 0,
				},
				search_name: "",
				save_search_data: "",
				delete_data: [],
				// 弹窗
				showData:{},
				// 添加用户
				is_click_to_add: false,

				// 设置用户
				is_click_to_set: false,
			}//返回数据最外围
		},
		methods: {
			handleSizeChange:function(val) {
				this.init_data.pageSize = val
				this.get_init_data( {keyword:this.save_search_data} )
			},
			handleCurrentChange:function(val) {
				this.init_data.pageNum = val
				this.get_init_data( {keyword:this.save_search_data} )
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

			// 弹窗
			// 添加事件
			AddPerson:function(){
				this.is_click_to_add = true
			},
			confirm_add_data:function(){
				this.require_add_person(this.showData)
			},
			close_add_info:function(){
				this.showData = {}
				this.is_click_to_add = false
				this.is_click_to_set = false
			},
			// 修改事件
			click_to_update_person:function(id,index){
				this.require_get_change_person(id,index)
			},
			confirm_set_data:function(){
				let update_date = {}
				let items = ["upass","notes"]
				for( let i = 0; i < items.length; i++ ){
					if( this.showData[items[i]] != this.tabledata[this.showData.uuid][items[i]] ){
						update_date[items[i]] = this.showData[items[i]]
					}
				}
				update_date.id = this.tabledata[this.showData.uuid].id
				this.require_to_update( update_date )

				this.is_click_to_set = false
			},
			// 搜素事件
			click_to_search:function(){
				this.save_search_data = this.search_name
				this.get_init_data( {keyword:this.search_name} )
			},
			// 删除事件
			click_to_delete_person:function(index){
				this.$confirm('是否删除该数据？','提示',{
					confirmButtonText: '是',
		            cancelButtonText: '否',
		            type: 'warning'
				}).then(() => {
					this.delete_data.push( this.tabledata[index].id )
					this.require_to_delete(this.delete_data)
					this.delete_data = []
				}).catch(() => {
					;
				})
			},

			// 请求
			get_init_data:function( search_data = {} ){
				// 请求库名
				var params = new URLSearchParams()
				if( search_data.keyword ){
					params.append("keyword",search_data.keyword)
				}
				params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
				this.$ajax.post("/user/list",params).then((res) => {
                    if( res.data.status === 0){
                    	this.init_data.allnum = res.data.data.total
                		this.tabledata = res.data.data.list
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }else{
                    	this.error_info(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_get_change_person:function( id,index ){
				var params = new URLSearchParams()
                params.append("id",id)

				this.$ajax.post("/user/getUserInfo",params).then((res) => {
                    if( res.data.status === 0){
                    	this.showData = JSON.parse(JSON.stringify(res.data.data))
						this.showData.uuid = index
						this.is_click_to_set = true
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }else{
                    	this.error_info(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_add_person:function( add_data ){
				var params = new URLSearchParams()
                for( let item in add_data ){
                	params.append(item,add_data[item])
                }

				this.$ajax.post("/user/register",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("添加用户成功")
                    	this.close_add_info()
                    	this.get_init_data()
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }else{
                    	this.error_info(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_delete:function( delete_data ){
				var params = new URLSearchParams()

                params.append("userIds",delete_data)

				this.$ajax.post("/user/delete",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info('删除成功')
	                    this.get_init_data(this.save_search_data)
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }else{
                    	this.error_info(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_update:function( update_date ){
				var params = new URLSearchParams()
                for( let item in update_date ){
                	params.append(item,update_date[item])
                }

				this.$ajax.post("/user/update",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("修改用户信息成功")
                    	this.close_add_info()
                    	this.get_init_data()
                    }else if( res.data.status === 1 ){
	                    this.error_info('请求失败 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 2 ){
	                    this.error_info('参数错误 ' + res.msg)
                    	return ;
                    }else if( res.data.status === 10 ){
	                    this.error_info('请先登录')
                    	return ;
                    }else{
                    	this.error_info(res.data.status,res.data.msg)
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
		}
	}
	
</script>

<style scoped>
	@import "../css/historyface.css";
</style>