<template>
	<div class="pie1">
		<div class="line_head">
			<select class="pie_select" v-model="choose_day">
                <option v-for="item in dayTime" class="pie_option">{{item}}</option>
            </select>
		</div>
		<div class="main"></div>
	</div>
</template>


<script>
	import echarts from 'echarts'

	export default{
		props: {
			showData:Array,
			fname: Array,
			dayTime: Array,
			flag: Boolean,
		},
		data(){
			return {
				legendArr: [],
				myChart: {},
				name: '环形图',

				choose_day: "",
			}
		},
		methods:{
			init_pie:function(){
				this.choose_day = this.dayTime[0]
			},

			my_init() {
				this.legendArr = this.myChart.getOption().series
				this.legendArr.forEach((data) => {
					data.selected = true;
				})
				this.$root.charts.push(this.myChart)
				window.addEventListener('resize', function() {
					this.myChart.resize()
				}.bind(this))
			},
			line_echart_init_test:function( total,data ){
				let rich =  {
				    yellow: {
				        color: "auto",
				        fontSize: 18,
				        align: 'center',
				        padding: [4,0]
				    },
				    yellow_hide: {
				        color: "auto",
				        fontSize: 30,
				        fontWeight: 'bold',
				        align: 'center',
				        padding: [4,0]
				    },
				    white: {
				        color: "auto",
				        align: 'center',
				        fontSize: 25,
				        padding: [0,1]
				    },
				    white_hide: {
				        color: "auto",
				        align: 'center',
				        fontSize: 40,
				        fontWeight: 'bold',
				        padding: [0,1]
				    },
				    hr: {
				        borderColor: '#0b5263',
				        width: '100%',
				        borderWidth: 1,
				        height: 0,
				    }
				}
				let option = {
					title: {
				        text: total,
				        subtext: '总人流量',
				        left:'center',
				        top:'43%',
				        // padding:[24,0],
				        textStyle:{
				            color:'#ffffff',
				            fontSize:40,
				            align:'center'
				        },
				        subtextStyle:{
				        	color:'#ffffff',
				        	fontSize:24,
				        	align:'center',
				        },
				    },
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    // 图例
				    legend: {
				        data: this.fname,
				        textStyle:{
				        	color: '#02BF73',
				        	fontSize: 16,
				        },
				        orient: 'vertical',// 'horizontal' | 'vertical' 水平布局|垂直布局

				        // 图例位置
				        x: 20,
				        y: 'center',
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,

				        // backgroundColor: 'rgba(0,0,0,0.3)',

				        // 内边距
				        padding: 10,

				        icon:'pie',
				    },
				    toolbox: {
				        show : true,
				        orient : 'vertical', // 垂直显示
		                x: 'right', 
		                // y: 'center',
				        feature : {
				            mark : {show: true},
				            dataView : {show: false, readOnly: false},
				            // 图形切换无法生效
				            magicType : { 
				                show: true, 
				                type: ['pie', 'funnel'],
				                option: {
				                    funnel: {
				                        x: '25%',
				                        width: '50%',
				                        funnelAlign: 'center',
				                        max: 1548
				                    }
				                }
				            },
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : false, // 拖拽重计算特性
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: ['#60C4A8','#85D3DD','#189A75','#54CCCA','#056160'], // 线条颜色

					series : [
				        {
				            name:'人流量统计',
				            type:'pie',
				            radius : ['50%', '65%'],
				            animation: false,
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : true,
				                        position: 'outside',
				                        formatter: function(a){
				                        	return '{white|' + a.data.value + '}\n{hr|}\n{yellow|' + a.percent + '%}'
				                        },
				                        rich: rich,
				                    },
				                    labelLine : {
				                        show : true,
				                        length: 40,
				                    },

				                },
				                emphasis : {
				                    label : {
				                        show : true,
				                        position : 'outside',
				                        formatter: function(a){
				                        	return '{white_hide|' + a.data.value + '}\n{hr|}\n{yellow_hide|' + a.percent + '%}'
				                        },
				                        rich: rich,
				                    }
				                }
				            },
				            data: data,
				        }
				    ],
				}
                    
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			this.myChart = echarts.init(document.querySelector('.pie1 .main'))

			// console.log(this.dayTime)
			this.init_pie()

			// this.line_echart_init()
			// this.line_echart_init_test()
		},
		watch:{
			'choose_day':function(newval,old){
				let index = this.dayTime.indexOf(newval)
				let data = [], total = 0
				// console.log(this.showData.length)
				for( let i = 0; i < this.showData.length; i++){
					data.push(
						{
							value : this.showData[i][index],
							name : this.fname[i]
						}
					)
					total = total + data[i].value
				}
				this.line_echart_init_test(total,data)
				this.my_init()

				this.$store.state.dataview_data.choose_day = newval
			},
			'$store.state.dataview_data.choose_day':function(newval,old){
				this.choose_day = newval
			},
			'flag':function(newval,old){
				this.choose_day = this.dayTime[this.dayTime.length-1]

				let index = this.dayTime.indexOf(this.choose_day)
				let data = [], total = 0
				// console.log(this.showData.length)
				for( let i = 0; i < this.showData.length; i++){
					data.push(
						{
							value : this.showData[i][index],
							name : this.fname[i]
						}
					)
					total = total + data[i].value
				}
				this.line_echart_init_test(total,data)
			}
		},
	}
	
</script>


<style scoped>
	.pie1{
		width: 100%;
		height: 100%;
	}
	.main{
		width: 100%;
		height: calc( 100% - 60px );
	}
	.line_head{
		width: 100%;
		height: 60px;
		/*margin-bottom: 10px;*/
		background-color: rgba(0,0,0,0.5);
	}
	.pie_select{
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		margin-right: 20px;
		width: 170px;
		height: 32px;
		font-size: 16px;
		float: right;
 		margin-top: 14px;
		padding: 0px 8px;
		background-color: rgba(225,225,225,0.1);
		border: none;
		color: #cccccc;
		outline: none;
	}
	.pie_option{
		background-color: #34465a ;
  		color: #cccccc;
  		border: none;
  		outline: none;
	}
</style>