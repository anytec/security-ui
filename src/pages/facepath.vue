<template>
    <div class="main_box">
        <left-nav></left-nav>
        <div class="map_bg" id="container"></div>
        <!--地图边框线-->
        <div class="left_xian"></div>
        <div class="top_xian"></div>
        <!--弹框-->
        <!-- <div class="face_infobox">
            <div class="face_title">
                <div class="snap">抓拍：3214</div>
                <div class="state">正常</div>
                <div class="face_icon1"><img src="../assets/historyface/icon7.png"/></div>
                <div class="face_icon2"><img src="../assets/historyface/icon2.png"/></div>
            </div>
            <div class="face_camera">camera:################</div>
            <div class="face_conter">
                <div class="conter_box">
                    <div class="conter_img"><img src="../assets/historyface/img1.jpg"/></div>
                    <div class="conter_textbox">
                        <p>记录_1</p>
                        <p>序号_2</p>
                        <p>2016/11/22</p>
                        <p>12:12:12</p>
                    </div>
                </div>
                <div class="conter_box">
                    <div class="conter_img"><img src="../assets/historyface/img1.jpg"/></div>
                    <div class="conter_textbox">
                        <p>记录_1</p>
                        <p>序号_2</p>
                        <p>2016/11/22</p>
                        <p>12:12:12</p>
                    </div>
                </div>
                <div class="conter_box">
                    <div class="conter_img"><img src="../assets/historyface/img1.jpg"/></div>
                    <div class="conter_textbox">
                        <p>记录_1</p>
                        <p>序号_2</p>
                        <p>2016/11/22</p>
                        <p>12:12:12</p>
                    </div>
                </div>
            </div>
        </div> -->
        <!--右边上半部分-->
        <div class="face_rightbox1">
            <div class="faceleft_photo">
                <div class="face_photoimg">
                    <div class="faceshow_img" v-show="dataUrl"><img :src="dataUrl" v-show="dataUrl"></div>
                    <img class="decoration_img" src="../assets/mmanage/add_file.png"  v-show="!dataUrl" />
                    <input class="face_file" type="file" @change="handleFileChange" ref="inputer" :value="pic"/>
                </div>
                <div class="facephoto_text">检索对象</div>
            </div>
            <div class="face_fillbox">
                <div class="face_timetext">时间范围</div>
                <div class="face_timeinput">
                    <el-date-picker 
                      v-model="datevalue"
                      type="datetimerange"
                      :picker-options="pickeroptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="similar_box">
                    <div class="similar_text">相似度</div>
                    <div class="slider_box">
                        <el-slider v-model="search_data.confidence"></el-slider>
                    </div>
                    <div class="percentage"><input type="text" v-model="search_data.confidence"/></div>
                    <div class="percentage_text">%</div>
                    <div class="search face_search" @click="click_to_search(search_data)">搜索</div>
                </div>
                <div class="results_box">
                    <div class="results_text">发现{{init_data.allnum}}个结果</div>
                    <div class="export_btn face_btn" @click="click_to_clear">清空</div>
                    <div class="export_btn face_btn" @click="export_data2excel">导出</div>
                </div>
            </div>
        </div>
        <!--右边下半部分-->
        <div class="face_rightbox2">
            <div class="results_listbox">
                <div class="results_list" :style="{'border-left': item.mystyle}" v-for="item in tabledata">
                    <div class="digital_bg" @click="change_map_center(item.location)">{{item.uuid+1}}</div>
                    <div class="results_right">
                        <div class="results_conter1">{{item.cameraName}}</div>
                        <div class="re_conterbox1">
                            <div class="results_conter2">{{item.nyr}}</div>
                            <div class="results_conter2">{{item.sfm}}</div>
                            <div class="results_conter2">相似度：{{ item.confidence }}</div>
                        </div>
                        <div class="re_conterbox2">
                            <img :src="item.snapshotUrl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LeftNav from "./left_nav2"
    import AMap from 'AMap'
    import Vue from 'vue'

	export default {
		components : {
            LeftNav,
        },
        data(){
            return{
                icon_eye: require("../assets/historyface/icon7.png"),
                icon_setting: require("../assets/historyface/icon2.png"),
                icon_marker: require("../assets/facepath/map_iconimg.png"),
                // 地图数据
                map: null,
                markers : [],
                polyline : null,
                center_xy: [114.059648,22.543665],
                locations: [],
                infomycontent: [],
                mycontent_marker: [],
                markers_list: [],
                allcamera_list: null,

                // 初始化数据
                init_data:{
                    allnum: 0,
                },

                // 检索数据
                dataUrl: "",
                pic: "",
                search_data:{
                    photo: "",
                    confidence: 75,
                    startTime: "",
                    endTime: "",
                },
                input_confidence: 0,
                same_confidence: 0,
                datevalue: [(new Date() - 3600 * 1000 * 24 * 1),new Date()-1],
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

                default_data:{
                    id: 1,
                    cameraName: "camera 12##########",
                    nyr: "2018-08-01",
                    sfm: "11:11:11",
                    confidence: 89,
                    mystyle: "2px solid white"
                },
                // 初始化数据
                tabledata:[
                   
                ],
            }
        },
        methods:{
            // 地图初始化
            init:function(location){
                // console.log(location)
                this.map = new AMap.Map('container', {
                  center: location,
                  resizeEnable: true,
                  zoom: 16,
                  mapStyle: 'amap://styles/darkblue',
                })
            },
            change_map_center:function(location){
                this.map.setCenter(location);
            },
            // 地图添加标志
            add_markers:function(){
                for( let i = 0; i < this.infomycontent.length; i++)
                {
                    var infoWindow
                    // console.log(this.locations[i])
                    this.markers.push(
                        new AMap.Marker({ 
                            //添加自定义点标记
                            map: this.map,
                            position: this.tabledata[this.markers_list[i]].location, //基点位置
                            offset: new AMap.Pixel(-22, -57), //相对于基点的偏移位置
                            draggable: false,  //是否可拖动
                            // icon : "/static/logo2.png",
                            content: this.mycontent_marker[i],
                        })
                    )
                    this.markers[i].uuid = i
                    this.markers[i].mylnglat = this.tabledata[this.markers_list[i]].location
                    this.markers[i].on('mouseover',(e) =>{
                        infoWindow = new AMap.InfoWindow({
                            isCustom: true,  //使用自定义窗体
                            content : this.infomycontent[e.target.uuid],
                            draggable: false,
                            // offset: new AMap.Pixel(-140, 225),
                            offset: new AMap.Pixel(260, -500),
                        })
                        e.target.setIcon("/static/logo3.png")
                        infoWindow.open(this.map,e.target.mylnglat)
                    })
                    this.markers[i].on('mouseout',(e) => {
                        e.target.setIcon("/static/logo2.png")
                        infoWindow.close()
                    })
                }
            },
            add_markers_all:function(add_data){
                let allcamera_marker_icon = '<div class="map_maxbox">\
                                                <div class="map_iconbg">\
                                                </div>\
                                                <div class="map_iconimg">\
                                                    <img src='+ this.icon_marker +' />\
                                                </div>\
                                            </div>'
                for( let i = 0; i < add_data.length; i++)
                {
                    let infomycontent = '<div class="face_infobox">\
                                            <div class="face_title">\
                                                <div class="snap">抓拍：3214</div>\
                                                <div class="state">正常</div>\
                                                <div class="face_icon1"><img src="'+this.icon_eye+'" onclick="test()"/></div>\
                                                <div class="face_icon2"><img src="'+this.icon_setting+'"/></div>\
                                            </div>\
                                            <div class="face_camera">'+add_data[i].name+'</div>\
                                            <div class="face_conter"></div>\
                                        </div>'
                    var infoWindow,markers
                    markers = new AMap.Marker({ 
                            //添加自定义点标记
                            map: this.map,
                            position: add_data[i].location, //基点位置
                            offset: new AMap.Pixel(-22, -57), //相对于基点的偏移位置
                            draggable: false,  //是否可拖动
                            // icon : "/static/logo2.png",
                            content: allcamera_marker_icon,
                        })
                    markers.uuid = add_data[i].uuid
                    markers.mylnglat = add_data[i].location
                    markers.on('mouseover',(e) =>{
                        infoWindow = new AMap.InfoWindow({
                            isCustom: true,  //使用自定义窗体
                            content : infomycontent,
                            draggable: false,
                            offset: new AMap.Pixel(260, -500),
                        })
                        // e.target.setIcon("/static/logo3.png")
                        infoWindow.open(this.map,e.target.mylnglat)
                    })
                    markers.on('mouseout',(e) => {
                        // e.target.setIcon("/static/logo2.png")
                        infoWindow.close()
                    })
                }
            },
            // 显示折线
            add_line:function(){
                this.polyline = new AMap.Polyline({
                    map: this.map,
                    path: this.locations,
                    strokeColor: "#00a0e9",  //线颜色
                    strokeOpacity: 1,     //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                    strokeWeight: 3,      //线宽
                    strokeStyle: "solid",  //线样式
                });
                this.polyline.setMap(this.map) // 显示折线
            },
            // 添加mark图标
            add_markers_icon:function(num){
                return '<div class="map_maxbox">\
                            <div class="map_iconbg">\
                                <div class="map_icontext">'+ num +'</div>\
                            </div>\
                        </div>'
            },

            // 上传图片
            imgPreview:function(file){
                let self = this;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
        
                if (/^image/.test(file.type)) {
                    // 创建一个reader
                    var reader = new FileReader();
                    // 将图片将转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        self.dataUrl = this.result;
                    }
                }
            },
            handleFileChange:function(e){
                let inputDOM = this.$refs.inputer;
                this.search_data.photo = inputDOM.files[0];
                this.imgPreview(this.search_data.photo);
            },

            // 初始化请求数据
            // 请求数据
            get_init_data:function(){
                this.add_markers_all(this.allcamera_list)
            },
            post_to_get_facepath:function(search_data,model=""){
                var params = new FormData()
                let cameraGroupIds = this.$store.state.facepath_search_data.cameraGroupIds
                let cameraIds = this.$store.state.facepath_search_data.cameraIds
                if( cameraGroupIds.length ){
                    cameraGroupIds.join(',')
                    params.append( "cameraGroupIds", cameraGroupIds) // 搜索设备组id
                }else{
                    params.append( "cameraGroupIds", "" )
                }
                if( cameraIds.length ){
                    cameraIds.join(',')
                    params.append( "cameraIds", cameraIds) // 搜索设备id
                }else{
                    params.append( "cameraIds", "" )
                }
                
                if( this.datevalue ){
                    // console.log(this.datevalue)
                    params.append( "startTime", this.datevalue[0]-1 )
                    params.append( "endTime", this.datevalue[1]-1 )
                }else{
                    params.append( "startTime", "" )
                    params.append( "endTime", "" )
                }
                if( -1 < search_data.confidence && search_data.confidence < 101 ){
                    params.append( "confidence", search_data.confidence )
                }else{
                    this.error_info("选择可信度")
                    return ;
                }
                if( search_data.photo ){
                    params.append( "photo", search_data.photo )
                }else if( this.dataUrl ){
                    if( search_data.photoUrl ){
                        params.append("photoUrl",search_data.photoUrl)
                    }else{
                        params.append("photoUrl","")
                    }
                }else{
                    this.error_info("请添加图片")
                    return ;
                }
                // 请求搜索轨迹
                // var params = new URLSearchParams()
                // params.append("")
                this.$ajax.post("/main/identifySnap",params,{headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                // this.$ajax.post("",params).then((res) => {
                    if( res.data.status === 0){
                        this.init_data.allnum = res.data.data.total
                        this.tabledata = res.data.data.list
                        // console.log(this.tabledata)
                        for( let i = 0; i < this.tabledata.length; i++){
                            this.tabledata[i].uuid = i
                            if( i+1 === this.tabledata.length ){
                                this.tabledata[i].mystyle = "none"
                            }else{
                                this.tabledata[i].mystyle = "2px solid white"
                            }
                            [this.tabledata[i].nyr,this.tabledata[i].sfm] = this.tabledata[i].catchTime.split(" ")
                            this.tabledata[i].location = [this.tabledata[i].location.split(",")[0],this.tabledata[i].location.split(",")[1]]
                            this.locations.push(this.tabledata[i].location)
                        }
                        this.map_info() // 组装窗口
                        this.add_markers() // 添加标记
                        this.add_line() // 添加轨迹
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

            // 按钮事件
            // 搜索按钮
            click_to_search:function(search_data){
                this.map.clearMap()
                this.post_to_get_facepath(search_data)
            },
            // 清空事件
            click_to_clear:function(){
                this.polyline.setMap(null)
                this.markers = []
                this.locations = []
                this.infomycontent = []
                this.mycontent_marker = []
                this.markers_list = []
                this.dataUrl = ""
                this.pic = ""
                this.search_data = {
                    photo: "",
                    confidence: 0,
                    startTime: "",
                    endTime: "",
                }
                this.map.clearMap()
                this.tabledata = null
                this.add_markers_all(this.allcamera_list)
            },
            // 导出事件
            // 导出数据为excel
            export_data2excel:function(){
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../vendor/Export2Excel');
                    const tHeader = ['设备名','年-月-日','时:分:秒','相似度','人脸'];
                    const filterVal = ['cameraName','nyr','sfm','confidence','snapshotUrl'];
                    let export_list = [];
                    for ( let i = 0; i < this.tabledata.length; i++){
                        export_list.push(JSON.parse(JSON.stringify(this.tabledata[i])))
                    }
                    const list = export_list;
                    const data = this.formatJson(filterVal, list);
                    console.log(data)
                    export_json_to_excel(tHeader, data, '导出列表');
                })
            },
            formatJson:function(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },

            // 组装窗口
            map_info:function(){
                var contects = []
                var location_remark = []
                for ( let i = 0; i < this.tabledata.length; i++ ){
                    let tempdata = JSON.parse(JSON.stringify(this.tabledata[i]))
                    let contect = '<div class="conter_box">\
                                        <div class="conter_img"><img src='+ tempdata.snapshotUrl +'></div>\
                                        <div class="conter_textbox">\
                                            <p>轨迹序号：'+ (tempdata.uuid+1) +'</p>\
                                            <p>'+ tempdata.nyr +'</p>\
                                            <p>'+ tempdata.sfm +'</p>\
                                        </div>\
                                    </div>'
                    if( location_remark.length ){
                        let flag = false
                        for( let j = 0; j < location_remark.length; j++ ){
                            if( location_remark[j][0] === this.tabledata[i].location[0] && location_remark[j][1] === this.tabledata[i].location[1]){
                                flag = true
                                contects[j] = contects[j] + contect
                            }
                        }
                        if( !flag ){
                            location_remark.push( this.tabledata[i].location )
                            contects.push( contect )
                            this.mycontent_marker.push( this.add_markers_icon(this.tabledata[i].uuid+1) )
                            this.markers_list.push( this.tabledata[i].uuid )
                        }
                    }else{
                        this.mycontent_marker.push( this.add_markers_icon(this.tabledata[i].uuid+1) )
                        this.markers_list.push( this.tabledata[i].uuid )
                        location_remark.push( this.tabledata[i].location )
                        contects.push( contect )
                    }
                }
                // console.log(contects.length)
                
                for( let i = 0; i < contects.length; i++ ){
                    this.infomycontent.push(
                        '<div class="face_infobox">\
                            <div class="face_title">\
                                <div class="snap">抓拍：3214</div>\
                                <div class="state">正常</div>\
                                <div class="face_icon1"><img src="'+this.icon_eye+'" onclick="test()"/></div>\
                                <div class="face_icon2"><img src="'+this.icon_setting+'"/></div>\
                            </div>\
                            <div class="face_camera">camera:################</div>\
                            <div class="face_conter">'
                            + contects[i] +
                            '</div>\
                        </div>'
                    )
                }
                
            },
            click_to_test:function(res){
                // this.$router.push('/historyface1')
                console.log(res)
            },
        },
        mounted:function(){
            // 将window原生事件绑定到vue的事件中
            window['test'] = (res) => {
                this.click_to_test(res)
            }
        },
        watch:{
            'search_data.confidence':function (newVal,oldVal) {
                if( newVal === "" ){
                    this.search_data.confidence = 0
                }else if( newVal >= 100 ){
                    this.search_data.confidence = 100
                }
                this.search_data.confidence = parseInt(this.search_data.confidence)
            },

            '$store.state.facepath_search_data.allcamera_list':function(newVal,old){
                this.allcamera_list = this.$store.state.facepath_search_data.allcamera_list
                if( this.allcamera_list.length ){
                    this.init( this.allcamera_list[0].location )
                }else{
                    console.log("haha")
                    this.init( this.center_xy )
                }
                if ( this.$store.state.is_search_data ){
                    this.search_data.photoUrl = this.$store.state.facepath_data.photo
                    this.dataUrl = this.search_data.photoUrl
                    this.map.clearMap()
                    this.post_to_get_facepath(this.search_data,"skip")

                    this.$store.state.is_search_data = false
                    this.$store.state.facepath_data.photo = ""
                }else{
                    this.get_init_data()
                }
            }
        }
	}
</script>

<style>
    @import "../css/historyface.css";
    /*@import "../css/facepath.css";*/
/*    .el-date-editor .el-range-input {
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
    }

    /* 相似度滑块 */
    /*.el-slider__runway{
        margin: 10px 0;
    }*/
    /* 地图logo */
    .amap-logo {
        right: 0 !important;
        left: auto !important;
        display: none;
    }
    .amap-copyright{
        display: none !important;
    }

    /* map.marker */
    .map_maxbox{
        width: 44px;
        height: 56px;
    }
    .map_iconbg{
        position: relative;
        width: 44px;
        height: 56px;
        color: white;
        background: url(../assets/facepath/map_icon.png) no-repeat;
        background-size: 100% 100%;
    }
    .map_icontext{
        /*display: none;*/
        width: 44px;
        text-align: center;
        height: 56px;
        line-height: 45px;
        position: absolute;
        font-size: 20px;
    }
    .map_iconimg{
        /*display: none;*/
        position: absolute;
        top:2px;
        left: 2px;
        width: 44px;
        height: 44px;
    }
    .amap-marker-content{
        white-space: inherit !important;
    }
</style>
<style scoped>
    /*@import "../css/historyface.css";*/
    /*@import "../css/facepath.css";*/
</style>