<template>
	<div class="chart">
        <div class="view_box2">
            <div class="item one" @click="clickChart('1')" style="transform: translate(-26%,-26%) scale(0.48)">
                <v-bar :maleNum="gender_age_data.maleNum" :femaleNum="gender_age_data.femaleNum" :ageGroupList="gender_age_data.ageGroupList" ></v-bar>
            </div>
            <div class="item two" @click="clickChart('2')" style="transform: translate(-26%,26%) scale(0.48)">
                <v-pie :ageGroupList="gender_age_data.ageGroupList" :genderData="genderData" :AgeGengerData="AgeGenderTotal"></v-pie>
            </div>
            <div class="item three active" @click="clickChart('3')" style="transform: translate(50%,0%) scale(1)">
                <v-radar :emotionsData="emotions_data"></v-radar>
            </div>
        </div>
    </div>
</template>

<script>
	import bar from "./bar2"
    import pie from "./pie2"
    import radar from "./radar2"

	export default {
		props: {
			searchData: Object,
            dateValue: Array,
		},
        components:{
            'v-bar': bar,
            'v-pie' : pie,
            'v-radar' : radar,
        },
        data() {
            return {
                // 页面切换
                transitionName: '',

                items: [],

                // 清除图表数据可视化
                emotions_data: null,
                gender_age_data:{
                    ageGroupList: [],
                    maleNum: [],
                    femaleNum: [],
                },
                AgeGenderTotal: [],
                genderData:[],

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
                if( search_data.cameraSdkIds || search_data.cameraGroupIds ){
                    params.append( "startTime", this.dateValue[0]-1)
                    params.append( "endTime", this.dateValue[1]-1)
                }
                this.$ajax.post("/data/peopleAnalysis",params).then((res) => {
                    if( res.data.status === 0){
                        this.clear_show_data()

                        // 情绪数据解析
                        let items = ["sad","happy","surprise","fear","angry","disgust"]
                        let temp_data = [[],[]]
                        for( let i = 0; i < items.length; i++ ){
                            // console.log(res.data.data.emotions[items[i]])
                            temp_data[0].push(res.data.data.emotions[items[i]].split(",")[0])
                            temp_data[1].push(res.data.data.emotions[items[i]].split(",")[1])
                        }
                        this.emotions_data = temp_data

                        // 年龄、男女数据解析
                        this.gender_age_data.ageGroupList = []
                        for( let item in res.data.data.age){
                            this.gender_age_data.ageGroupList.push(item)
                        }
                        this.gender_age_data.ageGroupList.sort()
                        for( let i = 0; i < this.gender_age_data.ageGroupList.length; i++ ){
                            // console.log(res.data.data.age[this.gender_age_data.ageGroupList[i]])
                            this.gender_age_data.maleNum.push(res.data.data.age[this.gender_age_data.ageGroupList[i]][0])
                            this.gender_age_data.femaleNum.push(res.data.data.age[this.gender_age_data.ageGroupList[i]][1]*-1)
                            this.AgeGenderTotal.push(res.data.data.age[this.gender_age_data.ageGroupList[i]][2])
                        }
                        let temp_data_gender = []
                        temp_data_gender.push(res.data.data.gender.male)
                        temp_data_gender.push(res.data.data.gender.female)
                        this.genderData = temp_data_gender
                        // console.log(this.gender_age_data)

                        this.$store.state.dataview_data.update_flag2 = !this.$store.state.dataview_data.update_flag2
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
                this.emotions_data = null
                this.gender_age_data = {
                    ageGroupList:[],
                    maleNum: [],
                    femaleNum: [],
                },
                this.AgeGenderTotal = []
                this.genderData = []
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
                this.items = document.querySelectorAll('.view_box2 .item')
                for (let i = 0; i < this.items.length; i++) {
                    this.items[i].dataset.order = i + 1;
                }
            },
            clickChart(clickIndex) {
                let activeItem = document.querySelector('.view_box2 .active')
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
    
    .view_box2{
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