<template>
    <div style="width:100%;height:100%">
        <div class="left_mainBox">
            <left-nav></left-nav>
            <div class="center_box">
                <div class="video_box">
                    <div class="video_top">
                        <div class="video_minbox">
                            <div class="camera_text">
                                {{ video_srcs[0].name }}
                            </div>
                            <object class="player" id="player1">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                        <div class="video_minbox" v-for="item in [2,3,4]" @mouseenter="change_choose_show(true,item)" @mouseleave="change_choose_show(false,item)">
                            <div class="camera_text">
                                {{ video_srcs[item-1].name }}
                            </div>
                            <div class="choose_box" :class="{'choose_box1':isactive[item-2],'choose_box2':!isactive[item-2]}" @click="change_video(item)">
                                  选择设备
                            </div>
                            <div class="refresh_icon" 
                                 :class="{'choose_box1':isactive[item-2],'choose_box2':!isactive[item-2]}" 
                                 @mouseover="refresh_icon = refresh_icon2" 
                                 @mouseout="refresh_icon = refresh_icon1"
                                 @click="repaly_video(item)">
                                <img :src="refresh_icon" />
                            </div>
                            <object class="player" :id="'player'+item">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                    </div>
                    <div class="information_box">
                        <div class="info_alarm">
                            <div class="info_minbox" v-for="item in alarm_showdata" :style="{'transform':'translateY('+item.move_pix+'px)','transition-duration':item.translatetime+'s'}" @click="click_to_move()">
                                <div class="re_toptitle" :style="{'background-color':item.colorLabel}">
                                    <!-- <div class="re_lefttext">{{item.personName}}  {{item.gender}}  {{item.age}}岁  {{item.personGroupName}}</div> -->
                                    <div class="re_lefttext" >{{item.personName}}  {{item.gender}}  {{item.personGroupName}}</div>
                                    <div class="icon_bg">
                                        <div class="re_lefticon_img" title="跳转到人脸检索" @click="skip_to_facepath(item.snapshotUrl)"></div>
                                    </div>
                                    <div class="re_icon">
                                        <div class="re_righticon_img" title="跳转到底库人员" @click="skip_to_mmanage2(item.personGroupName,item.personGroupId,item.faceSdkId)"></div>
                                    </div>
                                </div>
                                <div class="re_infotext">
                                    <p>{{item.cameraGroupName}}</p>
                                    <p>{{item.cameraName}}</p>
                                    <p>{{item.time_ymd}}</p>
                                    <p>{{item.time_hms}}</p>
                                </div>
                                <div class="re_photoinfo">
                                    <div class="re_photobox" >
                                        <img :src="item.snapshotUrl" style="width:100px;height:100px" @click="show_pic(item.wholePhoto)" title="点击显示原图"/>
                                        <div class="re_icontext">{{item.confidence}}%</div>
                                    </div>
                                    <div class="re_photobox" >
                                        <img :src="item.faceUrl" style="width:100px;height:100px"/>
                                        <div class="re_icontext">目标</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="re_bottombox">
                    <!-- <transition-group name="flip-list" tag="div"> -->
                    <div class="re_imgbox" @mouseenter="change_show(false)" @mouseleave="change_show(true)">
                        <div class="re_leftbox">
                            <div class="photo_box" 
                                v-for="item in show_data" 
                                :key="item.id" 
                                :style="{'transform':'translateX('+item.move_pix+'px)','transition-duration':item.translatetime+'s'}" 
                            >
                                <div class="photo_img" :title="item.cameraName">
                                    <div class="catch_message" v-show="is_trans">{{item.emotions}}</div>
                                    <div class="catch_message" v-show="!is_trans">{{item.time}}</div>
                                    <img :src="item.img" style="width:100%;height:100%" @click="show_pic(item.wholePhoto)"/>
                                </div>
                                <div class="photo_text" v-show="is_trans">
                                    <!-- <div class="new_photo_text">{{item.age}}岁    {{item.gender}}</div> -->
                                    <div class="new_photo_text">{{item.gender}}</div>
                                </div>
                                <div class="photo_text" v-show="!is_trans">
                                    <div class="small_icon" title="跳转到人脸检索" @click="skip_to_facepath(item.img)"></div>
                                    <div class="small_icon1" title="跳转到历史抓拍" @click="skip_to_historyface2(item.faceSdkId)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="re_rightbox" style="margin-left:18px">
                        <div class="data_title">数据统计</div>
                        <div class="history">查看历史</div>
                        <div class="data_box">
                            <div class="alarm">
                                <div class="alarm_text">本周报警次数</div>
                                <div class="alarm_number">{{alarm_weeknum}}</div>
                            </div><div class="alarm">
                                <div class="alarm_text">今日抓拍数量</div>
                                <div class="alarm_number">{{catch_oneday}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--遮罩层-->
        <div class="mack_box" v-show="open_flag" @click="close_info"></div>
        <!--弹框-->
        <div class="face_infobox real_faceInfobox" v-show="open_flag">
            <div class="face_title">
                <div class="snap real_snap">抓拍：{{snapCount}}</div>
                <!-- <div class="snap real_anap">报警：0</div> -->
                <div class="state state1 add_state">正常</div>
            </div>
            <div class="real_camera">
                <select class="center_select real_select" v-model="choose_groupName">
                    <option v-for="item in groupNames">{{item.name}}</option>
                </select>
                <input class="real_input" type="text" placeholder="设备名称或设备ID" v-model="cameraName"/>
            </div>
            <div class="real_conter">
                <div class="real_ConterText" v-for="item in info_show_data" @dblclick="choose_this_url(item.sdkId,item.name)" v-show="item.isshow">
                    <div class="real_text">{{ item.name }}</div>
                    <div class="face_icon1 face_icon1_img" @click="choose_this_url(item.sdkId,item.name)" title="选择该设备显示"></div>
                    <div class="face_icon2 face_icon2_img" @click="skip_to_mmanage4(item)" title="跳转到设备配置"></div>
                </div>
            </div>
            <div class="bottom_bg">
                <img src="../assets/realtimem/bottom.svg" />
            </div>
        </div>
        <!--警告-->
        <!--遮罩层-->
        <div class="mack_box" v-show="open_alarm" @click="close_info"></div>
        <div class="warning_box" v-show="open_alarm" @click="skip_to_mmanage2(alarm_new_data.personGroupName,alarm_new_data.personGroupId,alarm_new_data.faceSdkId)">
            <div class="warning_title">最新预警</div>
            <div class="warning_conter">
                <div class="left_photo">
                    <div class="real_photo1"><img style="width:100%;height:100%" :src="alarm_new_data.snapshotUrl"/></div>
                    <div class="real_photo2"><img style="width:100%;height:100%" :src="alarm_new_data.faceUrl" /></div>
                </div>
                <div class="real_similarity">
                    <div class="similarity_number">{{alarm_new_data.confidence}}%</div>
                    <div class="similarity_text" v-if="alarm_new_data.confidence > 76">非常相似</div>
                    <div class="similarity_text" v-else>比较相似</div>
                </div>
                <div class="right_information">
                    <div class="right_font">{{alarm_new_data.name}}    {{alarm_new_data.gender}}   {{alarm_new_data.age}}岁</div>
                    <div class="right_font">库：{{alarm_new_data.personGroupName}}</div>
                    <div class="right_font">{{alarm_new_data.cameraName}}</div>
                </div>
            </div>
            <div class="mark_box">
                <div class="real_mark1">抓拍人脸</div>
                <div class="real_mark2">目标人脸</div>
                <div class="real_mark3">相似度</div>
                <div class="real_mark4">具体信息</div>
            </div>
        </div>
        <!--遮罩层 原图-->
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
    import MyNav from "./mynav"
    import LeftNav from "./left_nav3"
    import Stomp from 'stompjs'
    // import 

    //js
    export default {
        data(){
            return {
                refresh_icon:require('../assets/realtimem/refresh_icon.png'),
                refresh_icon1:require('../assets/realtimem/refresh_icon.png'),
                refresh_icon2:require('../assets/realtimem/refresh_icon_1.png'),
                isactive: [false,false,false],

                default_data:{
                    img: "",
                    time: "--:--:--",
                    emotion: "",
                    age: "",
                    gender: "",
                    wholePhoto: "",
                },
                default_data1:{
                    cameraGroupName: '无',
                    cameraName: '无',
                    time_ymd: 'xx-xx-xx',
                    time_hms: '--:--:--',
                    confidence: '无',
                    name: '无',
                    gender: '无',
                    age: '无',
                    personGroupName: '无',
                    snapshotUrl: '',
                    faceUrl: '',
                    wholePhoto: "",
                },
                show_data:[],
                alarm_showdata:[],
                alarm_weeknum: 0,
                catch_oneday: 0,

                // 视频数据
                video_srcs:[
                    {
                        name: "",
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        name: "",
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        name: "",
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        name: "",
                        playAddress: "",
                        sdkId: "",
                    },
                ],
                flashvars:{
                    // src: "rtmp://live.hkstv.hk.lxdns.com/live/hks",
                    src: "",
                    streamType: "live",
                    scaleMode: "zoom", // 自动缩放
                    bufferTime: 0,
                    controlBarAutoHideTimeout: 0, // 播放隐藏工具栏
                    // controlBarAutoHide: true,
                },
                params:{
                    allowFullScreen: false,
                    allowScriptAccess: "always",
                    bgcolor: "#000000",
                },
                attrs:{
                    name:"player",
                },
                player: null,

                // 图片滚动数据
                move_pix: 0,
                // move_time: 0.5,
                // translatetime: "",
                end_id: 12,
                end_id_alarm: 5,
                is_trans: true,

                show_face_list:[],

                // sockjs
                stompClient: null,
                myID: null,
                subscribers: [],

                // 初始化请求
                default_data_alarm: null,
                default_show_data: null,

                // 弹窗
                is_choose_change: [false,false,false],
                open_flag: false,
                open_alarm:false,
                active_box_num: null,
                info_show_data:[],
                groupNames: null,
                video_names: null,
                cameraName: "",
                choose_groupName:null,
                alarm_new_data:{
                    // snapshotUrl: "http://192.168.10.208:3333/uploads//20180428/15249092470250564_norm.png",
                },
                timer_num: null,
                snapCount: 0,

                // 第一次进入页面标志
                first_flag: true,

                // 原图
                is_show_pic: false,
                total_pic: "",
            }
        },
        components: {
            MyNav,
            LeftNav
        },
        methods:{
            // test
            click_to_move:function(){
                // console.log("haha")
                // this.video_srcs[0].name = Date()
                // let temp_data = JSON.parse(JSON.stringify(this.default_data1))
                // temp_data.confidence = 100
                // this.rolling_alarm(temp_data)

                // this.alarm_new_data = JSON.parse(JSON.stringify(this.default_data1))
                // if( this.open_alarm ){
                //     clearInterval(this.timer_num)
                // }else{
                //     this.open_alarm = true
                // }
                // this.timer_num = setTimeout(() => {
                //     this.open_alarm = false
                // }, 2000)
            },
            // 底栏图片显示切换
            change_show:function(flag){
                this.is_trans = flag
            },
            // 选择设备栏切换
            change_choose_show:function(flag,num){
                // console.log(flag,num)
                // this.is_choose_change.splice(num-2,1,flag)
                this.isactive.splice(num-2,1,flag)
            },

            // 页面跳转
            skip_to_facepath:function(img){
                // 人脸轨迹
                this.$store.state.facepath_data.photo = img
                this.$store.state.is_search_data_facepath = true
                if( this.$store.state.facepath_model === "online" ){
                    this.$router.push('/facepath')
                }else{
                    this.$router.push('/facepath_offline')
                }
            },
            skip_to_mmanage2:function(personGroupName,personGroupId,faceSdkId){
                this.$store.state.search_data.groupName = personGroupName
                this.$store.state.search_data.groupId = personGroupId
                this.$store.state.search_data.faceSdkId = faceSdkId
                this.$store.state.is_search_data = true
                this.$router.push('/mmanage2')
            },
            skip_to_mmanage4(item){
                // console.log(item.sdkId)
                this.open_flag = false
                this.$store.state.search_data.groupId = item.groupName
                this.$store.state.search_data.name = item.name
                this.$store.state.is_search_data = true
                this.$router.push('/mmanage4')
            },
            skip_to_historyface2:function(faceSdkId){
                // console.log(faceSdkId)
                this.$store.state.search_data.faceSdkId = faceSdkId
                this.$store.state.is_search_data = true
                this.$router.push('/historyface2')
            },

            // 初始化播放窗口
            init_video:function(){
                for(let i = 0; i < this.video_srcs.length; i++ ){
                    // this.flashvars.src = this.video_srcs[i]
                    swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player"+(i+1), "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
                }
            },
            // 设备选择弹框
            change_video:function(num){
                // console.log(num)
                // swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player"+num, "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
                this.active_box_num = num
                this.open_flag = true
                this.snapCount = 0
                for( let i = 0; i < this.video_names.length; i++ ){
                    for( let j = 0; j < this.video_names[i].length; j++ ){
                        if( this.video_names[i][j].sdkId === this.video_srcs[num-1].sdkId ){
                            this.snapCount = this.video_names[i][j].snapCount
                        }
                    }
                }
            },
            // 弹窗-关闭弹窗
            close_info:function(){
                this.open_flag = false
                this.open_alarm = false
            },
            // 修改设备组，显示数据变更
            change_show_data:function(num){
                this.info_show_data = []
                for( let i = 0; i < this.video_names[num].length; i++ ){
                    // console.log(this.cameraName)
                    if( this.video_names[num][i].name.indexOf( this.cameraName ) === -1 ){
                        this.video_names[num][i].isshow = false
                    }else{
                        this.video_names[num][i].isshow = true
                    }
                    this.info_show_data.splice(-1,0,this.video_names[num][i])
                }
                // console.log(this.info_show_data)
            },
            // 选择设备后，获取url
            choose_this_url:function(sdkId,name){
                // console.log(sdkId,name)
                if( !sdkId || !name ){
                    return 
                }
                // console.log(sdkId,name)
                // console.log(item)
                // sdkId = "camera1"
                // console.log("sdkId = "+sdkId)
                // console.log("name = "+item.name)
                // console.log("player_box_num = " + this.active_box_num)
                // console.log("previous_sdkId = " + this.video_srcs[this.active_box_num-1].sdkId)
                let flag = true
                for(let j = 0; j < this.subscribers.length; j++){

                    if( this.subscribers[j].id == this.video_srcs[this.active_box_num-1].sdkId ){
                        for( let i = 0; i <  this.video_srcs.length; i++){
                            if( i != ( this.active_box_num-1 ) ){
                                if( this.video_srcs[i].sdkId == this.subscribers[j].id ){
                                    flag = false
                                    break
                                }
                            }
                        }
                        if( flag ){
                            this.subscribers[j].unsubscribe();
                            this.subscribers.splice(j,1);
                            break
                        }
                        
                    }
                }

                let send_data
                if( flag ){
                    send_data = JSON.stringify({ 'cameraId': sdkId ,'previous':this.video_srcs[this.active_box_num-1].sdkId,'playerId':this.active_box_num,'guid':this.myID})
                }else{
                    send_data = JSON.stringify({ 'cameraId': sdkId ,'previous':'','playerId':this.active_box_num,'guid':this.myID})
                }
                
                this.stompClient.send("/app/camera/registry",{},send_data)
                for( let i = 0; i < this.subscribers.length; i++ ){
                    if( this.subscribers[i].id === sdkId){
                        return 0;
                    }
                }

                let close_cam = this.stompClient.subscribe('/topic/camera/'+sdkId, (data) => {
                    // console.log( "接收数据 " + sdkId)
                    // console.log(data.body)
                    let jsonData = JSON.parse(data.body)
                    if( jsonData.status === 0 && this.is_trans){
                        if(jsonData.msg === "stream" && this.myID === jsonData.data.guid){
                            if( jsonData.data.play_stream != "error"){
                                this.open_flag = false
                                if( jsonData.data.play_stream != "" ){
                                    this.playvideo(jsonData.data.play_stream,jsonData.data.playerId,sdkId,name)
                                }   
                            }else{
                                if( sdkId === this.video_srcs[this.active_box_num-1].sdkId ){
                                    this.error_info("视频未打开成功")
                                }
                            }
                            
                        }else if(jsonData.msg === "normal"){
                            // console.log(jsonData)
                            this.catch_oneday = jsonData.data.snapshotOfDay
                            let temp_data = {}
                            temp_data.time = jsonData.data.catchTime.split(" ")[1]
                            temp_data.img = jsonData.data.snapshotUrl
                            temp_data.faceSdkId = jsonData.data.faceSdkId
                            temp_data.cameraName = jsonData.data.cameraName
                            temp_data.wholePhoto = jsonData.data.wholePhoto
                            if( jsonData.data.emotions ){
                                temp_data.emotions = this.emotion_analysis(jsonData.data.emotions)
                            }
                            if( jsonData.data.gender === "female" ){
                                temp_data.gender = "女"
                            }else if( jsonData.data.gender === "male" ){
                                temp_data.gender = "男"
                            }
                            // this.show_face_list.push(JSON.parse(JSON.stringify(temp_data)))
                            // console.log("temp_data")
                            console.log(temp_data)
                            this.rolling_picture(temp_data)
                        }
                    }
                });
                close_cam.id = sdkId
                this.subscribers.push(close_cam)
            },

            // 滚动图片
            rolling_picture:function(temp_data){
                // let temp_data = JSON.parse(JSON.stringify(this.default_data))
                if( this.end_id === 12 ){
                    this.show_data[0].img = temp_data.img
                    this.show_data[0].time = temp_data.time
                    this.show_data[0].gender = temp_data.gender
                    this.show_data[0].emotions = temp_data.emotions
                    this.show_data[0].cameraName = temp_data.cameraName
                    this.show_data[0].faceSdkId = temp_data.faceSdkId
                    this.show_data[0].wholePhoto = temp_data.wholePhoto
                    this.show_data[0].translatetime = 0.5
                    // temp_data.translatetime = 0.5
                    // temp_data.move_pix = this.show_data[0].move_pix
                    // this.show_data.splice(0,1,temp_data);
                }else{
                    this.show_data[this.end_id+1].img = temp_data.img
                    this.show_data[this.end_id+1].time = temp_data.time
                    this.show_data[this.end_id+1].gender = temp_data.gender
                    this.show_data[this.end_id+1].emotions = temp_data.emotions
                    this.show_data[this.end_id+1].cameraName = temp_data.cameraName
                    this.show_data[this.end_id+1].faceSdkId = temp_data.faceSdkId
                    this.show_data[this.end_id+1].wholePhoto = temp_data.wholePhoto
                    this.show_data[this.end_id+1].translatetime = 0.5
                    // temp_data.translatetime = 0.5
                    // temp_data.move_pix = this.show_data[this.end_id+1].move_pix
                    // this.show_data.splice(this.end_id+1,1,temp_data);
                }
                for( let i = 0; i < this.show_data.length; i++ ){
                    if( i === this.end_id){
                        this.show_data[i].move_pix += -113.2*12
                        this.show_data[i].translatetime = 0
                        this.end_id = this.end_id - 1 
                    }else{
                        this.show_data[i].translatetime = 0.5
                        this.show_data[i].move_pix += 113.2
                    }
                    this.show_data.splice(i,1,this.show_data[i]);
                }
                if( this.end_id === -1 ){
                    this.end_id = 12
                }
            },
            rolling_alarm:function(temp_data){
                this.pop_up_info_alarm(temp_data)
                // console.log(this.alarm_showdata)
                if( this.end_id_alarm === 5 ){
                    for( let item in temp_data ){
                        this.alarm_showdata[0][item] = temp_data[item]
                    }
                    // this.alarm_showdata[0] = temp_data
                    this.alarm_showdata[0].translatetime = 0.5
                }else{
                    for( let item in temp_data ){
                        this.alarm_showdata[this.end_id_alarm+1][item] = temp_data[item]
                    }
                    this.alarm_showdata[this.end_id_alarm+1].translatetime = 0.5
                }

                for( let i = 0; i < this.alarm_showdata.length; i++ ){
                    if( i === this.end_id_alarm){
                        this.alarm_showdata[i].move_pix += -175*5
                        this.alarm_showdata[i].translatetime = 0
                        this.end_id_alarm = this.end_id_alarm - 1
                    }else{
                        this.alarm_showdata[i].translatetime = 0.5
                        this.alarm_showdata[i].move_pix += 175
                    }
                    this.alarm_showdata.splice(i,1,this.alarm_showdata[i]);
                    // console.log(i,this.alarm_showdata[i].translatetime,this.alarm_showdata[i].move_pix,this.alarm_showdata[i].confidence)
                }
                if( this.end_id_alarm === -1 ){
                    this.end_id_alarm = 5
                }
            },
            // 报警弹窗
            pop_up_info_alarm:function(temp_data){
                this.alarm_new_data = JSON.parse(JSON.stringify(temp_data))
                if( this.open_alarm ){
                    clearInterval(this.timer_num)
                }else{
                    this.open_alarm = true
                }
                this.timer_num = setTimeout(() => {
                    this.open_alarm = false
                }, 1000*4)
            },

            // 视频播放
            playvideo:function(video_url,player_num,sdkId,name){
                this.video_srcs[player_num-1].playAddress = video_url
                this.video_srcs[player_num-1].sdkId = sdkId
                this.video_srcs[player_num-1].name = name
                // console.log(this.video_srcs)
                this.flashvars.src = video_url
                swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player"+player_num, "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
            },
            // 刷新视频
            repaly_video:function(num){
                // console.log(this.video_srcs[num])
                this.flashvars.src = this.video_srcs[num-1].playAddress
                swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player"+num, "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
            },
            // 生成唯一ID
            S4:function(){
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
            },
            guid:function(){
                return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4())
            },


            // sockJS、Stomp
            // 请求初始化
            initSocket:function(){
                // let socket = new SockJS('http://192.168.10.62:9999/gee');
                // let socket = new SockJS('http://192.168.10.126:9990/gee');
                // let socket = new SockJS('http://192.168.10.132:9999/gee');
                let socket = new SockJS('gee');
                let first_time = true
                this.stompClient = Stomp.over(socket);
                this.stompClient.connect({}, (frame) =>{
                    this.stompClient.subscribe('/topic/camera/warning', (data) => {
                        let jsonData = JSON.parse(data.body)
                        if( jsonData.status === 0 && jsonData.msg === "warning"){
                            this.alarm_weeknum = jsonData.data.warningOfWeek
                            let temp_data = {}
                            for( let item in jsonData.data ){
                                if( item === "catchTime" ){
                                    [temp_data.time_ymd,temp_data.time_hms] = jsonData.data.catchTime.split(",")
                                }else if( item === "confidence" ){
                                    temp_data[item] = Math.round(jsonData.data.confidence*100)
                                }else{
                                    temp_data[item] = jsonData.data[item]
                                }
                            }
                            this.rolling_alarm(temp_data)
                        }else if( jsonData.status === 0 && jsonData.msg === "snapshotOfDay"){
                            this.catch_oneday = jsonData.data
                        }
                    });
                    if( first_time ){
                        first_time = false
                        this.get_init_data1()
                    }
                },(message) => {
                    console.log(message);
                    setTimeout("initSocket()", 3000);
                });
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

            // 初始化请求
            // mes_handling:function(status, msg){
            //     if( status === 1 ){
            //         this.error_info(msg)
            //         return ;
            //     }else if( status === 2 ){
            //         this.error_info(msg)
            //         return ;
            //     }else if( status === 10 ){
            //         this.error_info('请先登录')
            //         return ;
            //     }else{
            //         if( status === 401 && msg === "未登录" ){
            //             this.error_info(msg)
            //             this.$router.push("/login")
            //         }else{
            //             this.error_info(status + "  " + msg)
            //         }
            //     }
            // },
            // 抓拍
            get_init_data:function(){
                var params = new URLSearchParams()
                params.append("pageNum",1)
                params.append("pageSize",20)
                this.$ajax.post("/history/getSnapshotList",params).then((res) => {
                    if( res.data.status === 0){
                        this.default_show_data = res.data.data.list
                        // this.init_data.allnum = res.data.data.total
                        for( let i = 0; i < this.default_show_data.length; i++){
                            this.default_show_data[i].uuid = i
                            this.default_show_data[i].ischecked = false
                            if( this.default_show_data[i].emotions ){
                                this.default_show_data[i].emotions = this.emotion_analysis(this.default_show_data[i].emotions)
                            }
                            if( this.default_show_data[i].gender === "female" ){
                                this.default_show_data[i].gender = "女"
                            }else if( this.default_show_data[i].gender === "male" ){
                                this.default_show_data[i].gender = "男"
                            }
                            this.default_show_data[i].time = this.default_show_data[i].catchTime.split(" ")[1]
                            // this.default_show_data[i].confidence = Math.round(this.default_show_data[i].confidence)
                        }
                        for ( let i = 0; i < 13; i++){
                            if( i === 0 || i === 12 ){
                                this.show_data.push(JSON.parse(JSON.stringify(this.default_data)))
                            }else{
                                if( this.default_show_data.length > i - 1 ){
                                    this.show_data.push(JSON.parse(JSON.stringify(this.default_show_data[i-1])))
                                    this.show_data[i].img = this.default_show_data[i-1].snapshotUrl
                                }else{
                                    this.show_data.push(JSON.parse(JSON.stringify(this.default_data)))
                                }
                                
                            }
                            
                            this.show_data[i].uuid = i+1

                            this.show_data[i].move_pix = 0
                            this.show_data[i].translatetime = 0.5
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
            // 预警数量
            get_init_data1:function(){
                var params = new URLSearchParams()
                this.$ajax.post("/history/getWeekWarnTimes",params).then((res) => {
                    this.alarm_weeknum = res.data.warnTimes
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
            },
            // 预警
            get_init_data2:function(){
                var params = new URLSearchParams()
                this.$ajax.post("/history/getWarningFaceList",params).then((res) => {
                    if( res.data.status === 0){
                        this.default_data_alarm = res.data.data.list
                        // 初始化报警数据
                        for ( let i = 0; i < 6;i++ ){
                            if( i === 0 || i === 5 ){
                                this.alarm_showdata.push( JSON.parse(JSON.stringify(this.default_data1)) )
                            }else{
                                if( this.default_data_alarm.length > i-1 ){
                                    this.alarm_showdata.push( JSON.parse(JSON.stringify(this.default_data_alarm[i-1])) )
                                    this.alarm_showdata[i].time_ymd = this.default_data_alarm[i-1].catchTime.split(" ")[0]
                                    this.alarm_showdata[i].time_hms = this.default_data_alarm[i-1].catchTime.split(" ")[1]
                                    this.alarm_showdata[i].confidence = Math.round(this.default_data_alarm[i-1].confidence * 100)
                                }else{
                                    this.alarm_showdata.push( JSON.parse(JSON.stringify(this.default_data1)) )
                                }
                                
                            }
                            
                            this.alarm_showdata[i].uuid = i
                            // this.alarm_showdata[i].confidence =  20+i

                            this.alarm_showdata[i].move_pix = 0
                            this.alarm_showdata[i].translatetime = 0.5
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

            beforeRouteLeave(to, from, next) {
                if( to.path === "/facepath" && this.$store.state.is_search_data_facepath ){
                    to.meta.keepAlive = false; 
                }
                next()
            },
        },
        mounted:function(){
            this.initSocket()
            // setTimeout(() => {
            //     this.get_init_data1()
            // }, 600)
            // if( this.first_flag ){
            //     this.get_init_data()
            //     this.get_init_data2()

            //     this.init_video()
            //     this.initSocket()
            //     this.myID = this.guid()

            //     this.first_flag = false
            // }
        },
        watch:{
            '$store.state.realtime_data.sdkId':function(newVal,old){
                // console.log(this.$store.state.realtime_data.sdkId)
                this.active_box_num = 1
                this.$store.state.is_search_data = false
                // console.log(this.$store.state.realtime_data.sdkId)
                this.choose_this_url(this.$store.state.realtime_data.sdkId,this.$store.state.realtime_data.name)
            },
            '$store.state.realtime_data.groupNames':function(newVal,old){
                this.groupNames = this.$store.state.realtime_data.groupNames
                this.choose_groupName = this.groupNames[0].name
                this.video_names = this.$store.state.realtime_data.video_names
            },
            'choose_groupName':function(newVal,old){
                for( let i = 0; i < this.groupNames.length; i++ ){
                    if( this.groupNames[i].name === newVal ){
                        this.change_show_data(i)
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
            // 'show_face_list':function(newVal,old){
            //     this.rolling_picture(newVal[-1])
            // },

        },
        beforeRouteEnter(to, from, next){
            if( from.path === "/mmanage4" || from.path === "/mmanage4_offline" || from.path === "/facepath" || from.path === "/facepath_offline"){
                next(vm => {
                    if( vm.first_flag ){
                        vm.get_init_data()
                        vm.get_init_data2()

                        vm.init_video()
                        // vm.initSocket()
                        vm.myID = vm.guid()

                        vm.first_flag = false

                        setTimeout(() => {
                            vm.active_box_num = 1
                            vm.$store.state.is_search_data = false
                            console.log(vm.$store.state.realtime_data.sdkId,vm.$store.state.realtime_data.name)
                            vm.choose_this_url(vm.$store.state.realtime_data.sdkId,vm.$store.state.realtime_data.name)
                        }, 500)
                    }else{
                        console.log(vm.$store.state.is_search_data)
                        vm.active_box_num = 1
                        vm.$store.state.is_search_data = false
                        vm.choose_this_url(vm.$store.state.realtime_data.sdkId,vm.$store.state.realtime_data.name)
                    }
                    
                })
            }else{
                next(vm => {
                    if( vm.first_flag ){
                        vm.get_init_data()
                        vm.get_init_data2()

                        vm.init_video()
                        // vm.initSocket()
                        vm.myID = vm.guid()

                        vm.first_flag = false
                    }
                })
            }
        }
    }
</script>

<style scoped>
    @import "../css/historyface.css";
    @import "../css/realtimem.css";
    .left_mainBox{
        width: 100%;
        height: 100%
    }
    .list_box{
        position: absolute;
        top: 90px;
        left: 265px;
        height:-webkit-calc(100% - 150px); 
        height:-moz-calc(100% - 150px); 
        height:calc(100% - 150px);
        width:-webkit-calc(100% - 325px); 
        width:-moz-calc(100% - 325px); 
        width:calc(100% - 325px);
        border: 1px solid #00ffff;
        background-color: rgba(72,69,89,0.3);
        border-radius: 5px;
    }
    .add_state{
        float: right;
        margin-right:20px;
    }

    /* 滚动条 */
    /*::-webkit-scrollbar {
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
    }*/
</style>