<template>
   <div class="main_box_login">
       <div class="bg_box">
           <video autoplay="autoplay" loop="loop" muted="muted" id="bg_video">
              <source src="../assets/login/login_bg1.mp4" >
                        您的浏览器不支持 video 标签。
           </video>
       </div>
       <div class="main_content">
           <div class="content_box">
                <div class="left_box">
                    <div class="logo">
                        <img src="../assets/logo.png" />
                    </div>
                    <div class="system_name">恩钛AI灵睛系统<span>V 1.0</span></div>
                    <div class="en_name">Anytec AI Smart Eyes</div>
                    <div class="system_text">人员身份鉴定、人员行踪检索<br/></div>
                </div>
                <div class="right_box">
                    <div class="shadow"><img src="../assets/login/shadow.png"/></div>
                    <div  ref="loginForm" class="logo_box">
                        <div class="login_title">
                            <div class="left_title"><p>账号登录</p></div>
                            <div class="right_title"></div>
                        </div>
                        <div class="user_name">
                            <div class="left_icon">
                                <img src="../assets/login/user.png" />
                            </div>
                            <div class="right_input">
                                <!-- <input v-model="user.name" type="text" placeholder="账号" @focus="my_focus('uname')"/> -->
                                <input v-model="user.name" type="text" placeholder="账号"/>
                            </div>
                        </div>
                        <div class="uname_title">{{ warning_uname_msg }}</div>
                        <div class="user_pwd">
                            <div class="left_icon">
                                <img src="../assets/login/pwd.png" />
                            </div>
                            <div class="right_input pwd_inut" @keyup.enter="login">
                                <!-- <input v-model="user.password" :type="pass_type" @focus="my_focus('upass')" id="pwd" placeholder="密码"/> -->
                                <input v-model="user.password" :type="pass_type" id="pwd" placeholder="密码"/>
                            </div>
                            <div class="eyes">
                                <!-- <img :src="imgurl" @click="change_view"/> -->
                                <img :src="imgurl" @click="change_view" v-if="is_eyeopen"/>
                                <img :src="imgurl" v-if="!is_eyeopen" style="cursor: not-allowed;"/>
                            </div>
                        </div>
                        <div class="uname_title">{{ warning_upass_msg }}</div>
                        <div class="remember">
                            <input type="checkbox" :checked="isrem_password" v-model="isrem_password"/>
                            <div class="remember_text">记住密码</div>
                        </div>
                        <div class="logo_input" @click="login">登录</div>
                        <!-- <div class="logo_input" style="background-color: #f0f0f0;cursor: not-allowed;" v-show="!is_pass_to_login">登录</div> -->
                        <div class="xian"></div>
                        <div class="prompt">温馨提示：<br/>如果您已忘记密码，请及时与管理员联系！</div>
                    </div>
                </div>
            </div>
       </div>
       <div class="footer_1">系统版本V1.0 请使用谷歌浏览器登陆平台 建议分辨率：1920*1080 <a target="_blank" href="https://www.google.cn/intl/zh-CN/chrome/">工具下载</a></div>
        <div class="footer_2">Copyright 2017 All Right Reserved 深圳市恩钛控股有限公司 ICP:08118166</div>
   </div>

</template>

<script>
    export default {
        data () {
            return {
                imgurl: require("../assets/login/eyes.png"),
                pass_type: "password",
                user: {
                    name: "",
                    password: "",
                },
                isrem_password: false,
                post_flag: false,

                is_eyeopen: true,
                video_src: "",

                // 正则化
                focus_uname: false,
                warning_uname_msg: "",
                focus_upass: false,
                warning_upass_msg: "",
                is_pass_to_login: false,
            }
        },
        methods: {
            login: function() {
                // if( !this.check_uname(this.user.name) || !this.check_upass(this.user.password) ){
                //     this.warning_info("账户或密码只能输入4~20位字母、数字、下划线")
                //     return ;
                // }
                if ( !this.user.name || !this.user.password){
                    this.$message({
                        type: 'error',
                        message: '账号密码不能为空',
                        showClose: true,
                        center: true
                    })
                    return false
                }
                this.post_to_login()
            },
            change_view:function(){
                if( this.imgurl == require("../assets/login/eyes.png") ){
                    this.imgurl = require("../assets/login/eyes2.png")
                    this.pass_type = "text"
                }else{
                    this.imgurl = require("../assets/login/eyes.png")
                    this.pass_type = "password"
                }
            },
            post_to_login:function(){
                var params = new URLSearchParams()
                params.append("account",this.user.name)
                params.append("upass",this.user.password)
                this.$ajax.post("/user/login",params).then((res) => {
                    if( res.data.status === 0){
                        sessionStorage.setItem("username", res.data.data.uname)
                        sessionStorage.setItem("role", res.data.data.role)
                        // console.log(res.data.data.role)
                        this.$store.dispatch('login', res.data.data)
                        // console.log(this.$store.state.user.role)
                        this.$notify({
                            type: 'success',
                            message: '欢迎你' + res.data.data.uname + '!',
                            duration: 2000,
                            offset: 40,
                        })
                        if( this.isrem_password ){
                            this.setCookie( this.user.name,this.user.password,7 )
                        }else{
                            this.clearCookie()
                        }
                        this.$router.replace('/dataview')
                    }else{
                        this.error_info(res.data.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
            },
            // 消息窗口
            error_info:function(mes){
                this.$message({
                    type: 'error',
                    message: mes,
                    showClose: true,
                    center: true
                })
            },
            warning_info:function(mes){
                this.$message({
                    type: 'warning',
                    message: mes,
                    showClose: true,
                    center: true,
                })
            },

            //设置cookie
            setCookie(c_name, c_pwd, exdays) {
                // this.clearCookie()
                let exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "uname" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "upass" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },
            //读取cookie
            getCookie: function() {
                if (document.cookie.length > 0) {
                    let arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (let i = 0; i < arr.length; i++) {
                        let arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'uname') {
                            this.user.name = arr2[1]; //保存到保存数据的地方
                            sessionStorage.setItem("username", this.user.name)
                        } else if (arr2[0] == 'upass') {
                            this.user.password = arr2[1];
                        }
                        this.isrem_password = true
                        this.is_eyeopen = false
                    }
                }
            },
            //清除cookie
            clearCookie: function() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
            },

            // 聚焦
            my_focus:function(model=""){
                if( model === "uname" ){
                    this.focus_uname = true
                    this.check_uname( this.user.name )
                }else if( model === "upass" ){
                    this.focus_upass = true
                    this.check_upass( this.user.password )
                }
            },
            // 输入校验
            check_input:function(input_data){
                let reg = /^[a-zA-Z0-9_]{4,20}$/

                return reg.test(input_data)
            },
            check_uname:function(input_data){
                if( !this.check_input(input_data) ){
                    this.warning_uname_msg = "只能输入4~20位字母、数字、下划线"
                    // this.is_pass_to_login = false
                    return false
                }else{
                    this.warning_uname_msg = ""
                    // this.is_pass_to_login = true
                    return true
                }
            },
            check_upass:function(input_data){
                if( !this.check_input(input_data) ){
                    this.warning_upass_msg = "只能输入4~20位字母、数字、下划线"
                    // this.is_pass_to_login = false
                    return false
                }else{
                    this.warning_upass_msg = ""
                    return true
                }
            },
        },
        mounted(){
            if( this.$store.state.user.username === "" ){
                this.user = {
                    name: "",
                    password: "",
                }
            }
            this.getCookie()
        },
        watch:{
            'user.name':function(newval,old){
                if( this.focus_uname ){
                   this.check_uname(newval)
                }
                
                // console.log("haha")
                if( old ){
                    if( newval != sessionStorage.username ){
                        this.user.password = ""
                        this.is_eyeopen = true
                    }
                }
            },
            'user.password':function(newval,old){
                if( this.focus_upass ){
                    this.check_upass(newval)
                }
            }
        }
    }

</script>

<style scoped>
    @import "../css/login.css";
</style>