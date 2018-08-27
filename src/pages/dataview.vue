<template>
    <!--html,不用head和body-->
    <div class="dataview_main_box">
        <div class="top_information">
            <div class="index_topbox">
                <div class="index_time" >{{show_date}}</div>
                <div class="index_snap index_snap1">抓拍    <span>{{ snapCount }}</span>   次</div>
                <div class="index_snap">报警    <span>{{ warningCount }}</span>   次</div>
                <div class="index_personnel">底库人员总量    <span>{{ person_total }}</span>   张</div>
            </div>
        </div>
        <div class="index_bottombox">
            <div class="min_nav">
                <div class="index_navbox">
                    <div class="index_nav1"   @click="change_active(0)"  @mouseenter="enter(0)" @mouseleave="leave">
                        <div class="index_text1" :class="{ 'index_active': isactive1}">
                            <div class="index_table">
                                <div class="index_cell">
                                    流量统计
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="index_nav1"  @click="change_active(1)"  @mouseenter="enter(1)" @mouseleave="leave">
                        <div class="index_text1" :class="{ 'index_active': isactive2}">
                            <div class="index_table">
                                <div class="index_cell">
                                    人群分析
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="index_nav1"  @click="change_active(2)"  @mouseenter="enter(2)" @mouseleave="leave">
                        <div class="index_text1" :class="{ 'index_active': isactive3}">
                            <div class="index_table">
                                <div class="index_cell">
                                    设备性能
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="active_div" :style="{ left: 192*listnum + 'px' }"></div>
                </div>
                <div class="index_rightbtn">
                    <div class="data_timebox" v-show="is_show_date">
                        <el-date-picker
                          v-model="dateValue"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                    <div class="index_btn" v-show="false">数据生成</div>
                    <div class="index_btn" @click="is_show_info = true" v-show="is_show_choose">设备选择</div>
                </div>
            </div>
            <transition :name="transitionName">
                <!-- <keep-alive> -->
                    <router-view :searchData="search_data" :dateValue="dateValue"></router-view>
                <!-- </keep-alive> -->
            </transition>
        </div>
        <!--弹出框-->
        <div class="alert_Box" id="alert_Box" v-show="is_show_info">
            <div class="ale_leftbox">
                <div class="ale_topinput">
                    <div class="ale_input">
                        <select v-model="choose_groupName">
                            <option v-for="item in groupNames">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="ale_input">
                        <input type="text" placeholder="输入名称、ID" v-model="cameraName"/>
                        <div class="search_box">
                            <img :src="alert_src" @mouseover="alert_src=ale_imgsrc2" @mouseout="alert_src=ale_imgsrc1"/>
                        </div>
                    </div>
                </div>
                <div class="ale_leftlist" v-if="choose_groupName!='设备组选择'">
                    <div class="ale_list"  v-for="item in info_show_data" @click="add_search_data(item,'camera')" v-show="item.isshow">{{item.name}}</div>
                </div>
                <div class="ale_leftlist" v-if="choose_groupName==='设备组选择'">
                    <div class="ale_list"  
                         v-for="item in groupNames" 
                         v-if="item.name != '设备组选择'"
                         @click="add_search_data(item,'group')"
                    >{{item.name}}</div>
                </div>
            </div>
            <div class="ale_rightbox">
                <div class="right_table">
                    <table>
                        <tr>
                            <td class="ale_td1_1">编号</td>
                            <td class="ale_td2_1">名称</td>
                            <td class="ale_td3_1">移除</td>
                        </tr>
                        <tr v-for="item,index in info_search_data" :title="item.groupName+'\n'+item.name" v-if="choose_groupName!='设备组选择'">
                            <td class="ale_td1">{{index+1}}</td>
                            <td class="ale_td2">{{item.name}}</td>
                            <td class="ale_td3">
                                <div class="ale_delete">
                                    <img  :src="table_src" 
                                          @mouseover="table_src=tableicon_src2" 
                                          @mouseout="table_src=tableicon_src1"
                                          @click="delete_search_data(index,'camera')"
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr v-for="item,index in info_search_data_group" v-if="choose_groupName==='设备组选择'">
                            <td class="ale_td1">{{index+1}}</td>
                            <td class="ale_td2">{{item.name}}</td>
                            <td class="ale_td3">
                                <div class="ale_delete">
                                    <img  :src="table_src" 
                                          @mouseover="table_src=tableicon_src2" 
                                          @mouseout="table_src=tableicon_src1"
                                          @click="delete_search_data(index,'group')"
                                    />
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="cancel" @click="is_show_info = false">
                <img :src="cancel_src" @mouseover="cancel_src=cancel_src2" @mouseout="cancel_src=cancel_src1"/>
            </div>
            <div class="confirm" @click="confirm_search">
                <img :src="confirm_src" @mouseover="confirm_src=confirm_src2" @mouseout="confirm_src=confirm_src1"/>
            </div>
        </div>
    </div>
</template>

<script> 
    export default {
        data() {
                return {
                    // 页面切换
                    transitionName: '',

                    // 顶栏数据显示
                    snapCount: 0,
                    warningCount: 0,
                    person_total: 0,

                    items: [],

                    // 弹窗加切换栏
                    listnum : 0,
                    isactive1:true,
                    isactive2:false,
                    isactive3:false,
                    active_num: 0,
                    index_span1:'9513651',
                    index_span2:'5',
                    index_span3:'1000000',
                    alert_src:require('../assets/index/search.svg'),
                    ale_imgsrc1:require('../assets/index/search.svg'),
                    ale_imgsrc2:require('../assets/index/search_1.svg'),
                    table_src:require('../assets/index/delete.svg'),
                    tableicon_src1:require('../assets/index/delete.svg'),
                    tableicon_src2:require('../assets/index/delete_1.svg'),
                    cancel_src:require('../assets/index/cancel.svg'),
                    cancel_src1:require('../assets/index/cancel.svg'),
                    cancel_src2:require('../assets/index/cancel_1.svg'),
                    confirm_src:require('../assets/index/refresh_icon.svg'),
                    confirm_src1:require('../assets/index/refresh_icon.svg'),
                    confirm_src2:require('../assets/index/refresh_icon_1.svg'),
                    is_show_info: false,
                    is_show_date: false,
                    is_show_choose: true,

                    // 弹窗
                    cameraName: "",
                    choose_groupName: null,
                    info_show_data: [],
                    info_search_data: [],
                    info_search_data_group: [],

                    // 预警栏
                    show_date : null,

                    // 请求
                    groupNames: [],
                    video_names: [],
                    cameraSdkIds: "",
                    cameraGroupIds: "",
                    dateValue: [(new Date() - 3600 * 1000 * 24 * 1),new Date()-1],
                    pickerOptions: {
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

                    // 子组件传递参数
                    search_data: {},
                    
                    name: [],
                    day_time: [],
                    showData_hour: [],
                    showData_day: [],
                    // 更改标志
                    update_flag: false,

                    // 定时器
                    timer_num: null,
                }
            },
            mounted() {
                this.get_snapCounting()
                this.get_mmanage_people_num()
                this.timer_num = setInterval(() => {
                    this.show_date = this.real_time()
                    this.get_snapCounting()
                }, 1000);
                // setInterval(() => {
                //     this.get_mmanage_people_num()
                // }, 10000);

                this.get_init_data()
                this.search_data = {}

                this.change_mynav_active()
            },
            methods: {
                // test:function(){
                //     // console.log("hah")
                //     this.day_time = ['08-11','08-12','08-13','08-14','08-15','08-16','08-17']
                // },

                real_time:function(){
                    let date = new Date();
                    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日    ' + date.getHours() + '点' + date.getMinutes() + '分' + date.getSeconds() + '秒';
                },

                // 弹窗加切换栏
                change_active:function(num){
                    for(let i = 1; i < 4; i++){
                        this["isactive"+i] = false//清除所有此导航栏名为“isactive”的Class
                        if ( i === num + 1){
                            this["isactive"+i] = true//为当前div添加Class"isactive"
                            this.listnum = num //将参数num赋值给listnum
                            this.active_num=num //保存点击选中的num值
                        }
                    }

                    if( num === 0 ){
                        this.$router.push('/dataview1')
                    }else if( num === 1 ){
                        this.$router.push('/dataview2')
                    }else if( num === 2 ){
                        this.$router.push('/dataview3')
                    }
                },
                enter:function(num){//鼠标移入时调用该函数
                    this.listnum = num //鼠标移入时给listnum重新赋值
                },
                leave:function(){//鼠标移出时调用该函数
                    this.listnum = this.active_num //鼠标移出时恢复之前点击选中的num值
                },

                // 弹窗
                // 修改设备组，显示数据变更
                change_show_data:function(num){
                    this.info_show_data = []
                    for( let i = 0; i < this.video_names[num].length; i++ ){
                        this.video_names[num][i].isshow = true
                        this.info_show_data.splice(-1,0,this.video_names[num][i])
                    }
                    // console.log(this.info_show_data)
                },
                add_search_data:function(data,model){
                    if( model === "camera" ){
                        if( this.info_search_data.length < 5 ){
                            // 判断是否已选择设备
                            for( let i = 0; i < this.info_search_data.length; i++ ){
                                if( data.sdkId === this.info_search_data[i].sdkId ){
                                    this.warning_info("选择设备已在列表中")
                                    return
                                }
                            }
                            
                            this.info_search_data.push( 
                                {
                                    name: data.name,
                                    sdkId: data.sdkId,
                                    groupName: data.groupName,
                                } 
                            )
                        }else{
                            this.warning_info("最多选择五个设备")
                        }
                    }else if( model === "group" ){
                        if( this.info_search_data_group.length < 5 ){
                            // 判断是否已选择设备
                            for( let i = 0; i < this.info_search_data_group.length; i++ ){
                                if( data.uuid === this.info_search_data_group[i].sdkId ){
                                    this.warning_info("选择设备组已在列表中")
                                    return
                                }
                            }
                            
                            this.info_search_data_group.push( 
                                {
                                    name: data.name,
                                    sdkId: data.uuid,
                                } 
                            )
                        }else{
                            this.warning_info("最多选择五个设备组")
                        }
                    }
                },
                // 将设备从搜索中删除
                delete_search_data:function(index,model){
                    if( model === "camera" ){
                        this.info_search_data.splice(index,1)
                    }else{
                        this.info_search_data_group.splice(index,1)
                    }
                    
                },
                // 确认请求信息
                confirm_search:function(){
                    if( this.choose_groupName != "设备组选择" ){
                        let search_data = {
                            cameraSdkIds: [],
                        }
                        for( let i = 0; i < this.info_search_data.length; i++ ){
                            search_data.cameraSdkIds.push(this.info_search_data[i].sdkId)
                        }
                        this.search_data = search_data
                    }else{
                        let search_data = {
                            cameraGroupIds: [],
                        }
                        for( let i = 0; i < this.info_search_data_group.length; i++ ){
                            search_data.cameraGroupIds.push(this.info_search_data_group[i].sdkId)
                        }
                        this.search_data = search_data
                    }
                },

                // 请求数据
                get_init_data:function(){
                    // 请求设备组列表
                    var params = new URLSearchParams()
                    this.$ajax.post("/groupCamera/getAllCameras",params).then((res) => {
                        if( res.data.status === 0){
                            for( let item in res.data.data ){
                                // console.log(item)
                                let [name,uuid] = item.split(",")
                                this.groupNames.push( {"name":name,"uuid":uuid} )
                                this.video_names.push( res.data.data[item] )
                            }
                            for( let i = 0; i < this.video_names.length; i++ ){
                                for( let j = 0; j < this.video_names[i].length; j++ ){
                                    this.video_names[i][j].uuid = j
                                }
                            }
                            this.choose_groupName = this.groupNames[0].name
                            this.groupNames.splice(0,0,{name:"设备组选择"})
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
                get_snapCounting:function(){
                    var params = new URLSearchParams()
                    this.$ajax.post("/data/snapCounting",params).then((res) => {
                        if( res.data.status === 0){
                            if( res.data.data.snapCount ){
                                this.snapCount = res.data.data.snapCount
                            }
                            if( res.data.data.warningCount ){
                                this.warningCount = res.data.data.warningCount
                            }                    
                        }else if( res.data.status === 1 ){
                            // this.error_info('请求失败 ' + res.msg)
                            return ;
                        }else if( res.data.status === 2 ){
                            // this.error_info('参数错误 ' + res.msg)
                            return ;
                        }else if( res.data.status === 10 ){
                            // this.error_info('请先登录')
                            return ;
                        }
                    }).catch((error) => {
                        console.log(error)
                        // this.error_info('网络连接出错')
                        return ;
                    })
                },
                get_mmanage_people_num:function(){
                    // 请求人员数据
                    this.$ajax.post("/person/list").then((res) => {
                        if( res.data.status === 0){
                            this.person_total = res.data.data.total
                        }else if( res.data.status === 1 ){
                            // this.error_info('请求失败 ' + res.msg)
                            return ;
                        }else if( res.data.status === 2 ){
                            // this.error_info('参数错误 ' + res.msg)
                            return ;
                        }else if( res.data.status === 10 ){
                            // this.error_info('请先登录')
                            return ;
                        }
                    }).catch((error) => {
                        console.log(error)
                        // this.error_info('网络连接出错')
                        return ;
                    })
                },
                
                // 弹窗关闭清除
                clear_search_data:function(){
                    this.info_search_data = []
                    this.is_show_info = false
                },

                // 页面跳转
                change_mynav_active:function(){
                    if( this.$route.path.indexOf("dataview1") === 1 ){
                        this["isactive"+(this.active_num+1)] = false
                        this.isactive1 = true
                        this.listnum = 0
                        this.active_num = 0
                        this.is_show_date = false
                        this.is_show_choose = true
                    }else if( this.$route.path.indexOf("dataview2") === 1 ){
                        this["isactive"+(this.active_num+1)] = false
                        this.isactive2 = true
                        this.listnum = 1
                        this.active_num = 1
                        this.is_show_date = true
                        this.is_show_choose = true
                    }else if( this.$route.path.indexOf("dataview3") === 1 ){
                        this["isactive"+(this.active_num+1)] = false
                        this.isactive3 = true
                        this.listnum = 2
                        this.active_num = 2
                        this.is_show_date = false
                        this.is_show_choose = false
                    }
                }
            },
            watch:{
                $route(to,from){
                    this.transitionName = 'slide-left';
                    this.change_mynav_active()
                },
                'choose_groupName':function(newVal,old){
                    for( let i = 1; i < this.groupNames.length; i++ ){
                        if( this.groupNames[i].name === newVal ){
                            this.change_show_data(i-1)
                        }
                    }
                },
                'cameraName':function(newVal,old){
                    for( let i = 0; i < this.info_show_data.length; i++ ){
                        if( this.info_show_data[i].name.indexOf( newVal ) === -1 ){
                            this.info_show_data[i].isshow = false
                        }else{
                            this.info_show_data[i].isshow = true
                        }
                    }
                },
                '$store.state.dataview_data.update_flag1':function(newVal,old){
                    this.clear_search_data()
                },
                '$store.state.dataview_data.update_flag2':function(newVal,old){
                    this.clear_search_data()
                },
                '$store.state.dataview_data.update_flag3':function(newVal,old){
                    this.clear_search_data()
                },
            },
            beforeRouteLeave(to, from, next){
                clearInterval(this.timer_num)
                next()
            }
    }
</script>


<style scoped>
    @import "../css/historyface.css";
    
    .dataview_main_box{
        width: 100%;
        height: 100%;
        position: absolute;
    }

    /*界面切换样式*/
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active{
        will-change: transform;
        transition: all 1000ms ease;
        /*position: absolute;*/
        /*float: left;*/
    }
    .slide-left-leave-active {
        will-change: transform;
        transition: all 1000ms ease;
        /*position: absolute;*/
        float: left;
    }
    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
        opacity: 0;
        /*-webkit-transform: translate3d(100%,0, 0);*/
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
        opacity: 0;
        /*-webkit-transform: translate3d(-100%,0, 0);*/
        transform: translate3d(-100%, 0, 0);
    }
</style>