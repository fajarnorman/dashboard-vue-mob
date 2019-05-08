// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import _ from 'lodash'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueLocalStorage from 'vue-localstorage'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueQRCodeComponent from 'vue-qrcode-component'
import CryptoJS from 'crypto-js'

// import router
import router from './router'
// import FUNCTIONS
import FUNCTIONS from './functions'

// import style plugin
import 'element-ui/lib/theme-chalk/index.css'
import 'fullcalendar/dist/fullcalendar.css'

// Config Axios 
axios.defaults.withCredentials = false
axios.defaults.proxyHeaders = false
if(FUNCTIONS.getAuthHeader() !== false){
    axios.defaults.headers.common.Authorization = FUNCTIONS.getAuthHeader().Authorization
}
Vue.prototype.urlService = process.env.SERVICE_API
Vue.prototype.$baseUrl = process.env.VERSION_LINK + process.env.CMSAPI_URL

// axios is the axios object now, so any method you can call on axios object, you can call on this.axios.
Vue.prototype.axios = axios

//tell vue to use the router
Vue.use(ElementUI, { locale })
Vue.use(Vuex)
Vue.use(VueMoment)
Vue.use(VueLocalStorage)
Vue.use(VueResource)
Vue.use(VueCookies)
VueCookies.config('30d')
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('qr-code', VueQRCodeComponent)


if($cookies.get(CryptoJS.MD5('id_token').toString()) && Vue.localStorage.get(CryptoJS.MD5('permission').toString()) && $cookies.get(CryptoJS.MD5('ID-LOG').toString())){
    let keyPhrase = process.env.KEY_UNLOCK + $cookies.get(CryptoJS.MD5('ID-LOG').toString())
    
    let decriptPermission = CryptoJS.AES.decrypt(Vue.localStorage.get(CryptoJS.MD5('permission').toString()), keyPhrase)
    let originalPermission = decriptPermission.toString(CryptoJS.enc.Utf8)

    let decriptRoles = CryptoJS.AES.decrypt(Vue.localStorage.get(CryptoJS.MD5('roles').toString()), keyPhrase)
    let originalRole = decriptRoles.toString(CryptoJS.enc.Utf8)

    let decriptUsername = CryptoJS.AES.decrypt(Vue.localStorage.get(CryptoJS.MD5('username').toString()), keyPhrase)
    let originalUsername = decriptUsername.toString(CryptoJS.enc.Utf8)

    let decriptPhone = CryptoJS.AES.decrypt(Vue.localStorage.get(CryptoJS.MD5('no_hp').toString()), keyPhrase)
    let originalPhone = decriptPhone.toString(CryptoJS.enc.Utf8)

    Vue.prototype.$dataRole = JSON.parse(originalPermission)
    Vue.prototype.$getRoles = originalRole
    Vue.prototype.$fullName = originalUsername
    Vue.prototype.$phoneNumber = originalPhone

    Vue.prototype.$dataSupplier = ['narindo', 'sakalaguna', 'sepulsa', 'bosbiller']
}else{
    localStorage.clear()
    $cookies.remove(CryptoJS.MD5('id_token').toString())
    $cookies.remove(CryptoJS.MD5('username').toString())
    $cookies.remove(CryptoJS.MD5('ID-LOG').toString())
}

//instatinat the vue instance
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
}).$mount('#app')//mount the router on the app