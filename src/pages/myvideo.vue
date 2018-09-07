<template>
	<div class="bg_box">
       <video autoplay="autoplay" loop="loop">
          <source :src="video_src" type="video/mp4">
                    您的浏览器不支持 video 标签。
       </video>
   </div>
</template>

<script>
	export default {
		data(){
			return {
				video_src : require("../assets/login/login_bg.mp4")
			}
		}
	}
</script>

<style scoped>
    @import "../css/login.css";
</style>