<template>
    <div style="width:100%;height:100%">
        <div class="left_mainBox">
            <left-nav></left-nav>
            <div class="center_box">
                <div class="video_box">
                    <div class="video_top">
                        <div class="video_minbox">
                            <object class="player" id="player1">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                        <div class="video_minbox">
                            <div class="choose_box" @click="change_video(2)">
                                选择设备
                            </div>
                            <object class="player" id="player2">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                        <div class="video_minbox">
                            <div class="choose_box" @click="change_video(3)">
                                选择设备
                            </div>
                            <object class="player" id="player3">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                        <div class="video_minbox">
                            <div class="choose_box" @click="change_video(4)">
                                选择设备
                            </div>
                            <object class="player" id="player4">
                                <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                                       wmode="transparent" quality="high"></embed>
                            </object>
                        </div>
                    </div>
                    <div class="information_box">
                        <div class="info_alarm">
                            <div class="info_minbox" v-for="item in alarm_showdata" :style="{'transform':'translateY('+item.move_pix+'px)','transition-duration':item.translatetime+'s'}" @click="click_to_move()">
                                <div class="re_toptitle">
                                    <!-- <div class="re_lefttext">{{item.personName}}  {{item.gender}}  {{item.age}}岁  {{item.personGroupName}}</div> -->
                                    <div class="re_lefttext">{{item.personName}}  {{item.gender}}  {{item.personGroupName}}</div>
                                    <div class="icon_bg">
                                        <div class="re_lefticon"><img src="../assets/historyface/icon1.png"  @click="skip_to_facepath(item.faceUrl)"/></div>
                                    </div>
                                    <div class="re_icon">
                                        <div class="re_righticon"><img src="../assets/historyface/icon5.png"  @click="skip_to_mmanage2(item.uuid)"/></div>
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
                                        <img :src="item.snapshotUrl" style="width:100px;height:100px"/>
                                        <div class="re_icontext">{{item.confidence}}%</div>
                                    </div>
                                    <div class="re_photobox" style="width:100px;height:100px">
                                        <img :src="item.faceUrl" />
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
                                <div class="photo_img">
                                    <div class="catch_message" v-show="is_trans">{{item.emotion}}</div>
                                    <div class="catch_message" v-show="!is_trans">{{item.time}}</div>
                                    <img :src="item.img" style="width:100%;height:100%"/>
                                </div>
                                <div class="photo_text" v-show="is_trans">
                                    <!-- <div class="new_photo_text">{{item.age}}岁    {{item.gender}}</div> -->
                                    <div class="new_photo_text">{{item.gender}}</div>
                                </div>
                                <div class="photo_text" v-show="!is_trans">
                                    <div class="small_icon" ><img style="width:100%" src="../assets/historyface/icon1.png"  @click="skip_to_facepath(item.img)"/></div>
                                    <div class="small_icon1"><img style="width:100%" src="../assets/historyface/icon6.png"  @click="skip_to_mmanage2()"/></div>
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
                <div class="snap real_snap">抓拍：3214</div>
                <div class="snap real_anap">报警：0</div>
                <div class="state">正常</div>
                <div class="face_icon1"><img src="../assets/historyface/icon7.png"/></div>
                <div class="face_icon2"><img src="../assets/historyface/icon2.png"/></div>
            </div>
            <div class="real_camera">
                <select class="center_select real_select" v-model="choose_groupName">
                    <option v-for="item in groupNames">{{item.name}}</option>
                </select>
                <input class="real_input" type="text" placeholder="设备名称或设备ID" v-model="cameraName"/>
            </div>
            <div class="real_conter">
                <div class="real_ConterText" v-for="item in info_show_data" @dblclick="choose_this_url(item.sdkId)" v-show="item.isshow">{{ item.name }}</div>
            </div>
            <div class="bottom_bg">
                <img src="../assets/realtimem/bottom.svg" />
            </div>
        </div>
        <!--警告-->
        <!--遮罩层-->
        <div class="mack_box" v-show="open_alarm" @click="close_info"></div>
        <div class="warning_box" v-show="open_alarm" @click="click_to_move">
            <div class="warning_title">最新预警</div>
            <div class="warning_conter">
                <div class="left_photo">
                    <div class="real_photo1"><img style="width:100%;height:100%" :src="alarm_new_data.snapshotUrl"/></div>
                    <div class="real_photo2"><img style="width:100%;height:100%" :src="alarm_new_data.faceUrl" /></div>
                </div>
                <div class="real_similarity">
                    <div class="similarity_number">{{alarm_new_data.confidence}}%</div>
                    <div class="similarity_text">非常相似</div>
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
                default_data:{
                    img: require("../assets/historyface/img1.jpg"),
                    time: "--:--:--",
                    emotion: "**，**",
                    age: "**",
                    gender: "**",
                },
                default_data1:{
                    cameraGroupName: '*****',
                    cameraName: '*****',
                    time_ymd: '****-**-**',
                    time_hms: '--:--:--',
                    confidence: '**',
                    name: '***',
                    gender: '*',
                    age: '**',
                    personGroupName: '****',
                    snapshotUrl: require("../assets/historyface/img1.jpg"),
                    faceUrl: require("../assets/historyface/img1.jpg"),
                },
                show_data:[],
                alarm_showdata:[],
                alarm_weeknum: 0,
                catch_oneday: 0,

                // 视频数据
                video_srcs:[
                    {
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        playAddress: "",
                        sdkId: "",
                    },
                    {
                        playAddress: "",
                        sdkId: "",
                    },
                ],
                flashvars:{
                    // src: "rtmp://live.hkstv.hk.lxdns.com/live/hks",
                    src: "",
                    streamType: "live",
                    scaleMode: "zoom", // 自动缩放
                    bufferTime: 0.5,
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

                // 弹窗
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
            }
        },
        components: {
            MyNav,
            LeftNav
        },
        methods:{
            // test
            click_to_move:function(){

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
            change_show:function(flag){
                this.is_trans = flag
            },

            // 页面跳转
            skip_to_facepath:function(img){
                // 人脸轨迹
                this.$store.state.facepath_data.photo = img
                this.$store.state.is_search_data = true
                this.$router.push('/facepath')
            },
            skip_to_mmanage2:function(num){
                // this.$store.state.search_data.groupName = "底库2"
                // this.$store.state.search_data.groupId = 2
                this.$store.state.search_data.groupName = this.alarm_showdata[num].personGroupName
                this.$store.state.search_data.groupId = this.alarm_showdata[num].personGroupId
                this.$store.state.is_search_data = true
                this.$router.push('/mmanage2')
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
                    this.video_names[num][i].isshow = true
                    this.info_show_data.splice(-1,0,this.video_names[num][i])
                }
            },
            // 选择设备后，获取url
            choose_this_url:function(sdkId){
                // sdkId = "camera1"
                // console.log("sdkId = "+sdkId)
                // console.log("player_box_num = " + this.active_box_num)
                // console.log("previous_sdkId = " + this.video_srcs[this.active_box_num-1].sdkId)
                let send_data = JSON.stringify({ 'cameraId': sdkId ,'previous':this.video_srcs[this.active_box_num-1].sdkId,'playerId':this.active_box_num,'guid':this.myID})
                this.stompClient.send("/app/camera/registry",{},send_data)
                for( let i = 0; i < this.subscribers.length; i++ ){
                    if( this.subscribers[i] === sdkId){
                        return 0;
                    }
                }

                this.subscribers.push(sdkId)
                let close_cam = this.stompClient.subscribe('/topic/camera/'+sdkId, (data) => {
                    console.log( "接收数据 " + sdkId)
                    console.log(data.body)
                    let jsonData = JSON.parse(data.body)
                    if( jsonData.status === 0 && this.is_trans){
                        if(jsonData.msg === "stream" && this.myID === jsonData.data.guid){
                            if( jsonData.data.play_stream != "error"){
                                this.open_flag = false
                                this.playvideo(jsonData.data.play_stream,jsonData.data.playerId,sdkId)
                            }else{
                                this.error_info("视频未打开成功")
                            }
                            
                        }else if (jsonData.msg === "unsubscribe"){
                            close_cam.unsubscribe()
                            for( let i = 0; i < this.subscribers.length; i++ ){
                                if( this.subscribers[i] === sdkId){
                                    this.subscribers.splice(i,1);
                                }
                            }
                        }else if(jsonData.msg === "normal"){
                            this.catch_oneday = jsonData.data.snapshotOfDay
                            let temp_data = {}
                            temp_data.time = jsonData.data.catchTime.split(" ")[1]
                            temp_data.img = jsonData.data.snapshotUrl

                            // this.show_face_list.push(JSON.parse(JSON.stringify(temp_data)))
                            this.rolling_picture(temp_data)
                        }
                    }
                });
            },

            // 滚动图片
            rolling_picture:function(temp_data){
                // let temp_data = JSON.parse(JSON.stringify(this.default_data))
                if( this.end_id === 12 ){
                    this.show_data[0].img = temp_data.img
                    this.show_data[0].time = temp_data.time
                    this.show_data[0].translatetime = 0.5
                    // temp_data.translatetime = 0.5
                    // temp_data.move_pix = this.show_data[0].move_pix
                    // this.show_data.splice(0,1,temp_data);
                }else{
                    this.show_data[this.end_id+1].img = temp_data.img
                    this.show_data[this.end_id+1].time = temp_data.time
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
                }, 2000)
            },

            // 视频播放
            playvideo:function(video_url,player_num,sdkId){
                this.video_srcs[player_num-1].playAddress = video_url
                this.video_srcs[player_num-1].sdkId = sdkId
                this.flashvars.src = video_url
                swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player"+player_num, "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
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
                let socket = new SockJS('http://192.168.10.158:9999/gee');
                // let socket = new SockJS('http://192.168.10.132:9999/gee');
                // let socket = new SockJS('gee');
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

            // 初始化历史报警数据
            // get_init_data1:function(){
            //     var params = new URLSearchParams()
            //     this.$ajax.post("/history/getWarningFaceList",params).then((res) => {
            //         if( res.data.status === 0){
            //             let temp_data = JSON.parse(JSON.stringify(res.data.data.list))
            //             for( let i = 0; i < 6; i++){
            //                 if( i === 0 || i === 5 ){

            //                 }
            //             }
            //         }else if( res.data.status === 1 ){
            //             this.error_info('请求失败 ' + res.msg)
            //             return ;
            //         }else if( res.data.status === 2 ){
            //             this.error_info('参数错误 ' + res.msg)
            //             return ;
            //         }else if( res.data.status === 10 ){
            //             this.error_info('请先登录')
            //             return ;
            //         }
            //     }).catch((error) => {
            //         console.log(error)
            //         this.error_info('网络连接出错')
            //         return ;
            //     })
            // },
        },
        mounted:function(){
            // 初始化默认数据
            for ( let i = 0; i < 13; i++){
                this.show_data.push(JSON.parse(JSON.stringify(this.default_data)))
                this.show_data[i].id = i+1

                this.show_data[i].move_pix = 0
                this.show_data[i].translatetime = 0.5
            }
            for ( let i = 0; i < 6;i++ ){
                this.alarm_showdata.push( JSON.parse(JSON.stringify(this.default_data1)) )
                this.alarm_showdata[i].uuid = i
                // this.alarm_showdata[i].confidence =  20+i

                this.alarm_showdata[i].move_pix = 0
                this.alarm_showdata[i].translatetime = 0.5
            }

            this.init_video()
            // this.initWebSocket()
            this.initSocket()
            this.myID = this.guid()

            // let temp_data = this.$store.state.realtime_data.sdkId_temp
            
            // 启动页面跳转摄像头
            setTimeout(() => {
                this.$store.state.realtime_data.sdkId = this.$store.state.realtime_data.sdkId_temp
            }, 500)
        },
        watch:{
            '$store.state.realtime_data.sdkId':function(newVal,old){
                // console.log(this.$store.state.realtime_data.sdkId)
                this.active_box_num = 1
                this.choose_this_url(this.$store.state.realtime_data.sdkId)
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