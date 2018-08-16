<template>
    <!--html,不用head和body-->
    <div class="dataview_main_box">
        <div class="top_information">
            <div class="index_topbox">
                <div class="index_time">2018年7月31日  20点38分</div>
                <div class="index_snap">今日抓拍    <span>95631</span>   次</div>
                <div class="index_snap">告警    <span>5</span>   次</div>
                <div class="index_personnel">底库人员总量    <span>1000000</span>   张</div>
            </div>
        </div>
        <div class="index_bottombox">
            <div class="min_nav"></div>
            <div class="chart">
                <div class="view_box">
                    <div class="item one" @click="clickChart('1')" style="transform: translate(-26%,-26%) scale(0.48)">
                        <v-line></v-line>
                    </div>
                    <div class="item two" @click="clickChart('2')" style="transform: translate(-26%,26%) scale(0.48)">
                        <v-pie></v-pie>
                    </div>
                    <div class="item three active" @click="clickChart('3')" style="transform: translate(50%,0%) scale(1)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import line from "./dataview/line"
    import pie from "./dataview/pie"
    
    export default {
        components:{
            'v-line': line,
            'v-pie' : pie,
        },
        data() {
                return {
                    items: []
                }
            },
            mounted() {
                this._myinit()
            },
            methods: {

                // 动态效果
                // _resize() {
                //     this.$root.charts.forEach((myChart) => {
                //         myChart.resize()
                //     })
                // },
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
    }
</script>


<style scoped>
    @import "../css/historyface.css";
    
    .dataview_main_box{
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .view_box{
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