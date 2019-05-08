<template>
    <div id="app" class="app">
        <div class="backdrop"></div>    
        <div v-if="(authenticated == true)">
            <!-- the router outlet, where all matched components would ber viewed -->
            <header-component></header-component>
            <div class="page-container">
                <div class="page-content clearfix">
                    <sidebar-component></sidebar-component>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
        </div>
        <div v-else>
            <div id="login">
                <div class="panel panel-body login-form">
                    <div class="text-center">
                        <div class="icon-object border-slate-300 text-slate-300">
                            <div class="icons" v-html="require('./assets/images/icons/staff.svg')"></div>
                        </div>
                        <h5 class="content-group">Login to your account <small class="display-block">Enter your credentials below</small></h5>
                    </div>
                    <div v-if="errormessage">
                        <el-alert @close="closeMessage" title="Login" type="error" :description="errormessage" show-icon></el-alert>
                    </div>
                    <el-form :model="form" :rules="rules" ref="ruleFormLogin" label-width="120px" class="demo-ruleForm" @submit="login()">
                        <div class="alert alert-danger hide" id="errorAll"></div>
                        <el-form-item label="Username" prop="username">
                            <el-input type="text" v-model="form.username" placeholder="Enter Username" @keyup.enter.native="login()"></el-input>
                        </el-form-item>
                        <el-form-item label="Password" prop="password">
                            <el-input type="password" v-model="form.password" placeholder="Enter Password" @keyup.enter.native="login()"></el-input>
                        </el-form-item>
                        <el-button type="primary" id="signin" class="button-white-green" v-on:click.prevent="login()">Sign in</el-button>
                    </el-form>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
    // import Vue from 'vue'
    import FUNCTIONS from '@/functions'
    import CryptoJS from 'crypto-js'

    // register component here
    import HeaderComponent from '@/components/partials/HeaderComponent.vue'
    import SidebarComponent from '@/components/partials/SidebarComponent.vue'

    export default {
        name: 'app',
        data(){
            return{
                apiUrl: process.env.ROOT_API,
                keySecretPrase: '',
                loginUrl: 'login',
                sectionApiPermission: 'permission',
                permissionId: this.$getRoles,
                authenticated: false,
                errormessage: '',
                form: {
                    username: "",
                    password: ""
                },
                rules:{
                    username: [ { required: true, message: 'Username kosong', trigger: 'blur' } ],
                    password: [ { required: true, message: 'Password kosong', trigger: 'blur' } ],
                },
                dataLogin: [],
                doneTheStuff: '',

                dataLocal: {
                    username: 'username',
                    permission: 'permission',
                    roles: 'roles',
                    noHp: 'no_hp',
                }
            }
        },
        created () {
            // init for backbutton in mobile
            document.addEventListener("backbutton", this.yourCallBackFunction, false);
        },
        beforeDestroy () {
            // for backbutton in mobile
            document.removeEventListener("backbutton", this.yourCallBackFunction);
        },
        mounted() {
            // Check the users auth status when the app starts
            this.checkAuthentications()

            // Trigger for backdrop click
            this.triggerBackdropClick()

            // Get Logout Message
            this.getLogoutMessage()
        },
        methods: {
            login(){
                let loadingform = FUNCTIONS.svgSpinner
                this.$refs.ruleFormLogin.validate((valid) => {
                    if (valid) {
                        document.getElementById('signin').children[0].innerHTML = loadingform 
                        let credentials = {
                            username: this.form.username,
                            password: this.form.password
                        }
                        this.loginFunction(credentials, 'dashboard')
                    }else{
                        document.getElementById('signin').children[0].innerHTML = 'Sign in'
                        return false;
                    }
                })
            },
            closeMessage(){
                localStorage.clear()
            },
            yourCallBackFunction(){
                if(document.getElementsByClassName('sidebar')[0].classList.contains('showing')){
                    document.getElementsByClassName('sidebar')[0].classList.remove('showing')
                }

                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
            },
            loginFunction(creds, redirect) {
                let url = this.apiUrl + this.loginUrl
                this.errormessage = ''
                this.axios.post(url, creds)
                .then((response) => {
                    // setData
                    if(response.data.status == 'error'){
                        this.errormessage = response.data.message
                        document.getElementById('signin').children[0].innerHTML = 'Sign in'
                    }else{
                        this.dataLogin = response.data.data
                        if(response.data !== null && response.data !== ''){
                            this.$cookies.set(CryptoJS.MD5('id_token').toString(), this.dataLogin.access_token)

                            this.keySecretPrase = process.env.KEY_UNLOCK + CryptoJS.MD5(this.dataLogin.id)
                                
                            let EncriptValueUsername = CryptoJS.AES.encrypt(this.dataLogin.fullname, this.keySecretPrase).toString()
                            let EncriptValuePermission = CryptoJS.AES.encrypt(JSON.stringify(this.dataLogin.roles[0].permissions), this.keySecretPrase).toString()
                            let EncriptValueRoles = CryptoJS.AES.encrypt((this.dataLogin.roles[0].id).toString(), this.keySecretPrase).toString()
                            let EncriptValuePhone  = CryptoJS.AES.encrypt(this.dataLogin.phone_number, this.keySecretPrase).toString()

                            localStorage.setItem(CryptoJS.MD5(this.dataLocal.username).toString(), EncriptValueUsername)
                            localStorage.setItem(CryptoJS.MD5(this.dataLocal.permission).toString(), EncriptValuePermission)
                            localStorage.setItem(CryptoJS.MD5(this.dataLocal.roles).toString(), EncriptValueRoles)
                            localStorage.setItem(CryptoJS.MD5(this.dataLocal.noHp).toString(), EncriptValuePhone)

                            this.$cookies.set(CryptoJS.MD5('username').toString(), EncriptValueUsername)
                            this.$cookies.set(CryptoJS.MD5('ID-LOG').toString(), CryptoJS.MD5(this.dataLogin.id).toString())

                            document.getElementById("errorAll").classList.add('hide');
                            if(redirect) {
                                document.getElementById('signin').children[0].innerHTML = 'Sign in'
                                // router.go(redirect)
                                window.location.href = ''
                            }
                        }else{
                            this.errormessage = 'Respon Kosong'
                            document.getElementById('signin').children[0].innerHTML = 'Sign in'
                        }
                    }

                }).catch((err) => {
                    let element = document.getElementById("errorAll")
                    element.classList.remove('hide')
                    element.innerHTML = err
                })
            },
            getPermissionforUpdate(){
                let keyPhrase = process.env.KEY_UNLOCK + this.$cookies.get(CryptoJS.MD5('ID-LOG').toString())
                let url = this.apiUrl + this.sectionApiPermission + '/' + this.permissionId
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'success'){
                        let EncriptValuePermission = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.permissions), keyPhrase).toString()
                        this.$localStorage.set(CryptoJS.MD5(this.dataLocal.permission).toString(), EncriptValuePermission)
                    }
                })
                .catch(error => { 
                    console.log(error)
                })
            },
            checkAuthentications(){
                if(this.$cookies.get(CryptoJS.MD5('id_token').toString())){
                    this.authenticated = true
                    if(this.$cookies.get(CryptoJS.MD5('id_token').toString()) && this.$route.path == '/'){
                        this.$router.push({name: 'dashboard'})
                    }
                    if (performance.navigation.type == 1) {
                        this.getPermissionforUpdate()
                        console.info( "Permission is loaded" );
                    }
                }else{
                    if (performance.navigation.type == 1) {
                        localStorage.clear()
                        this.$cookies.remove(CryptoJS.MD5('id_token').toString())
                        this.$cookies.remove(CryptoJS.MD5('username').toString())
                        console.info( "This page is reloaded" );
                    }
                }
            },
            triggerBackdropClick(){
                document.querySelector('.backdrop').addEventListener("click", function(){
                    document.getElementById("cancel").click();
                });
            },
            getLogoutMessage(){
                if(this.$localStorage.get('logout-message')){
                    this.errormessage = this.$localStorage.get('logout-message')
                }
            }
        },
        components: {HeaderComponent, SidebarComponent}
    }
</script>

<style lang="scss">
    #login{
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        padding: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition-delay: 0s !important;
        right: auto;
        .icon-object{
            width: 72px;
            height: 72px;
            margin: 10px auto;
            .icons{
                width: 35px;
                margin: 0 auto;
            }
        }
        .panel{
            padding: 20px;
            box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
            .el-form-item{
                margin-bottom: 15px;
                .el-form-item__error{
                    position: static;
                }
            }
            button{
                width: 100%;
                display: block;
            }
            .content-group{
                margin-bottom: 15px;
                font-size: 14px;
                font-weight: 600;
                small{
                    font-weight: normal;
                    display: block;
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }
    }
</style>

<!-- styling for the component -->
<style src="./assets/styles/scss/global.scss" lang="scss"></style>

<!-- import another custom style -->
<!--<style src="./assets/styles/component/icons.scss" lang="scss"></style>-->
