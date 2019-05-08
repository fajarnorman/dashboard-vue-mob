<template>
    <div id="Header">
        <header>
            <nav class="navbar navbar-dark bg-navbar-header navbar-expand-md">
                <el-menu class="el-menu-demo" default-active="2" mode="horizontal" @select="handleSelect" v-if="$getRoles <= 3">
                    <el-menu-item index="1" class="img-navbar"></el-menu-item>
                    <el-menu-item index="2" class="nav-item-a produk">
                        <a>Produk</a>
                    </el-menu-item>
                    <el-menu-item index="3" class="nav-item-a pelanggan">
                        <a>Pelanggan</a>
                    </el-menu-item>
                    <el-menu-item index="4" class="nav-item-a agent">
                        <a>Agen</a>
                    </el-menu-item>
                    <el-menu-item index="5" class="nav-item-a mobile-app" v-show="mobileAppTabHide == false">
                        <a>Mobile App</a>
                    </el-menu-item>
                    <el-menu-item index="7" class="nav-item-a services" v-if="serviceNotificationsTabHide == false || serviceTabHide == false || serviceBankTabHide == false || serviceProductStatusTabHide == false">
                        <a>Services</a>
                    </el-menu-item>
                    <el-submenu index="6" class="float-right" popper-class="menu-top-dropdown">
                        <template slot="title">
                            <img src="~assets/images/placeholder.jpg" class="user-img">
                            <span>{{username}}</span>
                            <div class="caret-custom"></div>
                        </template>
                        <el-menu-item index="6-1">
                            <a href="#" @click.prevent="ResetPassword" style="display: block;">
                                 <font-awesome-icon style="margin-right: 5px;" class="fontIcons" :icon="fontsIcons.key" /> Reset Pin
                            </a>
                        </el-menu-item>
                        <el-menu-item index="6-2">
                            <a href="#" @click.prevent="logout" class="logout">
                                <div class="icons" v-html="require('../../assets/images/icons/logout.svg')"></div> Logout
                            </a>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                <el-menu class="el-menu-demo" default-active="2" mode="horizontal" @select="handleSelect" v-else>
                    <el-menu-item index="1" class="img-navbar"></el-menu-item>
                    <el-menu-item index="2" class="nav-item-a" @click="showHideSidebar('modules')">
                        <a>Modules</a>
                    </el-menu-item>
                    <el-submenu index="6" class="float-right" popper-class="menu-top-dropdown">
                        <template slot="title">
                            <img src="~assets/images/placeholder.jpg" class="user-img">
                            <span>{{username}}</span>
                            <div class="caret-custom"></div>
                        </template>
                        <el-menu-item index="6-1">
                            <a href="#" @click.prevent="ResetPassword" style="display: block;">
                                 <font-awesome-icon style="margin-right: 5px;" class="fontIcons" :icon="fontsIcons.key" /> Reset Pin
                            </a>
                        </el-menu-item>
                        <el-menu-item index="6-2">
                            <a href="#" @click.prevent="logout" class="logout">
                                <div class="icons" v-html="require('../../assets/images/icons/logout.svg')"></div> Sign Out
                            </a>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </nav>
            <div class="sub-header-menu" v-show="showServiceSubMenu == true">
                <ul>
                    <li v-if="serviceTabHide == false"><a class="sub-menu-service" id="sub-menu-offline-hub" @click.prevent="handleSubMenuOpen('services', '/offline-hub/produsen', 'sub-menu-offline-hub')">Offline Hub</a></li>
                    <li v-if="serviceNotificationsTabHide == false"><a class="sub-menu-service" id="sub-menu-notifications" @click.prevent="handleSubMenuOpen('notifications', '/notify/sms/provider', 'sub-menu-notifications')">Notifikasi</a></li>
                    <li v-if="serviceBankTabHide == false"><a class="sub-menu-service" id="sub-menu-bank" @click.prevent="handleSubMenuOpen('banks', '/bank/mutation', 'sub-menu-bank')">Mutasi Bank</a></li>
                    <li v-if="serviceGoldTabHide == false"><a class="sub-menu-service" id="sub-menu-golds" @click.prevent="handleSubMenuOpen('gold', '/gold/transaction', 'sub-menu-golds')">Gold</a></li>
                    <li v-if="serviceProductStatusTabHide == false"><a class="sub-menu-service" id="sub-menu-product-status" @click.prevent="handleSubMenuOpen('product-status', '/product-status/dashboard', 'sub-menu-product-status')">Product Status</a></li>
                    <li v-if="serviceDroneTabHide == false"><a class="sub-menu-service" id="sub-menu-drone" @click.prevent="handleSubMenuOpen('drone', '/drone/package', 'sub-menu-drone')">Drone</a></li>
                </ul>
            </div>
        </header>
        <div class="menu-responsive clearfix">
            <div class="logo"><img class="img-logo" src="~assets/images/logo.png"></div>
            <a href="#" @click.prevent="sidebarOpen()"><font-awesome-icon class="fontIcons" :icon="fontsIcons.menu" /></a>
        </div>

        <el-dialog
            title="Masukkan kode verifikasi"
            :visible.sync="dialogLupaPin"
            width="30%"
            class="mb-dialog nopadding-right point-modal kepala-regional kode-verifikasi-pin"
            :close-on-click-modal="false">
            <div class="content-dialog">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form ref="forms-pin" label-width="120px" class="demo-ruleForm">
                            <el-form-item>
                                <input type="text" maxlength="4" class="forms-input" ref="formsotp" v-model="forms.otp">
                            </el-form-item>
                            <div class="text-verifikasi">
                                <span>Kode verifikasi terkirim ke : </span>
                                <div class="number-phone">********{{hidePhoneNumber}}</div>
                            </div>
                            <p class="note-kode-verifikasi">Kode OTP bersifat rahasia. Pihak Mobayar tidak pernah meminta kode OTP maupun PIN anda.</p>
                            <a href="#" class="reSend" @click.prevent="sendOTP()" disabled>KIRIM ULANG <span id="time">(01:00)</span></a>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 100%;" @click="keymonitor()" round class="choose button-white-green" type="primary">Next</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="Buat PIN Baru"
            :visible.sync="dialogCreateNewPin"
            width="30%"
            class="mb-dialog nopadding-right point-modal kepala-regional kode-verifikasi-pin"
            :close-on-click-modal="false">
            <div class="content-dialog">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form ref="forms-pin" label-width="120px" class="demo-ruleForm">
                            <el-form-item>
                                <input type="password" maxlength="6" class="forms-input" ref="formspin" v-model="forms.pin">
                            </el-form-item>
                            <ul class="note-kode-verifikasi">
                                <li>Jangan gunakan tanggal lahir dan nomor yang berurutan</li>
                                <li>Gunakan nomor spesial yang mudah diingat di kehidupan anda</li>
                            </ul>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 100%;" @click="setNewPin()" round class="choose button-white-green" type="primary">Simpan</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import FUNCTIONS from '@/functions'
import { faBars, faKey } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'Header',
    data(){
        return {
            username: this.$fullName,
            getPhoneNumber: this.$phoneNumber,
            color1: null,
            apiUrl: process.env.ROOT_API,
            sectionApiUser: 'user',
            sectionApiGenerate: 'generateOtpCode',
            sectionApiResetPin: 'resetPin',
            sectionApiVerifyPin: 'verifyOtpCode',
            dialogLupaPin: false,
            dialogCreateNewPin: false,
            serviceTabHide: false,
            serviceNotificationsTabHide: false,
            serviceBankTabHide: false,
            serviceProductStatusTabHide: false,
            serviceGoldTabHide: false,
            serviceDroneTabHide: false,
            mobileAppTabHide: false,
            agenTabHide: false,
            pelangganTabHide: false,
            produkTabHide: false,
            showServiceSubMenu: false,
            fontsIcons: {
                menu: faBars,
                key: faKey,
            },
            oneMinute: 60,
            forms: {
                otp: '',
                pin: '',
            },
        }
    },
    mounted(){
        this.checkTabServices()
    },
    methods: {
        checkTabServices(){
            let that = this
            setTimeout(function(){
                that.checkMenuIsEmpty()
                that.checkAddressBar()
            }, 20)
            this.checkMenuHeaderActive()
        },
        checkMenuHeaderActive(){
            if(localStorage.getItem('menu-header')){
                let idNav = localStorage.getItem('menu-header')
                document.querySelectorAll('.el-menu-item.nav-item-a').forEach(element => {
                    if(element.classList.contains('is-active')){
                        element.classList.remove('is-active')
                    }
                })
                document.querySelectorAll('.navigation-accordion .sidebar-nav').forEach(element => {
                    if(element.classList.contains('active')){
                        element.classList.remove('active')
                    }
                })
                if(document.querySelector('.el-menu-item.nav-item-a.'+idNav)){
                    // document.querySelector('.el-menu-item.nav-item-a.'+idNav).click()
                    document.querySelector('.el-menu-item.nav-item-a.'+idNav).classList.add('is-active')
                }
                document.getElementById(idNav).classList.add('active');
                if(
                    idNav == 'services' 
                    || idNav == 'notifications' 
                    || idNav == 'gold' 
                    || idNav == 'banks' 
                    || idNav == 'product-status'
                    || idNav == 'drone'){
                    this.showServiceSubMenu = true
                    document.querySelector('.page-container').classList.add('with-sub-menu')
                    document.querySelector('.el-menu-item.nav-item-a.services').classList.add('is-active')
                    // document.querySelector('.el-menu-item.nav-item-a.services').click()
                }
            }
        },
        checkMenuIsEmpty(){
            if(document.querySelectorAll('#services.sidebar-nav .el-menu .items-sidebar-menu-offline-hubs').length == 0){
                this.serviceTabHide = true
            }
            if(document.querySelectorAll('#notifications.sidebar-nav .el-menu .items-sidebar-menu-notifications').length == 0){
                this.serviceNotificationsTabHide = true
            }
            if(document.querySelectorAll('#product-status.sidebar-nav .el-menu .items-sidebar-menu-product-status').length == 0){
                this.serviceProductStatusTabHide = true
            }
            if(document.querySelectorAll('#mobile-app.sidebar-nav .el-menu .items-sidebar-menu-mobile-apps').length == 0){
                this.mobileAppTabHide = true
            }
            if(document.querySelectorAll('#banks.sidebar-nav .el-menu .items-sidebar-menu-banks').length == 0){
                this.serviceBankTabHide = true
            }
            if(document.querySelectorAll('#gold.sidebar-nav .el-menu .items-sidebar-menu-golds').length == 0){
                this.serviceGoldTabHide = true
            }
            if(document.querySelectorAll('#drone.sidebar-nav .el-menu .items-sidebar-menu-drone').length == 0){
                this.serviceDroneTabHide = true
            }
        },
        checkAddressBar(){
            if(window.location.href.indexOf("offline-hub") > -1) {
                if(document.getElementById('sub-menu-offline-hub')){
                    document.getElementById('sub-menu-offline-hub').classList.add('active')
                }
            }else if(window.location.href.indexOf("notify") > -1){
                if(document.getElementById('sub-menu-notifications')){
                    document.getElementById('sub-menu-notifications').classList.add('active')
                }
            }else if(window.location.href.indexOf("gold") > -1){
                if(document.getElementById('sub-menu-golds')){
                    document.getElementById('sub-menu-golds').classList.add('active')
                }
            }else if(window.location.href.indexOf("bank") > -1){
                if(document.getElementById('sub-menu-bank')){
                    document.getElementById('sub-menu-bank').classList.add('active')
                }
            }else if(window.location.href.indexOf("product-status") > -1){
                if(document.getElementById('sub-menu-product-status')){
                    document.getElementById('sub-menu-product-status').classList.add('active')
                }
            }else if(window.location.href.indexOf("drone") > -1){
                if(document.getElementById('sub-menu-drone')){
                    document.getElementById('sub-menu-drone').classList.add('active')
                }
            }
        },
        logout() {
            FUNCTIONS.logout('expired-token', 'Berhasil Logout')
        },
        handleSelect(key, keyPath) {
            let element = key
            document.querySelectorAll('.el-menu-item.nav-item-a').forEach(element => {
                if(element.classList.contains('is-active')){
                    element.classList.remove('is-active')
                }
                if(document.querySelector('.page-container')){
                    document.querySelector('.page-container').classList.remove('with-sub-menu')
                }
                if(document.getElementById('sub-menu-offline-hub')){
                    document.getElementById('sub-menu-offline-hub').classList.remove('active')
                }
                this.showServiceSubMenu = false
            }, this)
            if(key == 2 || key == 1){
                document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
                document.getElementById('produk').classList.add('active');
                localStorage.setItem('menu-header', 'produk')
                this.$router.push({name: 'dashboard'})
            }
            if(key == 3 || key == 1){
                document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
                document.getElementById('pelanggan').classList.add('active');
                localStorage.setItem('menu-header', 'pelanggan')
                this.$router.push({name: 'pelanggan'})
            }
            if(key == 4 || key == 1){
                document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
                document.getElementById('agent').classList.add('active');
                localStorage.setItem('menu-header', 'agent')
                this.$router.push({name: 'agent'})
            }
            if(key == 5 || key == 1){
                document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
                document.getElementById('mobile-app').classList.add('active');
                localStorage.setItem('menu-header', 'mobile-app')
                this.$router.push({name: 'appVersion'})
            }
            if(key == 7 || key == 1){
                document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
                document.querySelector('.page-container').classList.add('with-sub-menu')
                this.showServiceSubMenu = true
                document.querySelector('.sub-header-menu ul li a').click()
            }
            if(key == '6-2'){
                this.logout()
            }
        },
        handleSubMenuOpen(key, value, idname){
            document.querySelectorAll('.sub-menu-service').forEach(function(a){ a.classList.remove('active') })
            document.querySelectorAll('.sidebar-nav').forEach(function(a){ a.classList.remove('active') })
            document.getElementById(idname).classList.add('active')
            document.getElementById(key).classList.add('active');
            this.$localStorage.set('menu-header', key)
            this.$router.push({ path: value })
        },
        sidebarOpen(){
            document.getElementsByClassName('sidebar')[0].classList.add('showing')
        },
        sendOTP(){
            let url = this.apiUrl + this.sectionApiUser + '/' + this.sectionApiGenerate
            this.axios.post(url, {
                otp_type: 'pin'
            })
            .then(response => {
                if(response.data.status == 'success'){
                }
            })
            .catch(error => { 
                console.log(error);
            })
            .finally(() => {
                let that = this
                // setTimeout(function(){
                that.$refs.formsotp.focus()
                var display = document.querySelector('#time')
                document.querySelector('.reSend').setAttribute("disabled", "disabled")
                display.style.display = 'inline-block'
                that.startTimer(this.oneMinute, display);
                // }, 200)  
            })
        },
        ResetPassword(){
            this.$confirm('Kami akan mengirimkan kode verifikasi melalui SMS ke nomer yang anda pakai untuk akun Mobayar', 'Apakah anda yakin?', {
                confirmButtonText: 'Kirim Kode',
                cancelButtonText: 'Batal',
                type: 'warning'
            }).then(() => {
                this.dialogLupaPin = true
                this.sendOTP()
            }).catch(() => {

            })
        },
        keymonitor(){
            let value = this.forms.otp
            let that = this
            if(value.length == 4){
                let url = this.apiUrl + this.sectionApiUser + '/' + this.sectionApiVerifyPin
                this.axios.post(url, {
                    otp_type: 'pin',
                    otp_code: value
                })
                .then(response => {
                    if(response.data.status == 'success'){
                        this.dialogCreateNewPin = true
                        setTimeout(function(){
                            that.$refs.formspin.focus()
                        }, 500)
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }
                })
                .catch(error => { 
                    console.log(error);
                })
            }else{
                this.$notify.error({
                    title: 'Error',
                    message: 'Kode OTP tidak lengkap'
                });
            }
        },
        startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            var startInterval = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = "(" + minutes + ":" + seconds + ")";

                if (--timer < 0) {
                    timer = duration;
                    document.querySelector('.reSend').removeAttribute("disabled")
                    document.querySelector('#time').style.display = 'none'
                    clearInterval(startInterval)
                }
            }, 1000);
        },
        setNewPin(){
            let url = this.apiUrl + this.sectionApiUser + '/' + this.sectionApiResetPin
            this.axios.post(url, {
                pin: this.forms.pin
            })
            .then(response => {
                if(response.data.status == 'success'){
                    this.$notify({
                        title: 'Success',
                        message: response.data.message,
                        type: 'success'
                    });
                    this.dialogCreateNewPin = false
                    this.dialogLupaPin = false
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: response.data.message,
                    });
                }
            })
            .catch(error => { 
                console.log(error);
                this.$notify.error({
                    title: 'Error',
                    message: error,
                });
            })
        }
    },
    computed: {
        hidePhoneNumber : function(){
            return this.getPhoneNumber.substr(8)
        }
    }
}
</script>