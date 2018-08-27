<template>
	<div class="pie2">
		<div class="line_head">
			<div class="pie_title">年龄比重图</div>
		</div>
		<div class="main"></div>
	</div>
</template>


<script>
	import echarts from 'echarts'

	export default{
		props:{
			ageGroupList: Array,
			genderData: Array,
			AgeGengerData: Array,
		},
		data(){
			return {
				legendArr: [],
				myChart: {},
				name: '环形图',

				// genderData:[
	   //              {value:335, name:'男'},
	   //              {value:679, name:'女'},
	   //          ],
	   //          AgeGengerData:[
	   //              {value:0, name:'0 ~ 10'},
	   //              {value:310, name:'10 ~ 20'},
	   //              {value:234, name:'20 ~ 30'},
	   //              {value:135, name:'30 ~ 40'},
	   //              {value:104, name:'40 ~ 50'},
	   //              {value:251, name:'50 ~ 60'},
	   //              {value:147, name:'60 ~ 70'},
	   //              {value:102, name:'70 ~ 80'},
	   //              {value:0, name:'80 ~ 90'},
	   //          ],
	            // ageGroupList:[ "0 ~ 10","10 ~ 20","20 ~ 30","30 ~ 40","40 ~ 50","50 ~ 60","60 ~ 70","70 ~ 80","80 ~ 90" ],
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
				        borderColor: 'auto',
				        width: '100%',
				        borderWidth: 1,
				        height: 0,
				    }
				}
				let option = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}人 ({d}%)",
				        textStyle:{	
				        	fontSize: 20,
				        }
				    },
				    legend: {
				        orient : 'vertical',
				        x : 'left',
				        data: mydata.yAxis,
				        // 图例位置
				        x: 20,
				        y: 'center',
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,
				        // 内边距
				        padding: 10,

				        textStyle:{
				        	color: 'auto',
				        	fontSize: 20,
				        },
				    }, 
				    toolbox: {
				        show : true,
				        feature : {
				            mark : {show: false},
				            dataView : {show: false, readOnly: false},
				            restore : {show: false},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : false,
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: ['#60C4A8','#189A75','#85D3DD','#54CCCA','#056160'], // 线条颜色
				    series : [
				        {
				            name:'性别',
				            type:'pie',
				            selectedMode: 'single',
				            radius : [0, 70],
				            
				            // for funnel
				            x: '20%',
				            width: '40%',
				            funnelAlign: 'right',
				            max: 1548,
				            
				            itemStyle : {
				                normal : {
				                    label : {
				                        position : 'inner',
				                        textStyle:{
				                        	fontSize: 20,
				                        	fontWeight: 'bold',
				                        }
				                    },
				                    labelLine : {
				                        show : false
				                    }
				                }
				            },
				            data: mydata.genderData,
				        },
				        {
				            name:'抓拍量',
				            type:'pie',
				            radius : [100, 140],
				            
				            // for funnel
				            x: '60%',
				            width: '35%',
				            funnelAlign: 'left',
				            // max: 1048,
				            
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : true,
				                        position: 'outside',
				                        formatter: function(a){
				                        	if( a.data.value != 0 ){
				                        		return '{white|' + a.name + '}'
				                        	}else{
				                        		return a.name + ''
				                        	}
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
				                        	return '{white_hide|' + a.percent + '%}\n{hr|}\n{yellow_hide|' + a.name + '}'
				                        },
				                        rich: rich,
				                    }
				                }
				            },

				            data: mydata.AgeGengerData
				        }
				    ]
				}
                this.myChart = echarts.init(document.querySelector('.pie2 .main'))
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.pie2 .main'))
		},
		watch:{
			'genderData':function(newval,old){
				let mydata = {}
				let yAxis = []
				let age_items = ["儿童","青年","中年","老年"]
				mydata.genderData = [
					{value:this.genderData[0], name:'男'},
	                {value:this.genderData[1], name:'女'},
				]
				mydata.AgeGengerData = []
				for( let i = 0; i < this.AgeGengerData.length; i++ ){
					if( this.AgeGengerData[i] != 0 ){
						mydata.AgeGengerData.push( {value:this.AgeGengerData[i], name:age_items[i]} )
						yAxis.push(age_items[i])
					}
				}
				mydata.yAxis = yAxis
				
				this.line_echart_init( mydata )
				this.my_init()
			},
		},
	}
	
</script>


<style scoped>
	.pie2{
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