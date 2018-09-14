<template>
	<div class="chart">
        <div class="view_box3">
            <v-gauge :cpuData="cpuData" :hardDisk="hardDisk" :ROM="ROM"></v-gauge>
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
                hardDisk: 0,
                ROM: 0,
            }
        },
        mounted() {
            this.post_to_change_cpu()
            this.post_to_change_hard()
            this.post_to_change_rom()
            // setInterval(() => {
            //     this.cpuData = this.cpuData + 1
            // }, 1000);
        },
        methods: {
            mes_handling:function(status, msg){
                if( status === 1 ){
                    this.error_info(msg)
                    return ;
                }else if( status === 2 ){
                    this.error_info(msg)
                    return ;
                }else if( status === 10 ){
                    this.error_info('请先登录')
                    return ;
                }else{
                    if( status === 401 && msg === "未登录" ){
                        this.error_info(msg)
                        this.$router.push("/login")
                    }else{
                        this.error_info(status + "  " + msg)
                    }
                }
            },
            post_to_change_cpu:function(  ){
                this.$ajax.get("/actuator/metrics/system.cpu.usage").then((res) => {
                    if( res.data){
                        let percent = res.data.measurements[0].value

                        this.cpuData = (percent.toFixed(4)*100).toFixed(2)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
            },
            post_to_change_hard:function(  ){
                this.$ajax.get("/actuator/health").then((res) => {
                    if( res.data){
                        let total = res.data.details.diskSpace.details.total
                        let free = res.data.details.diskSpace.details.free
                        let percent = (total - free)/total

                        this.hardDisk = (percent.toFixed(4)*100).toFixed(2)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
            },
            post_to_change_rom:function(  ){
                this.$ajax.get("/data/serverStatus").then((res) => {
                    if( res.data.status === 0){
                        let percent = res.data.data.split("%")[0]

                        this.ROM = percent
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
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