<template>
	<div class="chart">
        <div class="view_box3">
            <v-gauge :cpuData="cpuData"></v-gauge>
        </div>
    </div>
</template>

<script>
	import gauge from "./gauge3"

	export default {
		props: {
			searchData: Object,
		},
        components:{
            'v-gauge': gauge,
        },
        data() {
            return {
                // 页面切换
                transitionName: '',
                cpuData: 0,
            }
        },
        mounted() {
            this.post_to_change_page()
            setInterval(() => {
                // this.cpuData = this.cpuData + 1
            }, 1000);
        },
        methods: {
            post_to_change_page:function( search_data ){

                this.$ajax.get("/actuator/health").then((res) => {
                    if( res.data){
                        let total = res.data.details.diskSpace.details.total
                        let free = res.data.details.diskSpace.details.free
                        let percent = (total - free)/total
                        this.cpuData = percent.toFixed(4)*100
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
            clear_show_data:function(){
                
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
        },
        watch:{
        	'searchData':function(newval,old){
        		if( newval.cameraSdkIds ){
        			this.post_to_change_page({ cameraSdkIds:this.searchData.cameraSdkIds.join(",")})
        		}else if( newval.cameraGroupIds ){
        			this.post_to_change_page({ cameraGroupIds:this.searchData.cameraGroupIds.join(",")})
        		}	
        	}
        }
    }
</script>

<style scoped>
    @import "../../css/historyface.css";
    
    .view_box3{
        /*position: relative;*/
        position: absolute;
        width: 100%;
        height: 100%;
        /*float: right;*/
    }
</style>