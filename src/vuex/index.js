import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 全局变量
    state: {
        token: true,
        user: undefined,
        is_search_data: false,
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
        dataview_data:{
            choose_day: null,
        }
    },
    // 修改全局变量必须通过mutations中的方法
    // mutations只能采用同步方法
    mutations: {
        login (state, payload) {
            state.user = payload
        },
        logout (state) {
            state.user = undefined
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