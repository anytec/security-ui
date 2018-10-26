<template>
  <!--<div class="video_main" @mouseup="myclick">-->
  <div class="video_main">
    <div :id="playerId" :name="name" class="grindPlayer">
      <embed :src="swf_src" type="application/x-shockwave-flash" wmode='transparent' quality='high' class="grindPlayer" @mouseup.stop></embed>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      playerId: '',
      name: {
        type: String,
        default: "无"
      },
    },
    name: 'MyPlayer',
    data () {
      return {
        // 初始化必要文件
        swf_src: "/static/grindPlayer/GrindPlayer.swf",

        // 播放器属性
        flashvars:{
          src: "",
          streamType: "live",
          bufferTime: 0.1,
          controlBarAutoHideTimeout: 0,
          scaleMode: "zoom",
        },
        params:{
          allowFullScreen: false,
          allowScriptAccess: "always",
          bgcolor: "#000000",
        },
        attrs:{
          name:"player",
        },

        // 播放器
        player: null,

        // 播放状态定时器
        time_get_status: null,

        // 播放接收状态
        bufferTimecount: 0,
        normal_count: 0,

        // 点击时间间隔
        clicktime_now: "",
        timer_num: null,

        // 错误提示框
        error_info_: null,
      }
    },
    methods: {
      // 视频播放事件
      play:function(src=""){
        this.flashvars.src = src;
        swfobject.embedSWF(this.swf_src, this.playerId, "100%","100%", "10.2", null, this.flashvars, this.params, this.attrs);

        if( src ){
          if( this.error_info_ ){
              this.error_info_.close()
          }
          this.$nextTick(()=>{
            // 获取视频对象
            this.player = document.getElementById(this.playerId)

            // 清除定时器
            if( this.time_get_status ){
              this.bufferTimecount = 0
              this.normal_count = 0
              clearInterval(this.time_get_status)
            }
            this.time_get_status = null

            // 启动定时器
            this.time_get_status = setInterval(() => {
              // 防止出现不存在函数 getBufferLength 的错误
              try{
                this.player.getBufferLength()
              }catch(err){
                console.log(err)
                return
              }
              console.log(this.playerId,"   ",this.player.getBufferLength())

              // 初始化 5次 不成功则报错
              if( this.player.getBufferLength() === 0 ){
                this.bufferTimecount += 1
                if( this.bufferTimecount > 5 ){
                  this.error_info(this.name+'未打开成功',0)

                  this.bufferTimecount = 0
                  // clearInterval(this.time_get_status)
                }
              }
              // 连续 10次 缓存超过2.5s，则报错
              else if( this.player.getBufferLength() > 2.5 ){
                this.bufferTimecount += 1
                if( this.bufferTimecount > 2 ){
                  this.error_info(this.name+'延时太高,正在重新连接',0)

                  this.bufferTimecount = 0
                  // clearInterval(this.time_get_status)
                  this.play(src)
                }
              }
              // 无法连接视频流，报错
              else if( !this.player.getBufferLength() ){
                this.bufferTimecount += 1
                if( this.bufferTimecount > 1 ){
                    this.error_info(this.name+'网络连接存在问题,正在重新连接',0)

                    this.bufferTimecount = 0
                    // clearInterval(this.time_get_status)
                    this.play(src)
                }
              }
              // 播放正常，计数清零
              else{
                this.normal_count += 1
                if( this.normal_count > 1){
                    this.normal_count = 0
                    if( this.error_info_ ){
                      this.error_info_.close()
                    }
                }
                this.bufferTimecount = 0
              }
            },1000)
          })
        }
      },
      myclick:function(){
        if( this.clicktime_now === "" ){
          this.clicktime_now = new Date()
          this.timer_num = setTimeout(() => {
            this.clicktime_now = ""
            this.click()
          }, 400)
        }else{
          let time_dif = new Date() - this.clicktime_now
          if( time_dif < 400 ){
            this.clicktime_now = ""
            this.dblclick()
            clearInterval(this.timer_num)
          }
        }
      },
      click:function(){
        console.log("单击")
      },
      dblclick:function(){
        console.log("双击")
      },

      // 错误消息提示
      error_info:function (msg,time) {
        let showtime = time*1000

        if( this.error_info_ ){
            this.error_info_.close()
        }
        this.error_info_ = this.$message({
          type: 'error',
          message: msg,
          showClose: true,
          center: true,
          duration: showtime,
        })
      }
    },
    mounted: function () {
      // console.log("load grindPlayer :"+this.playerId);
      this.$nextTick(() => {
        this.play("");
        // this.$nextTick(()=>{
        //     document.getElementsByTagName("embed")[0].click()
        //     console.log(document.getElementsByTagName("embed").length)
        // })
      })
    },
    // beforeRouteLeave(to, from, next){
    //   if( this.time_get_status ){
    //     clearInterval(this.time_get_status)
    //   }
    //   next()
    // }
  }
</script>

<style scoped>
  .video_main{
    width: 100%;
    height: 100%;
  }
  .grindPlayer{
    width: 100%;
    height: 100%;
  }
</style>

