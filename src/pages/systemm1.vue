<template>
	<div style="width:100%;height:100%;" @click="click_to_close_tip">
		<div class="syslist_box1">
            <div class="mask_box">
                <div class="top_title">
                    <div class="sys_lefttext">用户列表</div>
                    <div class="sys_addicon" @click="AddPerson" title="添加用户">
                    	<img :src="sys_imgsrc" @mouseover="sys_imgsrc=sys_imgsrc2" @mouseout="sys_imgsrc=sys_imgsrc1"/>
                    </div>
                    <div class="sys_input" @keyup.enter="keyup_to_search">
                        <input type="text" placeholder="搜索用户名" v-model="search_name"/>
                        <div class="sysSearch_box" @click="click_to_search">
                            <img :src="alert_src" @mouseover="alert_src=ale_imgsrc2" @mouseout="alert_src=ale_imgsrc1"/>
                        </div>
                    </div>
                </div>
                <div class="systable_box">
                    <div class="table_thbox systable_thbox">
                        <table :style="{'width': tabledata_style}">
                            <tr>
                                <td class="td td20">用户名</td>
                                <td class="td td20">ID</td>
                                <td class="td td20">权限</td>
                                <td class="td td20">备注</td>
                                <td class="td td20">设置</td>
                            </tr>
                        </table>
                    </div>
                    <div class="table_thbox2 systable_thbox2" ref="table_f">
                        <table id="tabledata" ref="table_c">
                            <tr class="tr" v-for="item,index in tabledata">
                                <td class="td td20">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.uname}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td20">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.id}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td20">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.role}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td20">
                                    <div class="table_text">
                                        <div class="cell_text">
                                            {{item.notes}}
                                        </div>
                                    </div>
                                </td>
                                <td class="td td20">
                                    <div class="icon_fa">
                                    	<div class="td_icon2 systd_icon2 icon2" @click="click_to_update_person(item.id,index)" title="修改用户信息"></div>
	                                    <div class="td_icon2 systd_icon2 icon_trash" 
	                                    	 title="管理员信息不可删除"
	                                    	 v-if="item.role === '管理员' "
	                                    	 style="cursor: not-allowed;">
	                                    </div>
	                                    <div class="td_icon2 systd_icon2 icon_trash" 
	                                    	 @click="click_to_delete_person(index)" 
	                                    	 title="删除用户信息"
	                                    	 v-if="item.role != '管理员' "
	                                    	 >
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
                    	<div class="sysleft_text">账号：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.account" @focus="focus_to_show(62,154,'account')" @click.stop/></div>
                        <div class="sysleft_text">密码：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.upass" @focus="focus_to_show(62,424,'upass')" @click.stop/></div>
                    </div>
                    <!-- <div class="sys_maxbox">
                        <div class="sysleft_text">账号：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.account" /></div>
                    </div> -->
                    <div class="sys_maxbox">
                    	<div class="sysleft_text">用户名：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.uname" @focus="focus_to_show(113,154,'uname')" @click.stop/></div>
                    </div>
                    <div class="sys_maxbox">
                        <div class="sysleft_text">备注：</div>
                        <div class="sysleft_input sysleft_input2"><input type="text" v-model="showData.notes" @focus="focus_to_show(165,154,'notes')" @click.stop/></div>
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
        <div class="sysadd_user" v-show="is_click_to_set" style="height:180px">
            <div class="systitle_user">
                <div class="systitle_text">编辑用户</div>
                <div class="sysconter_box">
                    <div class="sys_maxbox">
                        <div class="sysleft_text">用户名：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.uname" @focus="focus_to_show(62,154,'uname')" @click.stop/></div>
                        <div class="sysleft_text">密码：</div>
                        <div class="sysleft_input"><input type="text" v-model="showData.upass" @focus="focus_to_show(62,424,'upass')" @click.stop/></div>
                    </div>
                    <div class="sys_maxbox">
                        <div class="sysleft_text">备注：</div>
                        <div class="sysleft_input sysleft_input2"><input type="text" v-model="showData.notes" @focus="focus_to_show(112,154,'notes')" @click.stop/></div>
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
				showData:{
					account: "",
					uname: "",
					upass: "",
					notes: "",
				},
				// 添加用户
				is_click_to_add: false,

				// 设置用户
				is_click_to_set: false,

				// 滚动条
				tabledata_style: '100%',

				// 输入框提示
				is_show_tip: false,
				tip_top: 0,
				tip_left: 0,
				shape_text: [],
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

			// // 输入-校验
   //          check_input:function(input_data,model=""){
   //              let reg = /^.{4,20}$/
   //              if( model === "account" ){
   //              	reg = /^[a-zA-Z0-9_]{4,20}$/
   //              }else if( model === "notes" ){
			// 		reg = /^[\u4e00-\u9fa5]{0,20}$/
			// 	}else if( model === "search" ){
			// 		reg = /^.{0,20}$/
			// 	}
   //              return reg.test(input_data)
   //          },
            // 输入-正则化
			check_input:function(input_data,model=""){
				let reg = /^.{0,20}$/

				if( model === "account" ){
					reg = /^[0-9a-zA-Z]{6,20}$/
				}else if( model === "upass"){
					reg = /^.{4,20}$/
				}
                return reg.test(input_data)
			},
			// 输入框聚焦
			focus_to_show:function(tip_top,tip_left,model=""){
				this.tip_top = tip_top
				this.tip_left = tip_left
				if( model === "uname" ){
					this.shape_text = ["不超过20个字符"]
				}else if( model === "account" ){
					this.shape_text = ["长度：6~20个字符","可输入数字、字母"]
				}else if( model === "upass" ){
					this.shape_text = ["长度：4~20个字符"]
				}else{
					this.shape_text = ["不超过20个字符"]
				}
				
				if( this.shape_text.length ){
					this.is_show_tip = true
				}
			},
			click_to_close_tip:function(event){
				this.is_show_tip = false
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

				if( this.showData.account === ""){
					this.warning_info("账号不能为空")
					return ;
				}else if( this.showData.uname === "" ){
					this.warning_info("用户名不能为空")
					return ;
				}else if( this.showData.upass === ""){
					this.warning_info("密码不能为空")
					return ;
				}

				if( !this.check_input(this.showData.account,"account") ){
					this.warning_info("账号格式不正确")
					return ;
				}else if(!this.check_input(this.showData.notes,"notes")){
					this.warning_info("备注格式不正确")
					return ;
				}else if(!this.check_input(this.showData.uname,"uname")){
					this.warning_info("用户名格式不正确")
					return ;
				}else if(!this.check_input(this.showData.upass,"upass")){
					this.warning_info("密码格式不正确")
					return ;
				}


				this.require_add_person(this.showData)
				
			},
			close_add_info:function(){
				this.showData = {
					account: "",
					uname: "",
					upass: "",
					notes: "",
				}
				this.is_click_to_add = false
				this.is_click_to_set = false
			},
			// 修改事件
			click_to_update_person:function(id,index){
				this.require_get_change_person(id,index)
			},
			confirm_set_data:function(){
				if(!this.check_input(this.showData.notes,"notes")){
					this.warning_info("备注格式不正确")
					return ;
				}else if(!this.check_input(this.showData.uname,"uname")){
					this.warning_info("用户名格式不正确")
					return ;
				}else if(!this.check_input(this.showData.upass,"upass")){
					this.warning_info("密码格式不正确")
					return ;
				}

				let update_date = {}
				let items = ["uname","upass","notes"]
				let flag = false
				for( let i = 0; i < items.length; i++ ){
					if( this.showData[items[i]] != this.tabledata[this.showData.uuid][items[i]] ){
						update_date[items[i]] = this.showData[items[i]]
						flag = true
					}
				}

				if( !flag ){
					this.warning_info("用户信息未更改")
					return ;
				}

				update_date.id = this.showData.id
				this.require_to_update( update_date )

				this.is_click_to_set = false
			},
			// 搜素事件
			click_to_search:function(){
				// if(!this.check_input(this.search_name,"search")){
				// 	this.warning_info("用户名格式不正确")
				// 	return ;
				// }

				this.isallchecked = false
				this.init_data.pageNum = 1
				this.save_search_data = this.search_name
				this.get_init_data( {keyword:this.search_name} )
			},
			// 删除事件
			click_to_delete_person:function(index){
				this.$confirm('是否删除该用户及用户数据？','提示',{
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
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				// this.save_search_data = this.search_name
				// this.get_init_data({keyword:this.search_name})
				this.click_to_search()
			},

			// 请求
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
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
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
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
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
                    if( item === "upass" ){
                        params.append(item,  this.$md5(add_data[item]).toUpperCase() )
                    }else{
                        params.append(item,add_data[item])
                    }
                }

				this.$ajax.post("/user/register",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("添加用户成功")
                    	this.close_add_info()
                    	this.get_init_data()
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

                params.append("userIds",delete_data)

				this.$ajax.post("/user/delete",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info('删除成功')
	                    this.get_init_data(this.save_search_data)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
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
                    if( item === "upass" ){
                        params.append(item, this.$md5(update_date[item]).toUpperCase() )
                    }else{
                        params.append(item,update_date[item])
                    }
                }

				this.$ajax.post("/user/update",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("修改用户信息成功")
                    	this.close_add_info()
                    	this.get_init_data()
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
		},
		mounted(){
			this.get_init_data()
		},
		watch:{
			'search_name':function(newval,old){
				if( newval === "" ){
					this.click_to_search()
				}
			},
			'tabledata':function(newval,old){
			    // this.$nextTick(function(){
			    //     let table_height = this.$refs.table_c.offsetHeight
			    //     let box_height = this.$refs.table_f.offsetHeight
			    //     if( table_height > box_height ){
			    //     	this.tabledata_style = 'calc(100% - 20px)'
			    //     }else{
			    //     	this.tabledata_style = '100%'
			    //     }
			    // });
			    
			    // 全局函数-获取是否出现滚动条
			    this.get_scroll()
			},
		},
	}
	
</script>

<style scoped>
	@import "../css/historyface.css";
</style>
