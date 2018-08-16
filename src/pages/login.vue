<template>

   <div class="main_box">
       <div class="main_content">
           <div class="content_box">
                <div class="left_box">
                    <div class="logo">
                        <img src="../assets/logo.png" />
                    </div>
                    <div class="system_name">恩钛人脸识别系统<span>V 1.0</span></div>
                    <div class="en_name">Face recognition system by Anytec</div>
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
                                <input v-model="user.name" type="text" placeholder="用户名"/>
                            </div>
                        </div>
                        <div class="user_pwd">
                            <div class="left_icon">
                                <img src="../assets/login/pwd.png" />
                            </div>
                            <div class="right_input pwd_inut">
                                <input v-model="user.password" :type="pass_type" id="pwd" placeholder="密码"/>
                            </div>
                            <div class="eyes">
                                <img :src="imgurl" @click="change_view"/>
                            </div>
                        </div>
                        <div class="remember">
                            <input type="checkbox" :checked="isrem_password" v-model="isrem_password"/>
                            <div class="remember_text">记住密码</div>
                        </div>
                        <div class="logo_input" @click="login">登录</div>
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
                user: {},
                isrem_password: false,
                post_flag: false,
            }
        },
        methods: {
            login: function() {
                if ( !this.user.name || !this.user.password){
                    this.$message({
                        type: 'error',
                        message: '账号密码不能为空',
                        showClose: true,
                        center: true
                    })
                    // console.log("账号密码不能为空")
                    return false
                }
                // this.post_to_login()
                if( true ){
                    this.$store.dispatch('login', this.user).then(() => {
                        this.$notify({
                            type: 'success',
                            title: '欢迎你,' + this.user.name + '!',
                            duration: 3000
                        })
                        this.$router.push('/dataview')
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: '网络连接出错',
                        showClose: true,
                        center: true
                    })
                }
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
                params.append("name",this.user.name)
                params.append("password",this.user.password)
                params.append("isrem_password",this.isrem_password)
                this.$ajax.post("login",params).then((res) => {
                    if(res.data.error){
                        this.$message({
                            type: 'error',
                            message: '用户名或密码错误',
                            showClose: true,
                            center: true
                        })
                        return false
                    }else{
                        this.$store.dispatch('login', this.user).then(() => {
                            this.$notify({
                                type: 'success',
                                title: '欢迎你,' + this.user.name + '!',
                                duration: 3000
                            })
                            this.$router.push('/list')
                        })
                        return true
                    }
                }).catch((error) => {
                    this.$message({
                        type: 'error',
                        message: '网络连接出错',
                        showClose: true,
                        center: true
                    })
                    return false
                })
            },
            get_login_data:function(){
                this.$ajax.get("login").then((res) => {
                    if( res.data["isrem_password"]){
                        this.user.name = res.data["rem_name"]
                        this.user.password = res.data["rem_password"]
                        this.isrem_password = true
                        // console.log("get success!")
                    }
                })
            }
        },
        created:function(){
            // window.document.title = "登录"
            // this.get_login_data()
        }
    }
</script>

<style scoped>
    @import "../css/login.css";
</style>