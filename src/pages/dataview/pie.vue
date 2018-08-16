<template>
	<div class="pie">
		<div class="line_head"></div>
		<div class="main"></div>
	</div>
</template>


<script>
	import echarts from 'echarts'

	export default{
		data(){
			return {
				legendArr: [],
				myChart: {},
				name: '环形图',
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
			line_echart_init_test:function(){
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
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    // 图例
				    legend: {
				        data:['设备1','设备2','设备3','设备4','设备5'],
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

				    title: {
				        text:'总考生数',
				        left:'center',
				        top:'53%',
				        padding:[24,0],
				        textStyle:{
				            color:'#fff',
				            fontSize:18,
				            align:'center'
				        }
				    },
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
				                        	console.log(a)
				                        	return '{white|' + a.data.value + '}\n{hr|}\n{yellow|' + a.percent + '%}'
				                        },
				                        // textStyle : {
				                        //     fontSize : '20',
				                        //     align: 'center',
				                        //     baseline: 'center',
				                        // },
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
				                        position : 'center',
				                        // textStyle : {
				                        //     fontSize : '30',
				                        // }
				                        formatter: function(a){
				                        	console.log(a)
				                        	return '{white_hide|' + a.data.value + '}\n{hr|}\n{yellow_hide|' + a.percent + '%}'
				                        },
				                        rich: rich,
				                    }
				                }
				            },
				            data:[
				                {value:335, name:'设备1'},
				                {value:310, name:'设备2'},
				                {value:234, name:'设备3'},
				                {value:135, name:'设备4'},
				                {value:1548, name:'设备5'}
				            ]
				        }
				    ],
				}
                    
				this.myChart = echarts.init(document.querySelector('.pie .main'))
				this.myChart.setOption(option)
			},
		},
		mounted(){
			// this.line_echart_init()
			this.line_echart_init_test()
			this.my_init()
		},

	}
	
</script>


<style scoped>
	.pie{
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
</style>