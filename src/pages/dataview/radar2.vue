<template>
	<div class="radar2">
		<div class="line_head"></div>
		<div class="main"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'

	export default {
		props:{
			emotionsData: Array,
		},
		data(){
			return {
				myChart: {},
				max: 100,
				data: [[50, 50, 50, 50, 50, 50, 50],[30, 60, 55, 60, 70, 80, 20]]
			}
		},
		methods:{
			my_init() {
				this.legendArr = this.myChart.getOption().series
				this.legendArr.forEach((data) => {
					data.selected = true;
				})
				// this.$root.charts.push(this.myChart)
				window.addEventListener('resize', function() {
					this.myChart.resize()
				}.bind(this))
			},
			line_echart_init:function( mydata ){
				// let imgPath = ['http://bmob-cdn-15355.b0.upaiyun.com/2017/12/01/bee4341c4089af7980b87074a77479ad.png']
				let option = {
					backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: ['rgba(255,255,255,0.2)','rgba(255,255,255,0.2)'], // 线条颜色
				    // 图例
				    legend: {
				        data: ['显性情绪', '隐性情绪'],
				        textStyle:{
				        	color: 'auto',
				        	fontSize: 16,
				        },
				        orient: 'vertical',// 'horizontal' | 'vertical' 水平布局|垂直布局

				        // 图例位置
				        x: '75%',
				        y: '70%',
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,
				        // backgroundColor: 'rgba(0,0,0,0.3)',

				        // 内边距
				        padding: 10,

				        icon:'circle',
				    },
				    radar: [{
				        indicator: [
					        {
					            text: '伤心',
					            max: this.max,
					        },
					        {
					            text: '快乐',
					            max: this.max,
					        },
					        {
					            text: '惊讶',
					            max: this.max,
					        },
					        {
					            text: '害怕',
					            max: this.max,
					        },
					        {
					            text: '生气',
					            max: this.max,
					        },
					        {
					            text: '嫌弃',
					            max: this.max,
					        },
				        ],
				        center: ['50%', '50%'],
				        radius: 150,
				        startAngle: 90,
				        splitNumber: 4,
				        shape: 'circle',

				        // 指标设置 
				        nameGap : 30, // 指标字距离图的距离
				        name: {
				            formatter: '{value}',
				            textStyle: {
				                fontSize: 24,
				                color: '#ffffff'
				            }
				        },
				        splitArea: {
				            areaStyle: {
				                color: [
				                    'rgba(0, 0, 0, 0.0)',
				                    'rgba(0, 0, 0, 0.2)',
				                    'rgba(0, 0, 0, 0.0)',
				                    'rgba(0, 0, 0, 0.1)',
				                ],
				            }
				        },
				        // 经度线
				        axisLine: {
				            lineStyle: {
				                color: 'rgba(255,255,255,0.1)'
				            }
				        },
				        // 纬度线
				        splitLine: {
				            lineStyle: {
				                color: 'rgba(255,255,255,0.1)',
				            }
				        }
				    }, ],
				    series: [{
				        name: '雷达图',
				        type: 'radar',
				        itemStyle: {
				            emphasis: {
				                lineStyle: {
				                    width: 4
				                }
				            }
				        },
				        data: [
					        {
					            name: '隐性情绪',
					            value: mydata[1],
					            symbolSize: 0,
					            itemStyle: {
					                normal: {
					                    borderColor: 'rgba(19, 173, 255, 1)',
					                    borderWidth: 0,
					                }
					            },
					            areaStyle: {
					            	normal: {
					                    color: 'rgba(0, 200, 100, 0.2)' // 默认背景色
					                },
					                emphasis: {
						                color: 'rgba(20, 170, 180, 0.4)' // 鼠标移入背景色
						            }
					            },
					            lineStyle: {
					                normal: {
					                    opacity: 0.5
					                }
					            }
					        },
					        {
					            name: '显性情绪',
					            value: mydata[0],
					            areaStyle: {
						            normal: {
					                    color: 'rgba(10, 170, 100, 0.5)'
					                },
					                emphasis: {
						                color: 'rgba(20, 170, 180, 0.8)' // 鼠标移入背景色
						            },
					            },
					            symbolSize: 0,
					            itemStyle: {
					                normal: {
					                    borderColor: 'rgba(255, 0, 0, 0.2)', // 点的颜色
					                    borderWidth: 0, // 点的大小
					                }
					            },
					            lineStyle: {
					                normal: {
					                    opacity: 0.5,
					                    color: 'rgba(0,0,0,0)'
					                }
					            }
					        },
				        ]
				    }, ]
				}

				this.myChart.setOption(option,true)
			}
		},
		mounted(){
			this.myChart = echarts.init(document.querySelector('.radar2 .main'))

			// console.log(this.emotionsData[0])
			// this.max = Math.max.apply(null, this.emotionsData[0])
			// if( Math.max.apply(null, this.emotionsData[1]) > this.max ){
			// 	this.max = Math.max.apply(null, this.emotionsData[1])
			// }
			// // this.line_echart_init( this.emotionsData )
			// this.line_echart_init(  )
			// this.my_init()
		},
		watch:{
			'emotionsData':function(newval,old){
				this.max = Math.max.apply(null, this.emotionsData[0])
				if( Math.max.apply(null, this.emotionsData[1]) > this.max ){
					this.max = Math.max.apply(null, this.emotionsData[1])
				}
				this.line_echart_init( this.emotionsData )
				this.my_init()
			}
		}
	}

</script>

<style scoped>
	.radar2{
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
	/*.pie_select{
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
	}*/
</style>