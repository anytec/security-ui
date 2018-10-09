<template>
	<!--html,不用head和body-->
	<div style="width:100%;height:100%" @click="click_to_close_tip">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<!-- <div>
						<audio src="/static/music/test1.mp3" autoplay="autoplay">
						您的浏览器不支持 audio 标签。
						</audio>
					</div> -->
					<div class="title_lefttext">底库配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box" @keyup.enter="keyup_to_search">
					<div class="export_btn" @click="click_to_add_info">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
						<input class="center_input bottom_name" v-model="search_data.groupName" type="text" placeholder="底库名称(最长20个字符)" maxlength="20"/>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table :style="{'width': tabledata_style}">
							<tr>
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td16">底库名称</td>
								<td class="td td16">人员数量</td>
								<td class="td td18">标记颜色</td>
								<td class="td td18">备注</td>
								<td class="td td10">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2" ref="table_f">
						<table id="tabledata" ref="table_c">
							<tr class="tr" v-for="item in tabledata">
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)"/>
								</td>
								<td class="td td16">
									<div class="table_text">
										<div class="cell_text">
											{{item.name}}
										</div>
									</div>
								</td>
								<td class="td td16">
									<div class="table_text">
										<div class="cell_text">
											{{item.totalNumber}}
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											<div class="tag_color" :style="{'background-color': item.colorLabel}"></div>
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
								<td class="td td10">
									<div class="td_icon">
										<div class="m_icon icon5" @click="skip_to_mmanage2(item.uuid)" title="跳转到底库人员"></div>
										<div class="m_icon icon6" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"></div>
										<div class="m_icon icon2" @click="click_to_change_persongroup(item)" title="修改底库信息"></div>
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
		<div class="mack_box" v-show="is_request2add" @click="is_request2add = false"></div>
		<!--弹出框-新建人员库-->
		<div class="bounced_add mm1_bounced" v-show="is_request2add">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">新建底库</div>
				</div>
				<!--<div class="mm1_addbox1">
					<div class="addbox1_text">标记色设置</div>
					<input class="mm1_inputname" 
						type="text" 
						v-model="add_data.name"
						@focus="focus_to_show(-127,429,'name')"
						@click.stop/>
					<span>底库名称：</span>
				</div>
				<div class="mm1_addbox2">
					<div class="left_colordiv">
						<div class="color_box1">
							<el-color-picker 
								v-model="add_data.colorLabel"
								:predefine="predefineColors">
							</el-color-picker>
						</div>
					</div>
					<div class="mm1_bottomlist">
						<select>
							<option value="">标准报警</option>
							<option value="">汽笛</option>
							<option value="">歇斯底里</option>
							<option value="">喇叭</option>
							<option value="">唢呐</option>
						</select>
					</div>
					<div class="right_btndiv">
						<div class="mmbtn_box mm1_btn" @click="request_add_persongroup" v-show="is_confirm_show">新建底库</div>
						<div class="mmbtn_box mm1_btn left_mmbox" v-show="!is_confirm_show">新建底库</div>
						<div class="mmbtn_box left_mmbox mm1_btn" @click="close_add_persongroup">暂不添加</div>
					</div>
				</div>-->
				<!--20180928修改 start-->
				<div class="mm1_alertbox">
					<div class="alert_leftbox">
						<div class="ale_toptext">标记颜色</div>
						<div class="ale_colorbox">
							<div class="ale_color">
								<el-color-picker 
									v-model="add_data.colorLabel"
									:predefine="predefineColors">
								</el-color-picker>
							</div>
						</div>
					</div>
					<div class="alert_middlebox">
						<div class="ale_toptext">报警声音</div>
						<div class="ale_selectbox">
							<div class="mm1_bottomlist">
                                <audio v-if="is_request2add && add_data.voiceLabel" :src="'/static/music/'+ add_data.voiceLabel +'.mp3'" autoplay="autoplay" >
                                    您的浏览器不支持 audio 标签。
                                </audio>
								<select v-model="add_data.voiceLabel">
									<option v-for="voice in voiceList">{{ voice }}</option>
								</select>
							</div>
						</div>
					</div>
					<div class="alert_rightbox">
						<div class="ale_toptext">
							<input class="mm1_inputname" 
							type="text" 
							v-model="add_data.name"
							@focus="focus_to_show(-127,429,'name')"
							@click.stop/>
							<span>底库名称：</span>
						</div>
						<div class="ale_selectbox">
							<div class="mmbtn_box mm1_btn ale_btn" @click="request_add_persongroup" v-show="is_confirm_show">新建底库</div>
							<div class="mmbtn_box mm1_btn left_mmbox ale_btn" v-show="!is_confirm_show">新建底库</div>
							<div class="mmbtn_box left_mmbox mm1_btn ale_btn" @click="close_add_persongroup">暂不添加</div>
						</div>
					</div>
				</div>
				<!--20180928修改 end-->
				<div class="mmbottom_input">
					<input type="text" 
						placeholder="附加备注信息" 
						v-model="add_data.remarks"
						@focus="focus_to_show(-30,18,'remarks')"
						@click.stop/>
				</div>
			</div>

		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2change" @click="is_request2change = false; is_show_tip = false"></div>
		<!--弹出框-编辑设备组信息-->
		<div class="bounced_add mm1_bounced" v-show="is_request2change" @click="click_to_close_tip">
		    <div class="bounced_minbox">
				<div class="bounced_box">
					<div class="bounced_top">
						<div class="bounced_title">编辑底库信息</div>
					</div>
                    <div class="mm1_alertbox">
                        <div class="alert_leftbox">
                            <div class="ale_toptext">标记颜色</div>
                            <div class="ale_colorbox">
                                <div class="ale_color">
                                    <el-color-picker
                                        v-model="change_data.colorLabel"
                                        :predefine="predefineColors">
                                    </el-color-picker>
                                </div>
                            </div>
                        </div>
                        <div class="alert_middlebox">
                            <div class="ale_toptext">报警声音</div>
                            <div class="ale_selectbox">
                                <div class="mm1_bottomlist">
                                    <audio v-if="is_request2change && change_data.voiceLabel" :src="'/static/music/'+ change_data.voiceLabel +'.mp3'" autoplay="autoplay">
                                        您的浏览器不支持 audio 标签。
                                    </audio>
                                    <select v-model="change_data.voiceLabel">
                                        <option v-for="voice in voiceList">{{ voice }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="alert_rightbox">
                            <div class="ale_toptext">
                                <input class="mm1_inputname"
                                       type="text"
                                       v-model="change_data.name"
                                       @focus="focus_to_show(-127,429,'name')"
                                       @click.stop/>
                                <span>底库名称：</span>
                            </div>
                            <div class="ale_selectbox">
                                <div class="mmbtn_box mm1_btn ale_btn" @click="request_change_persongroup" v-show="is_confirm_show">确认修改</div>
                                <div class="mmbtn_box mm1_btn left_mmbox ale_btn" v-show="!is_confirm_show">确认修改</div>
                                <div class="mmbtn_box left_mmbox mm1_btn ale_btn" @click="close_change_persongroup">暂不修改</div>
                            </div>
                        </div>
                    </div>
					<div class="mmbottom_input">
						<input type="text"
							placeholder="附加备注信息"
							v-model="change_data.remarks"
							@focus="focus_to_show(-30,18)"
							@click.stop/>
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
				init_data:{
					pageNum: 1,
					pageSize: 10,
					allnum: 50,
				},
				// 搜索数据
				search_data:{
					groupName: ""
				},
				save_search_data:{

				},
				delete_data:[],
                voiceList: [],
				add_data:{
					name: "",
					remarks: "",
					colorLabel: "#ff2f60",
                    voiceLabel: null,
				},
				change_data:{
				},

				// 显示数据
				tabledata: null,
				
				isallchecked: false,

				// 添加底库弹窗
				is_request2add: false,
				is_request2change: false,
				is_confirm_show: true,
				box_color:[
					{
						uuid: 0,
						color: "#ff2f60",
						border: "3px solid white",
						margin_top: "-3px",
						shadow:"",
						is_choose: true,
					},{
						uuid: 1,
						color: "#ffdd23",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},{
						uuid: 2,
						color: "#3cafff",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},{
						uuid: 3,
						color: "#1bde5b",
						border: "none",
						margin_top: "0px",
						shadow:"",
						is_choose:false,
					},
				],
				predefineColors: ["#ff2f60","#ffdd23","#3cafff","#1bde5b"],

				// 输入框提示
				is_show_tip: false,
				tip_top: 0,
				tip_left: 0,
				shape_text: [],

				// 滚动条
				tabledata_style: "width:100%",
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
				// console.log(val);
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
			},

			// 输入-正则化
			check_input:function(input_data,model=""){
				let reg = /^.{0,20}$/
				if( model === "name" ){
					reg = /^[\u4e00-\u9fa50-9a-zA-Z\_]{0,20}$/
				}
                return reg.test(input_data)
			},
			// 输入框聚焦
			focus_to_show:function(tip_top,tip_left,model=""){
				this.tip_top = tip_top
				this.tip_left = tip_left
				if( model === "name" ){
					this.shape_text = ["不超过20个字符","可输入中文、数字、字母、下划线"]
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
				// console.log(num)
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
				// if( !this.check_input(search_data.groupName) ){
				// 	this.warning_info( "底库名称超过20个字或不符合限制" )
				// }
				this.isallchecked = false
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},
			// 添加删除事件
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
				}else{
					this.warning_info("请选择删除项")
				}
			},
			// 添加事件
			clear_data:function(){
				for( let i = 0; i < this.box_color.length; i++){
					if( i === 0 ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
				this.add_data = {
					name: "",
					remarks: "",
					colorLabel: "#ff2f60"
				}
				this.change_data = {}
				this.is_request2add = false
				this.is_request2change = false
				this.is_confirm_show = true
			},
			click_to_add_info:function(){
				// 弹窗添加
                this.add_data.voiceLabel = this.voiceList[0]
				this.is_request2add = true
				// this.add_data.colorLabel = "#ff2f60"
			},
			// 添加事件-弹窗事件
			request_add_persongroup:function(){
				if( !this.check_input(this.add_data.name,"name") ){
					this.warning_info( "底库名称格式不正确" )
					return ;
				}else if( !this.check_input(this.add_data.remarks,"remarks") ){
					this.warning_info( "备注格式不正确" )
					return ;
				}

				this.is_confirm_show = false
				this.require_to_add_group(this.add_data)
				// this.clear_data()
			},
			close_add_persongroup:function(){
				// this.is_request2add = false
				this.clear_data()
			},
			// 添加事件-颜色选择
			choose_color:function(num,model){
				for( let i = 0; i < this.box_color.length; i++){
					if( i === num ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
						if( model === "add" ){
							this.add_data.colorLabel = this.box_color[i].color
						}else if( model === "change" ){
							this.change_data.colorLabel = this.box_color[i].color
						}
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
			},
			mouseover_event:function(num){
				if( !this.box_color[num].is_choose ){
					this.box_color[num].border = "1px solid white"
					this.box_color[num].shadow = "0px 0px 15px white"
				}
			},
			mouseout_event:function(num){
				if( !this.box_color[num].is_choose ){
					this.box_color[num].border = ""
				}
				this.box_color[num].shadow = ""
			},
			// 修改事件
			click_to_change_persongroup:function(change_data){
				this.change_data = JSON.parse(JSON.stringify(change_data))
				for( let i = 0; i < this.box_color.length; i++){
					if( this.box_color[i].color === change_data.colorLabel ){
						this.box_color[i].border = "3px solid white"
						this.box_color[i].margin_top = "-3px"
						this.box_color[i].is_choose = true
					}else{
						this.box_color[i].border = "none"
						this.box_color[i].margin_top = "0px"
						this.box_color[i].is_choose = false
					}
				}
				// this.tip_top = 87
				this.is_request2change = true
			},
			// 修改事件-弹窗事件
			request_change_persongroup:function(){
				if( !this.check_input(this.change_data.name,"name") ){
					this.warning_info( "底库名称格式不正确" )
					return ;
				}else if( !this.check_input(this.change_data.remarks,"remarks") ){
					this.warning_info( "备注格式不正确" )
					return ;
				}

				if( this.change_data.colorLabel === this.tabledata[this.change_data.uuid].colorLabel &&
                    this.change_data.voiceLabel === this.tabledata[this.change_data.uuid].voiceLabel &&
					this.change_data.name === this.tabledata[this.change_data.uuid].name &&
					this.change_data.remarks === this.tabledata[this.change_data.uuid].remarks ){
					this.error_info("信息未更改")
				}else{
					this.is_confirm_show = false
					this.require_to_change_group(this.change_data)
				}
				// this.clear_data()
			},
			close_change_persongroup:function(){
				this.clear_data()
			},
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				// this.save_search_data = this.search_data
				// this.post_to_change_page(this.search_data)
				this.click_to_search(this.search_data)
			},

			// 页面跳转
			skip_to_mmanage2:function(num){
				this.$store.state.search_data.groupName = this.tabledata[num].name
				this.$store.state.search_data.groupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/mmanage2')
			},
			skip_to_historyface1:function(num){
				this.$store.state.search_data.personGroupName = this.tabledata[num].name
				this.$store.state.search_data.personGroupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			click_to_change_gallery:function(num){
				// 弹窗修改
				console.log("点击")
			},

			// 请求数据
            // 请求报警声音
            init_confidence:function(){
                var params = new URLSearchParams()
                this.$ajax.post("/getWarningVoice",params).then((res) => {
                    if( res.data.status === 0){
                        this.voiceList = res.data.data
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
            },
			get_init_data:function(){
				// 请求库名
				var params = new URLSearchParams()
				this.$ajax.post("/groupPerson/list",params).then((res) => {
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
			post_to_change_page:function(search_data){
				// console.log(this.search_data)
                var params = new URLSearchParams()
                if( search_data.groupName ){
                	params.append("groupName",search_data.groupName) // 搜索底库名,最好可模糊搜索,不一有
                }

                params.append("pageNum",this.init_data.pageNum) // 请求页数
                params.append("pageSize",this.init_data.pageSize) // 请求每页数量
				this.$ajax.post("/groupPerson/list",params).then((res) => {
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
                params.append("groupPersonIds",delete_data) // 删除列表id数组
				this.$ajax.post("/groupPerson/delete",params).then((res) => {
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
			require_to_add_group:function( add_data ){
				var params = new URLSearchParams()
                
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.is_confirm_show = true
            		this.warning_info("请添加库名")
                    return ;
            	}
            	if( add_data.colorLabel ){
            		params.append( "colorLabel", add_data.colorLabel )
            	}else{
            		this.is_confirm_show = true
            		this.warning_info("请选择底库颜色")
            		return ;
            	}

                if( add_data.voiceLabel ){
                    params.append( "voiceLabel", add_data.voiceLabel )
                }else{
                    this.is_confirm_show = true
                    this.warning_info("请选择报警声音")
                    return ;
                }
            	// params.append( "colorLabel", add_data.colorLabel )
            	params.append( "remarks", add_data.remarks)

                // 请求人员数据
                this.$ajax.post("groupPerson/add",params).then((res) => {
                    if( res.data.status === 0){
                    	this.is_request2add = false
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.clear_data()
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
			require_to_change_group:function( change_data ){
				var params = new URLSearchParams()
                // console.log(change_data)
            	if( change_data.name ){
            		params.append( "name", change_data.name )
            	}else{
            		this.warning_info("请添加库名")
            		this.is_confirm_show = true
                    return ;
            	}
            	if( change_data.colorLabel ){
            		params.append( "colorLabel", change_data.colorLabel )
            	}else{
            		this.warning_info("请选择底库颜色")
            		this.is_confirm_show = true
            		return ;
            	}
                if( change_data.voiceLabel ){
                    params.append( "voiceLabel", change_data.voiceLabel )
                }else{
                    this.warning_info("请选择报警声音")
                    this.is_confirm_show = true
                    return ;
                }
            	params.append("id", change_data.id)
            	params.append( "remarks", change_data.remarks)

				this.$ajax.post("groupPerson/update",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('信息修改成功')
	                    this.post_to_change_page(this.save_search_data)
	                    // this.tabledata.splice(change_data.uuid,1,change_data)
	                    this.clear_data()
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
            this.init_confidence()
		},
		watch:{
			'search_data.groupName':function(newval,old){
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
		}
	}
</script>

<style>
	/*.el-date-editor .el-range-input {
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
