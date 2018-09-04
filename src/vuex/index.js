import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 全局变量
    state: {
        token: true,
        user: {
            username: "",
        },
        is_search_data: false,
        is_search_data_facepath: false,
        search_data: {},
        is_add_data: false,
        add_data: null,

        // facepath: [[114.05791,22.543526],[114.059648,22.543665],[114.063725,22.541297]],
        facepath_search_data:{ 
            cameraGroupIds: [],
            cameraIds: [],
            allcamera_list:[],
        },

        realtime_data:{
            sdkId: null,
            video_names: null,
            groupNames: null,
        },

        facepath_data:{
            photo: "",
        },
        facepath_model: "online",

        
        color: ['#1B68CC','#6383EE','#00E4EC','#005039','#189A75'],
        color1: ['#54CCCA','#1CA5AF','#00585E','#1B68CC','#02BF73','#00E4EC','#005039','#189A75'],
        color2: ['#60C4A8','#85D3DD','#189A75','#54CCCA','#056160'],
        text_color: '#02BF73',
        dataview_data:{
            choose_day: null,
            update_flag1: false,
            update_flag2: false,
            update_flag3: false,
        },
        timer_num: null,
    },
    // 修改全局变量必须通过mutations中的方法
    // mutations只能采用同步方法
    mutations: {
        login (state, payload) {
            state.user = payload
        },
        logout (state) {
            sessionStorage.setItem("username","");
            state.user = {username:""}
        },
        page1_change(state,change_num){
            console.log("state = " + change_num)
            state.page1.active_num = change_num
        }
    },
    // 异步方法用actions
    // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
    actions: {
        login (context, payload) {
            context.commit('login', payload)
        },
        logout (context) {
            context.commit('logout')
        }
    }
})

export default store