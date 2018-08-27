<template>
	<div class="gauge3">
		<div class="line_head">
		</div>
		<div class="main"></div>
	</div>
</template>


<script>
	import echarts from 'echarts'

	export default{
		props: {
			cpuData: Number,
			hardDisk: Number,
			ROM: Number,
		},
		data(){
			return {
				legendArr: [],
				myChart: {},
			}
		},
		methods:{
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

			line_echart_init:function( ){
                let option = {
				    backgroundColor: 'rgba(0,0,0,0.4)',
				    series: [
				    	{
				            name: 'CPU使用率',
				            type: 'gauge',
				            z: 3,
				            min: 0,
				            max: 100,
				            splitNumber: 5,
				            radius: '234.65',
				            center : ['50%', '55%'],
				            axisLine: { // 坐标轴线
				                lineStyle: { // 属性lineStyle控制线条样式
				                    width: 10,
				                    shadowBlur: 50,
				                    color: [
				                        [0.6, '#0da273'],
				                        [0.8, '#60c4a8'],
				                        [1, '#be7000']
				                    ]
				                }
				            },
				            axisTick: { // 坐标轴小标记
				                length: 15, // 属性length控制线长
				                lineStyle: { // 属性lineStyle控制线条样式
				                    color: 'auto'
				                }
				            },
							axisLabel:{
								distance:0
							},
				            splitLine: { // 分隔线
				                length: 20, // 属性length控制线长
				                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				                    color: 'auto'
				                }
				            },
							pointer: {
								width: 5,
								length:'70%'
							},
				            title: {
				            	show: false,
				            },
				            detail: {
				                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#efefef',
				                    padding: [-20, 0, 0, 0],
									fontSize: 30
				                },
				                formatter: function (value) {
				                    return 'CPU ' + value + '%';
				                },
				            },
				            itemStyle: {
				                normal: {
				                    color: "#00f0ff",
				                }
				            },
				            data: [{
				                value: this.cpuData,
				                name: 'CPU'
				            }]
				        },
				        {
				            name: '内存使用率',
				            type: 'gauge',
				            center: ['30%', '65%'], // 默认全局居中
				            radius: '148.2',
				            min: 0,
				            max: 100,
				            endAngle: 45,
				            splitNumber: 5,
				            axisLine: { // 坐标轴线
				                lineStyle: { // 属性lineStyle控制线条样式
				                    width: 8,
				                    shadowBlur: 40,
				                    color: [
				                        [0.6, '#0da273'],
				                        [0.8, '#60c4a8'],
				                        [1, '#be7000']
				                    ]
				                }
				            },
				            axisTick: { // 坐标轴小标记
				                length: 12, // 属性length控制线长
				                lineStyle: { // 属性lineStyle控制线条样式
				                    color: 'auto'
				                }
				            },
							axisLabel:{
								distance:0
							},
				            splitLine: { // 分隔线
				                length: 15, // 属性length控制线长
				                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				                    color: 'auto'
				                }
				            },
				            pointer: {
				            	width: 4,
				            	length:'60%'
				            },
				            title: {
				            	show: false,
				            },
				            detail: {
				                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#efefef',
				                    padding: [-20, 0, 0,20],
				                    fontSize: 24
				                },
				                formatter: function (value) {
				                    return '内存 ' + value + '%';
				                },
				            },
				            itemStyle: {
				                normal: {
				                    color: "#00f0ff",

				                }
				            },
				            data: [{
				                value: this.ROM,
				                name: '内存'
				            }]
				        },
				        {
				            name: '硬盘使用率',
				            type: 'gauge',
				            center: ['70.5%', '65%'], // 默认全局居中
				            radius: '148.2',
				            min: 0,
				            max: 100,
				            startAngle: 140,
				            endAngle: -45,
				            splitNumber: 5,
				            axisLine: { // 坐标轴线
				                lineStyle: { // 属性lineStyle控制线条样式
				                    width: 8,
				                    shadowBlur: 40,
				                    color: [
				                        [0.6, '#0da273'],
				                        [0.8, '#60c4a8'],
				                        [1, '#be7000']
				                    ]
				                }
				            },
				            axisTick: { // 坐标轴小标记
				                length: 12, // 属性length控制线长
				                lineStyle: { // 属性lineStyle控制线条样式
				                    color: 'auto'
				                }
				            },
							axisLabel:{
								distance:0
							},
				            splitLine: { // 分隔线
				                length: 15, // 属性length控制线长
				                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				                    color: 'auto'
				                }
				            },
				            pointer: {
				                width: 4,
								length:'60%'
				            },
				            title: {
				            	show: false,
				            },

				            detail: {
				                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#efefef',
				                    padding: [-20, 20, 0, 0],
				                    fontSize: 24
				                },
				                formatter: function (value) {
				                    return '硬盘 ' + value + '%';
				                },
				            },
				            itemStyle: {
				                normal: {
				                    color: "#00f0ff",

				                }
				            },
				            data: [{
				                value: this.hardDisk,
				                name: '硬盘'
				            }]
				        }
				    ]
                }
                this.myChart = echarts.init(document.querySelector('.gauge3 .main'))
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.gauge3 .main'))
		},
		watch:{
			'hardDisk':function(newval,old){
				this.line_echart_init()
				this.my_init()
			},
			'cpuData':function(newval,old){
				this.line_echart_init()
				this.my_init()
			},
			'ROM':function(newval,old){
				this.line_echart_init()
				this.my_init()
			}
		},
	}
	
</script>


<style scoped>
	.gauge3{
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