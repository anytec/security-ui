import Vue from 'vue'
import axios  from 'axios'

// axios.defaults.baseURL="http://192.168.10.174:8090" //url的设置
// axios.defaults.baseURL="http://192.168.10.155:8080"
// axios.defaults.baseURL = "http://192.168.10.158:9999"
Vue.prototype.$ajax = axios
