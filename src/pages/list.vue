<template>
	<!--html,不用head和body-->
	<div class="video_box" >
        <object class="player" id="player">
        	<param name="menu" value="false">
            <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                   wmode="transparent" quality="high"></embed>
        </object>

        <object class="player1" id="player1">
        	<param name="menu" value="false">
            <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                   wmode="transparent" quality="high"></embed>
        </object>

        <object class="player2" id="player2">
        	<param name="menu" value="false">
            <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                   wmode="transparent" quality="high"></embed>
        </object>

        <object class="player3" id="player3">
        	<param name="menu" value="false">
            <embed src="/static/grindPlayer/GrindPlayer.swf" width="612px" height="344px" type=application/x-shockwave-flash
                   wmode="transparent" quality="high"></embed>
        </object>
    </div>
</template>


<script>
	//js
	export default {
		data(){
			return {
				flashvars:{
					// src: "rtmp://live.hkstv.hk.lxdns.com/live/hks",
					src: "rtmp://192.168.10.212:1936/myapp/test",
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
			}
		},
		methods:{
			mytest:function(){
				console.log("hsha")
			},
			init_video:function(){
			    swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player", "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
			    swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player1", "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
			    swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player2", "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
			    swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player3", "612px", "344px", "10.2", null, this.flashvars, this.params, this.attrs);
			}
		},
		mounted:function(){
			this.init_video()
		}
	}
	
</script>

<style>
	.main_box{
		width: 100%;
		height: 100%;
		min-width: 1920px;
		min-height: 974px;
		position: relative;
		/*background: url(../assets/historyface/bg.jpg) no-repeat;*/
		background-size: 100% 100%;
	}
</style>
