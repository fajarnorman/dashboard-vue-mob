import Vue from 'vue'
import VueCookies from 'vue-cookies'
import CryptoJS from 'crypto-js'
import { Notification } from 'element-ui'

Vue.use(VueCookies)

export default {
    svgSpinner: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
    logout(type, notif) {
        $cookies.remove(CryptoJS.MD5('id_token').toString())
        $cookies.remove(CryptoJS.MD5('username').toString())
        $cookies.remove(CryptoJS.MD5('ID-LOG').toString())
        localStorage.clear()
        window.location.href = ''
        if(type == 'expired-token'){
            localStorage.setItem('logout-message', notif)
        }
    },
    getAuthHeader() {
        if($cookies.get(CryptoJS.MD5('id_token').toString())){
            return {
                'Authorization': 'Bearer ' + $cookies.get(CryptoJS.MD5('id_token').toString())
            }
        }else{
            return false
        }
    },
    checkPermissions(valuePermission){
        if(valuePermission == false || valuePermission == undefined){
            window.location.href = ''
        }
    },
    checkRolesIsSuperAdmin(valueRolePermission){
        if(valueRolePermission > 1){
            window.location.href = ''
        }
    },
    notify(type, title, message){
        Notification({
            title: title,
            message: message,
            type: type
        });
    },
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
    },
    formatTime(time){
        var t = new Date(time),
            hours = '' + t.getHours(),
            minute = '' + t.getMinutes()
            hours = ("0" + hours).slice(-2)
            minute = ("0" + minute).slice(-2)

        return [hours, minute].join(':')
    },
    formatPrice(value){
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    sidebarToggle(value){
        if(value == true){
            document.querySelector('.base-template-sidebar').classList.add('showing')
            document.querySelector('.backdrop').classList.add('show')
            document.querySelector('body').classList.add('no-scroll')
        }else{
            document.querySelector('.base-template-sidebar').classList.remove('showing')
            document.querySelector('.backdrop').classList.remove('show')
            document.querySelector('body').classList.remove('no-scroll')
        }
    },
    checkPaginations(){
        if(document.querySelector('.el-pagination') !== null){
            if(document.querySelector('.el-pagination').children[1].children[0] !== undefined){
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        }
    },
    viewActive(){
        document.querySelectorAll('.showing-page ul li').forEach(function(a){ a.classList.remove('active') })
        event.target.parentNode.classList.add('active')
    },
    removeDupplicateValueArray(names){
        let unique = {};
        names.forEach(function(i) {
            if(!unique[i]) {
                unique[i] = true
            }
        })
        return Object.keys(unique)
    },
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str)
    }
}