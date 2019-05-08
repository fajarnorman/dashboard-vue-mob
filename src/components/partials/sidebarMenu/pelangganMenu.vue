<template>
    <div id="sidebar-menu-pelanggan">
        <el-menu-item index="21" v-if="$dataRole['customer.list']">
            <router-link v-bind:to="'/pelanggan'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-pelanggan.svg')"></div>
                <span>Pelanggan</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="22" v-if="$dataRole['user.otp']">
            <router-link v-bind:to="'/user/pin'" class="userotp">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-otp.svg')"></div>
                <span>User OTP</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="29" v-if="$dataRole['users.upgraderequestlist']">
            <router-link v-bind:to="'/users/upgradeRequestList'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-staff.svg')"></div>
                <span>User Upgrade Request</span>
            </router-link>
        </el-menu-item>
        <el-submenu index="23" v-if="$dataRole['agent.topup']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-balance.svg')"></div>
                <span>Balance</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="23-1" v-if="$dataRole['agent.topup']">
                <router-link v-bind:to="'/agent/topup'">
                    <span>Topup</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="23-2" v-if="$dataRole['agent.topup']">
                <router-link v-bind:to="'/agent/withdraw'">
                    <span>Withdraw</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-menu-item index="24" v-if="$dataRole['points.mutation']">
            <router-link v-bind:to="'/mutasi-point'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-point-mutation.svg')"></div>
                <span>Mutasi Poin</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="25" v-if="$dataRole['topup.confirm.list']">
            <router-link v-bind:to="'/konfirmasi-topup'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-top-up-confirmation.svg')"></div>
                <span>Konfirmasi Top Up</span>
                <div class="badge success" id="bagde-topup-confirmations">{{totalPageTopup}}</div>
            </router-link>
        </el-menu-item>
        <el-menu-item index="26" v-if="$dataRole['users.checkvalidreferar']">
            <router-link v-bind:to="'/user/referer'" class="cekvalid">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-valid-referal.svg')"></div>
                <span>Cek Valid Referrer</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="26" v-if="$dataRole['promotion.list']">
            <router-link v-bind:to="'/kode-promo'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-promo-code.svg')"></div>
                <span>Kode Promo</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="26" v-if="$dataRole['topup.bonus.list']">
            <router-link v-bind:to="'/topupbonus'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-kirim-balance.svg')"></div>
                <span>Topup Bonus</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="27" v-if="$dataRole['location.list']">
            <router-link v-bind:to="'/lokasi'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-location.svg')"></div>
                <span>Lokasi</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="28" v-if="$dataRole['gamification.list']">
            <router-link v-bind:to="'/gamification'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-poin-size-game.svg')"></div>
                <span>Gamifications</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-pelanggan',
    data(){
        return{
            apiUrl: process.env.ROOT_API,
            sectionApi: 'topup',
            totalPage: '',
            totalPageTopup: '',
            errored: false,
            countErrorPost: 0,
        }
    },
    mounted() {
        this.getPosts()
    },
    methods: {
        buildUrl () {
            return this.apiUrl + this.sectionApi + "?limit=1&page=1&status=confirmed"
        },
        getPosts(){
            let url = this.buildUrl()
            this.axios.get(url)
            .then(response => {
                this.totalPage = response.data.totalData
                if(this.totalPage >= 100){
                    this.totalPageTopup = '99+'
                }else{
                    this.totalPageTopup = this.totalPage
                }
            })
            .catch(error => { 
                this.countErrorPost++
                if(this.countErrorPost >= 3){
                    this.errored = true
                }else{
                    this.getPosts()
                }
            })
        },
    }
}
</script>