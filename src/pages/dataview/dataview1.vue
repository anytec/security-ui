<template>
	<div class="chart">
        <div class="view_box">
            <div class="item one" @click="clickChart('1')" style="transform: translate(-26%,-26%) scale(0.48)">
                <v-line :dayTime="day_time" :showData="showData_hour" :fname="name" :flag="update_flag" :key="'1'"></v-line>
            </div>
            <div class="item two" @click="clickChart('2')" style="transform: translate(-26%,26%) scale(0.48)">
                <v-pie :dayTime="day_time" :showData="showData_day" :fname="name" :flag="update_flag"></v-pie>
            </div>
            <div class="item three active" @click="clickChart('3')" style="transform: translate(50%,0%) scale(1)">
                <v-bar :dayTime="day_time" :showData="showData_day" :fname="name" :flag="update_flag"></v-bar>
            </div>
        </div>
    </div>
</template>

<script>
	import line from "./line1"
    import pie from "./pie1"
    import bar from "./bar1"

	export default {
		props: {
			searchData: Object,
		},
        components:{
            'v-line': line,
            'v-pie' : pie,
            'v-bar' : bar,
        },
        data() {
            return {
                // 页面切换
                transitionName: '',

                items: [],

                name: [],
                day_time: [],
                showData_hour: [],
                showData_day: [],
                // 更改标志
                update_flag: false,
            }
        },
        mounted() {
            this._myinit()
            this.post_to_change_page({})
        },
        methods: {
            post_to_change_page:function( search_data ){
                var params = new URLSearchParams()

                for( let item in search_data ){
                    params.append(item,search_data[item])
                }

                this.$ajax.post("/data/peopleCounting",params).then((res) => {
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
                        this.$store.state.dataview_data.update_flag1 = !this.$store.state.dataview_data.update_flag1
                    }else if( res.data.status === 1 ){
                        this.error_info(res.data.msg)
                        return ;
                    }else if( res.data.status === 2 ){
                        this.error_info(res.data.msg)
                        return ;
                    }else if( res.data.status === 10 ){
                        this.error_info('请先登录')
                        return ;
                    }else{
                        this.error_info(res.data.status + "  " + res.data.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
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
        	'searchData':function(newval,old){
        		// console.log(newval.cameraSdkIds)
        		if( newval.cameraSdkIds ){
        			// console.log(this.searchData.cameraSdkIds.join(","))
        			this.post_to_change_page({ cameraSdkIds:this.searchData.cameraSdkIds.join(",")})
        		}else if( newval.cameraGroupIds ){
        			// console.log(this.searchData.cameraGroupIds.join(","))
        			this.post_to_change_page({ cameraGroupIds:this.searchData.cameraGroupIds.join(",")})
        		}else{
        			// console.log("null")
        		}
        		
        	}
        }
    }
</script>

<style scoped>
    @import "../../css/historyface.css";
    
    .view_box{
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