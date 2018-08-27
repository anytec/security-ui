<template>
	<div class="line1">
		<div class="line_head">
			<div class="pie_title">时段人流量统计图</div>
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
			dayTime:Array,
			flag: Boolean,
		},
		data(){
			return {
				legendArr: [],
				// color: this.$store.state.color,
				myChart: {},
				name: '折线图',

				choose_day: null,
			}
		},
		methods:{
			init_line:function(){
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
			line_echart_init:function(){
				this.myChart = echarts.init(document.querySelector('.line1 .main'))
				this.myChart.setOption(
					{
						baseOption:{
							timeline: {
			                    //loop: false,        
			                    axisType: 'category',
			                    show: true,
			                    autoPlay: true,
			                    playInterval: 1500, // 切换时间
			                    padding: 15,
			                    data: ['昨天', '今天'] , // 时间轴数据
			                    // controlPosition: 'right', 
			                    x: '7%',
			                    x2: '7%',
			                },
			                grid:{
			                	y: 100,
			                    y2: 100,
			                },
							tooltip : {
						        trigger: 'axis'
						    },
						    // 图例
						    legend: {
						        data:['设备设备设备设备设备','设备2','设备3','设备4','设备5'],
						        textStyle:{
						        	color: '#02BF73',
						        	fontSize: 16,
						        },
						        orient: 'horizontal',// 'horizontal' | 'vertical' 水平布局|垂直布局

						        // 图例位置
						        x: 'center',
						        y: 20,
						        itemWidth: 25,
						        itemHeight: 10,
						        itemGap: 20,

						        // backgroundColor: 'rgba(0,0,0,0.3)',

						        // 内边距
						        padding: 10,
						    },
						    toolbox: {
						        show : true,
						        orient : 'vertical',
				                x: 'right', 
				                // y: 'center',
						        feature : {
						            mark : {show: true}, // 
						            dataView : {show: false, readOnly: false},
						            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						            restore : {show: true},
						            saveAsImage : {show: true}
						        }
						    },
						    calculable : false, // 拖拽重计算特性
						    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
						    color: ['#60C4A8','#85D3DD','#189A75','#54CCCA','#056160'], // 线条颜色
						    xAxis : [
						        {
						        	name : '时间', 
						            type : 'category',
						            boundaryGap : false,
						            data : ['08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00','2:00','4:00','6:00','8:00'],
						            axisLine:{
						            	lineStyle: {
						            		color: '#02BF73',
						            		type: 'dashed',
						            	},
						            }, // 线条设置
						            axisLabel:{
						            	textStyle:{
				            				color: '#02BF73',
				            			},
						            }, // 字体设置
						            splitLine:{
						            	show: false,
						            },
						            axisTick:{
						            	show: false,
						            }
						        }
						    ],
						    yAxis : [
						        {
						            type : 'value',
						            axisLine:{
						            	show: false,
						            	lineStyle: {
						            		color: '#02BF73',
						            	},
						            },
						            axisLabel:{
						            	textStyle:{
				            				color: '#02BF73',
				            			},
						            },
						            splitLine:{
						            	show: true,
						            	lineStyle:{
						            		color: ['rgba(0, 255, 0, 0.2)'],
						            		type: 'dotted',
						            	},
						            },
						            axisTick:{
						            	show: false,
						            }
						        }
						    ]
						},
						options:[
							{
								series : [
							        {
							            name:'设备设备设备设备设备',
							            type:'line',
							            stack: '总量',
							            data:[10, 20, 100, 50, 20, 120, 135, 70, 40, 5, 10, 20, 50]
							        },
							        {
							            name:'设备2',
							            type:'line',
							            stack: '总量',
							            data:[15, 25, 110, 60, 10, 100, 155, 60, 50, 15, 20, 25, 40]
							        },
							        {
							            name:'设备3',
							            type:'line',
							            stack: '总量',
							            data:[5, 15, 120, 50, 15, 130, 105, 40, 60, 5, 10, 35, 60]
							        },
							        {
							            name:'设备4',
							            type:'line',
							            stack: '总量',
							            data:[25, 35, 100, 50, 25, 150, 125, 30, 80, 15, 15, 25, 30]
							        },
							        {
							            name:'设备5',
							            type:'line',
							            stack: '总量',
							            data:[5, 25, 120, 40, 15, 135, 145, 20, 70, 25, 10, 20, 35]
							        }
							    ]
							},
							{
								series : [
							        {
							            name:'设备1',
							            type:'line',
							            stack: '总量',
							            data:[10, 20, 10, 150, 20, 120, 15, 170, 40, 5, 10, 20, 50]
							        },
							        {
							            name:'设备2',
							            type:'line',
							            stack: '总量',
							            data:[15, 25, 10, 160, 10, 100, 15, 160, 50, 15, 20, 25, 40]
							        },
							        {
							            name:'设备3',
							            type:'line',
							            stack: '总量',
							            data:[5, 15, 10, 150, 15, 130, 15, 140, 60, 5, 10, 35, 60]
							        },
							        {
							            name:'设备4',
							            type:'line',
							            stack: '总量',
							            data:[25, 35, 10, 150, 25, 150, 15, 130, 80, 15, 15, 25, 30]
							        },
							        {
							            name:'设备5',
							            type:'line',
							            stack: '总量',
							            data:[5, 25, 10, 140, 15, 135, 15, 120, 70, 25, 10, 20, 35]
							        }
							    ]
							}
						]
					    
					}
				)
				this.myChart.on('click', (params) => {
				    console.log(params.componentType)
				    if( params.componentType === 'timeline' ){
				    	this.myChart.dispatchAction({
						    type: 'timelinePlayChange',
						    // 播放状态，true 为自动播放
						    playState: false
						})
				    }
				    
				});
			},
			line_echart_init_test:function(  data ){
				let option = {
	                grid:{
	                	y: 100,
	                    y2: 100,
	                },
					tooltip : {
				        trigger: 'axis'
				    },
				    // 图例
				    legend: {
				        data: this.fname,
				        textStyle:{
				        	color: '#02BF73',
				        	fontSize: 16,
				        },
				        orient: 'horizontal',// 'horizontal' | 'vertical' 水平布局|垂直布局

				        // 图例位置
				        x: 'center',
				        y: 20,
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,

				        // backgroundColor: 'rgba(0,0,0,0.3)',

				        // 内边距
				        padding: 10,
				    },
				    toolbox: {
				        show : true,
				        // orient : 'vertical', // 垂直显示
		                x: 'right', 
		                // y: 'center',
				        feature : {
				            mark : {show: true}, // 
				            dataView : {show: false, readOnly: false},
				            magicType : {
				            	show: true, 
				            	type: ['line', 'bar', 'stack', 'tiled'],
				            },
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : false, // 拖拽重计算特性
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: ['#60C4A8','#85D3DD','#189A75','#54CCCA','#056160'], // 线条颜色
				    xAxis : [
				        {
				        	name : '时间', 
				            type : 'category',
				            boundaryGap : false,
				            data : ['00:00','2:00','4:00','6:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
				            axisLine:{
				            	lineStyle: {
				            		color: '#02BF73',
				            		type: 'dashed',
				            	},
				            }, // 线条设置
				            axisLabel:{
				            	textStyle:{
		            				color: '#02BF73',
		            			},
				            }, // 字体设置
				            splitLine:{
				            	show: false,
				            },
				            axisTick:{
				            	show: false,
				            }
				        }
				    ],
				    yAxis : [
				        {
				        	name : '人流量',
				            type : 'value',
				            axisLine:{
				            	show: false,
				            	lineStyle: {
				            		color: '#02BF73',
				            	},
				            },
				            axisLabel:{
				            	textStyle:{
		            				color: '#02BF73',
		            			},
				            },
				            splitLine:{
				            	show: true,
				            	lineStyle:{
				            		color: ['rgba(0, 255, 0, 0.2)'],
				            		type: 'dotted',
				            	},
				            },
				            axisTick:{
				            	show: false,
				            }
				        }
				    ],

				    series: this.series_data( data )
				}

				this.myChart = echarts.init(document.querySelector('.line1 .main'))
				this.myChart.setOption(option,true)
			},

			// 数据组装
			series_data:function( mydata ){
				let data = []
				// console.log(mydata)
				for( let i = 0; i < mydata.length; i++ ){
					data.push(
						{
						    name: this.fname[i],
						    type:'line',
						    stack: this.fname[i],
						    data: mydata[i],
						},
					)
				}
				// console.log(data)
				return data
			}
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.line1 .main'))
			this.init_line()
			// this.line_echart_init()
			// this.line_echart_init_test()

			// console.log(this.fname)
		},
		watch:{
			'choose_day':function(newval,old){
				let index = this.dayTime.indexOf(newval)
				if( index != -1 ){
					this.line_echart_init_test(this.showData[index])
					this.my_init()
				}
				
				this.$store.state.dataview_data.choose_day = newval
			},
			'$store.state.dataview_data.choose_day':function(newval,old){
				this.choose_day = newval
			},
			'flag':function(newval,old){
				this.choose_day = this.dayTime[this.dayTime.length-1]
				let index = this.dayTime.indexOf(this.choose_day)
				if( index != -1 ){
					this.line_echart_init_test(this.showData[index])
					this.my_init()
				}
				
				// this.$store.state.dataview_data.choose_day = newval
			}
		}

	}
	
</script>


<style scoped>
	.line1{
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
	.pie_title{
        width: 300px;
        height: 60px;
        line-height: 60px;
        color: #cccccc;
        font-size: 20px;
        margin-left: 20px;
        float: left;
	}
</style>