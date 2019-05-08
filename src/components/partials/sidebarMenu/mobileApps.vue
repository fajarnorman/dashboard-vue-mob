<template>
    <div id="sidebar-menu-mobile-apps">
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="41" v-if="$dataRole['version.list']">
            <router-link v-bind:to="'/app-version'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-appversion.svg')"></div>
                <span>App Version</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="47" v-if="$getRoles == 1">
            <router-link v-bind:to="'/user/menu'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-dashboard.svg')"></div>
                <span>User Menu</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="42" v-if="$dataRole['notification.list']">
            <router-link v-bind:to="'/kirim-notif'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-kirim-notifikasi.svg')"></div>
                <span>Kirim Notifikasi</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="43" v-if="$dataRole['slideshow.list']">
            <router-link v-bind:to="'/slideshow'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-slide-show-banner.svg')"></div>
                <span>Slide Show</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="43" v-if="$dataRole['claimitem.list']">
            <router-link v-bind:to="'/poin-klaim-item'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-claim-items.svg')"></div>
                <span>Poin Klaim Item</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="44" v-if="$dataRole['interstitialbanner.list']">
            <router-link v-bind:to="'/interstitialbanner'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-slide-show-banner.svg')"></div>
                <span>Interstitial Banner</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="45" v-if="$dataRole['term.condition.list']">
            <router-link v-bind:to="'/backlink'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-reference.svg')"></div>
                <span>Backlink</span>
            </router-link>
        </el-menu-item>
        <el-menu-item class="items-sidebar-menu-mobile-apps" index="46" v-if="$dataRole['merchant.menu.list']">
            <router-link v-bind:to="'/merchant-menu'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-valid-referal.svg')"></div>
                <span>Merchant Menu</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-mobile-apps'
}
</script>
