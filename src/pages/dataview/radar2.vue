<template>
	<div class="radar2">
		<div class="line_head">
			<div class="pie_title">情绪雷达图</div>
		</div>
		<div class="main" v-if="emotionsData.length || neutralData.length"></div>
        <div class="main_ch" v-else-if="$store.state.dataview2_flag">
        	<div class="main_loading">
				<div class="main_table">
					<div class="main_cell">
						<div class="spinner">
							<div class="rect1"></div>
							<div class="rect2"></div>
							<div class="rect3"></div>
							<div class="rect4"></div>
							<div class="rect5"></div>
						</div>
					</div>
				</div>
			</div>
        </div>
        <div class="main_ch" v-else>
            <div class="main_text">
                <div class="main_table">
                    <div class="main_cell">
                        -- 暂无数据 --
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	import echarts from 'echarts'

	export default {
		props: {
			emotionsData: Array,
			neutralData: Array,
		},
		data() {
			return {
				myChart: {},
				max: 100,
				data: [
					[50, 50, 50, 50, 50, 50, 50],
					[30, 60, 55, 60, 70, 80, 20]
				]
			}
		},
		methods: {
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
			line_echart_init: function(mydata, neutralData) {
				// let imgPath = ['http://bmob-cdn-15355.b0.upaiyun.com/2017/12/01/bee4341c4089af7980b87074a77479ad.png']
				let show_data = '常态： ' + neutralData[0] + '    ' + neutralData[1] + '\n\n' +
					'快乐： ' + mydata[0][1] + '    ' + mydata[1][1] + '\n\n' +
					'惊讶： ' + mydata[0][2] + '    ' + mydata[1][2] + '\n\n' +
					'害怕： ' + mydata[0][3] + '    ' + mydata[1][3] + '\n\n' +
					'生气： ' + mydata[0][4] + '    ' + mydata[1][4] + '\n\n' +
					'嫌弃： ' + mydata[0][5] + '    ' + mydata[1][5]
				let option = {
					backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
					color: ['rgba(0, 200, 100, 0.2)', 'rgba(10, 170, 100, 0.5)'], // 线条颜色
					// title: {
					//     text: '情绪 -> 显性 -> 隐性',
					//     subtext: show_data,
					//     left:'10px',
					//     top:'10px',
					//     backgroundColor: 'rgba(0,0,0,0.1)',
					//     // padding:[24,0],
					//     textStyle:{
					//         color:'#ffffff',
					//         fontSize:20,
					//         align:'center'
					//     },
					//     subtextStyle:{
					//     	color:'#ffffff',
					//     	fontSize:18,
					//     	// align:'center',
					//     },
					// },
					// 图例
					legend: {
						icon: 'rect',
						data: ['显性情绪', '隐性情绪'],
						textStyle: {
							color: '#ffffff',
							fontSize: 16,
						},
						orient: 'vertical', // 'horizontal' | 'vertical' 水平布局|垂直布局

						// 图例位置
						x: '75%',
						y: '70%',
						itemWidth: 25,
						itemHeight: 10,
						itemGap: 20,
						// backgroundColor: 'rgba(0,0,0,0.3)',

						// 内边距
						padding: 10,

						// icon:'circle',
					},
					toolbox: {
						x: '1150px',
						show: true,
						feature: {
							mark: {
								show: false
							},
							dataView: {
								show: false,
								readOnly: false
							},
							restore: {
								show: false
							},
							saveAsImage: {
								show: true
							}
						}
					},
					radar: [{
						indicator: [{
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
						nameGap: 30, // 指标字距离图的距离
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
						data: [{
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

				this.myChart = echarts.init(document.querySelector('.radar2 .main'))
				this.myChart.setOption(option, true)
			}
		},
		mounted() {
			// this.myChart = echarts.init(document.querySelector('.radar2 .main'))

			// console.log(this.emotionsData[0])
			// this.max = Math.max.apply(null, this.emotionsData[0])
			// if( Math.max.apply(null, this.emotionsData[1]) > this.max ){
			// 	this.max = Math.max.apply(null, this.emotionsData[1])
			// }
			// // this.line_echart_init( this.emotionsData )
			// this.line_echart_init(  )
			// this.my_init()
		},
		watch: {
			'emotionsData': function(newval, old) {
				this.max = Math.max.apply(null, this.emotionsData[0])
				if(Math.max.apply(null, this.emotionsData[1]) > this.max) {
					this.max = Math.max.apply(null, this.emotionsData[1])
				}

				// this.line_echart_init( this.emotionsData, this.neutralData )
				// this.my_init()
				this.$nextTick(function() {
					this.line_echart_init(this.emotionsData, this.neutralData)
					this.my_init()
				});
			}
		}
	}
</script>

<style scoped>
	.radar2 {
		width: 100%;
		height: 100%;
	}
	
	.main {
		width: 100%;
		height: calc( 100% - 60px);
	}
	
	.line_head {
		width: 100%;
		height: 60px;
		/*margin-bottom: 10px;*/
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.pie_title {
		width: 300px;
		height: 60px;
		line-height: 60px;
		color: #cccccc;
		font-size: 20px;
		margin-left: 20px;
		float: left;
	}

</style>
