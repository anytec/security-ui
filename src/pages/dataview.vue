<template>
    <!--html,不用head和body-->
    <div class="dataview_main_box">
        <div class="top_information">
            <div class="index_topbox">
                <div class="index_time" >{{show_date}}</div>
                <div class="index_snap index_snap1">抓拍    <span>95631</span>   次</div>
                <div class="index_snap">报警    <span>5</span>   次</div>
                <div class="index_personnel">底库人员总量    <span>1000000</span>   张</div>
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
                    <div class="index_btn" @click="test">数据生成</div>
                    <div class="index_btn" @click="is_show_info = true">设备选择</div>
                </div>
            </div>
            <div class="chart">
                <div class="view_box">
                    <div class="item one" @click="clickChart('1')" style="transform: translate(-26%,-26%) scale(0.48)">
                        <v-line :dayTime="day_time" :showData="showData_hour" :fname="name" :flag="update_flag"></v-line>
                    </div>
                    <div class="item two" @click="clickChart('2')" style="transform: translate(-26%,26%) scale(0.48)">
                        <v-pie :dayTime="day_time" :showData="showData_day" :fname="name" :flag="update_flag"></v-pie>
                    </div>
                    <div class="item three active" @click="clickChart('3')" style="transform: translate(50%,0%) scale(1)">
                        <v-bar :dayTime="day_time" :showData="showData_day" :fname="name" :flag="update_flag"></v-bar>
                    </div>
                </div>
            </div>
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
    import line from "./dataview/line"
    import pie from "./dataview/pie"
    import bar from "./dataview/bar"
    
    export default {
        components:{
            'v-line': line,
            'v-pie' : pie,
            'v-bar' : bar,
        },
        data() {
                return {
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
                    

                    // 数据传递
                    // chooseDay: null,
                    // name: ['设备1','设备2','设备3','设备4','设备5'],
                    // showData_hour:[
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    //     [
                    //         [10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50],
                    //         [15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40],
                    //         [5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60],
                    //         [25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30],
                    //         [5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
                    //     ],
                    // ],
                    // day_time: ['08-10','08-11','08-12','08-13','08-14','08-15','08-16'],
                    // showData_day:[
                    //     [10, 20, 100, 50, 20, 120, 135],
                    //     [15, 25, 110, 60, 10, 100, 155],
                    //     [5, 15, 120, 50, 15, 130, 105],
                    //     [25, 35, 100, 50, 25, 150,10],
                    //     [5, 25, 120, 40, 20, 100,50]
                    // ],
                    name: [],
                    day_time: [],
                    showData_hour: [],
                    showData_day: [],
                    // 更改标志
                    update_flag: false,
                }
            },
            mounted() {
                // this.chooseDay = this.day_time[0]
                this._myinit()

                this.get_init_data()
                this.post_to_change_page( {} )

                setInterval(() => {
                    this.show_date = this.real_time()
                }, 1000);
            },
            methods: {
                test:function(){
                    // console.log("hah")
                    this.day_time = ['08-11','08-12','08-13','08-14','08-15','08-16','08-17']
                },

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
                        search_data.cameraSdkIds.join(",")
                        // console.log(search_data)
                        this.post_to_change_page( search_data )
                    }else{
                        let search_data = {
                            cameraGroupIds: [],
                        }
                        for( let i = 0; i < this.info_search_data_group.length; i++ ){
                            search_data.cameraGroupIds.push(this.info_search_data_group[i].sdkId)
                        }
                        search_data.cameraGroupIds.join(",")
                        // console.log(search_data)
                        this.post_to_change_page( search_data )
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
                post_to_change_page:function( search_data ){
                    var params = new URLSearchParams()

                    for( let item in search_data ){
                        params.append(item,search_data[item])
                    }

                    this.$ajax.post("/data/getPersonCount",params).then((res) => {
                        if( res.data.status === 0){
                            this.clear_show_data()
                            let all_show_data = {}
                            for( let item_day in res.data.data ){
                                this.day_time.push(item_day)
                                let temp_data = []
                                for( let camera_num = 0; camera_num < res.data.data[item_day].length; camera_num++){
                                    if( item_day === this.day_time[0] ){
                                        for( let item_camera in res.data.data[item_day][camera_num]){
                                            this.name.push( item_camera )
                                        }
                                    }
                                    for( let item_camera in res.data.data[item_day][camera_num] ){
                                        temp_data.push(res.data.data[item_day][camera_num][item_camera])
                                    }
                                    
                                }
                                all_show_data[item_day] = temp_data
                            }
                            // console.log(all_show_data)

                            // 排序
                            this.day_time.sort()
                            if( this.showData_day.length < this.name.length ){
                                for( let num = 0; num < this.name.length; num++ ){
                                    this.showData_day.push([])
                                }
                                for( let num = 0; num <  this.day_time.length; num++ ){
                                    this.showData_hour.push([])
                                }
                            }
                            for( let i = 0; i < this.day_time.length; i++ ){
                                let temp_data = all_show_data[this.day_time[i]]
                                for( let j = 0; j < this.name.length; j++ ){
                                    this.showData_day[j].push(temp_data[j].pop())
                                    this.showData_hour[i].push(temp_data[j])
                                }
                            }

                            this.update_flag = !this.update_flag
                            this.clear_search_data()
                            // console.log(this.showData_day)
                            // console.log(this.showData_hour)
                            // console.log(this.day_time)
                            // console.log(this.name)
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
                clear_search_data:function(){
                    this.info_search_data = []
                    this.is_show_info = false
                },
                clear_show_data:function(){
                    this.name = []
                    this.day_time = []
                    this.showData_hour = []
                    this.showData_day = []
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
                warning_info:function(mes){
                    this.$message({
                        message: mes,
                        type: 'warning',
                        showClose: true,
                        center: true
                    });
                },

                // 图表切换动态效果
                _myinit() {
                    this.items = document.querySelectorAll('.view_box .item')
                    for (let i = 0; i < this.items.length; i++) {
                        this.items[i].dataset.order = i + 1;
                    }
                },
                clickChart(clickIndex) {
                    let activeItem = document.querySelector('.view_box .active')
                    let activeIndex = activeItem.dataset.order
                    let clickItem = this.items[clickIndex - 1]
                    if (activeIndex === clickIndex) {
                        return
                    }
                    activeItem.classList.remove('active')
                    clickItem.classList.add('active')
                    this._setStyle(clickItem, activeItem)
                },
                _setStyle(el1, el2) {
                    let transform1 = el1.style.transform
                    let transform2 = el2.style.transform
                    el1.style.transform = transform2
                    el2.style.transform = transform1
                }
            },
            watch:{
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
    .view_box{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .item{
        padding: 0px;
        margin: 0px;
        position: absolute;
        width: 66.6%;
        height: 100%;
        transform: scale(0.48);
        transition: all 0.8s;
    }
    .one{
        /*background: rgba(255,0,255,0.5);*/
    }
    .two{
        /*background: rgba(255,0,0,0.5);*/
    }
    .three{
        /*background: rgba(0,255,0,0.5);*/
    }
    .active{
        height: 100%;
        width: 66.6%;
    }
</style>