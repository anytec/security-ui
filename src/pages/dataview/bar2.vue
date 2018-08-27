<template>
	<div class="bar2">
		<div class="line_head">
			<div class="pie_title">性别比重图</div>
		</div>
		<div class="main"></div>
	</div>
</template>


<script>
	import echarts from 'echarts'

	export default{
		props: {
			maleNum: Array,
			femaleNum: Array,
			ageGroupList: Array,
		},
		data(){
			return {
				myChart: {},
				// data:{
				// 	yAxis:[ "0 ~ 10","10 ~ 20","20 ~ 30","30 ~ 40","40 ~ 50","50 ~ 60","60 ~ 70" ],
				// 	maleNum: [320, 302, 341, 374, 390, 450, 420],
				// 	femaleNum: [-120, -132, -101, -134, -190, -230, -210],
				// },
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
			line_echart_init:function( mydata ){
				let option = {
					tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        },
				        formatter:function(data){
				        	// console.log(data)
				        	let show_data = data[0].name + "<br/>"
				        	for( let i = 0; i < data.length; i++ ){
				        		if( i === 1 ){
				        			show_data = show_data + data[i].marker + data[i].seriesName + ": " + data[i].data*-1 + "人"
				        		}else{
				        			show_data = show_data + data[i].marker + data[i].seriesName + ": " + data[i].data + "人<br/>"
				        		}
				        	}
				        	return show_data
				        }
				    },
				    legend: {
				        data:['男', '女'],
				        textStyle:{
				        	color: 'auto',
				        	fontSize: 16,
				        },
				        // 图例位置
				        x: 'center',
				        y: 15,
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,

				        // 内边距
				        padding: 10,
				    },
				    calculable : false,
				    xAxis : [
				        {
				            type : 'value',
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
		            			formatter:function(params){
		            				if( params < 0 ){
		            					return params * -1
		            				}else{
		            					return params
		            				}
		            			}
				            }, // 字体设置
				            splitLine:{
				            	show: true,
				            	lineStyle:{
				            		color: ['rgba(0, 255, 0, 0.2)'],
				            		type: 'dotted',
				            	},	
				            },
				            axisTick:{
				            	show: false,
				            },
				        }
				    ],
				    yAxis : [
				        {
				            type : 'category',
				            data : mydata.yAxis,
				            axisLine:{
				            	show: false,
				            	lineStyle: {
				            		color: '#02BF73',
				            	},
				            },
				            axisLabel:{
				            	textStyle:{
		            				color: '#02BF73',
		            				fontSize: 16,
		            			},
				            },
				            splitLine:{
				            	show: false,
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
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: ['#60C4A8','#189A75','#85D3DD','#54CCCA','#056160'], // 线条颜色
				    series : [
				        {
				            name:'男',
				            type:'bar',
				            stack: '总量',
				            itemStyle: {normal: {
				                label : {show: true}
				            }},
				            barWidth: '30',
				            data: mydata.maleNum,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'right',
				                    formatter: function(params) {
				                    	// console.log(params)
				                    	if( params.data === 0 ){
			            					// return ""
			            				}
				                        return params.data
				                    },
				                    textStyle:{
				                		fontSize: 16,
				                	},
				                },
				                emphasis: {
				                	textStyle:{
				                		fontSize: 40,
				                	}
				                },
				            },
				        },
				        {
				            name:'女',
				            type:'bar',
				            stack: '总量',
				            itemStyle: {normal: {
				                label : {show: true, position: 'left'}
				            }},
				            barWidth: '30',
				            data: mydata.femaleNum,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'left',
				                    formatter: function(params) {
				                    	if( params.data === 0 ){
			            					// return ""
			            				}
				                        return params.data * -1;
				                    },
				                    textStyle:{
				                		fontSize: 16,
				                	},
				                },
				                emphasis: {
				                	textStyle:{
				                		fontSize: 40,
				                	}
				                },
				            },
				        }
				    ]
				}

				this.myChart = echarts.init(document.querySelector('.bar2 .main'))
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.bar2 .main'))
			// this.line_echart_init( this.data )
			// this.line_echart_init( this.genderAgeData )
			// this.my_init()
			// console.log(this.genderAgeData)
		},
		watch:{
			'maleNum':function(newval,old){
				// let ageGroupList = []
				// let maleNum = []
				// let femaleNum = []
				// for( let i = 0; i < this.maleNum.length; i++ ){
				// 	if( this.maleNum[i] != 0 || this.femaleNum[i] != 0 ){
				// 		ageGroupList.push( this.ageGroupList[i] )
				// 		maleNum.push( this.maleNum[i] )
				// 		femaleNum.push( this.femaleNum[i] )
				// 	}
				// }
				let mydata = {
					yAxis: ["儿童","青年","中年","老年"],
					maleNum: this.maleNum,
					femaleNum: this.femaleNum,
				}
				this.line_echart_init( mydata )
				this.my_init()
			}
		}
	}
	
</script>


<style scoped>
	.bar2{
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
	.pie_title{
         width: 300px;
         height: 60px;
         line-height: 60px;
         color: #cccccc;
         font-size: 20px;
         margin-left: 20px;
	}
</style>