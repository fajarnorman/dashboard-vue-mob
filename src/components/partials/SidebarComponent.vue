<template>
    <div class="sidebar sidebar-main">
        <div class="sidebar-content">
            <!-- main navigation -->
            <div class="sidebar-category sidebar-category-visible">
                <div class="category-content no-padding">
                    <div class="logo"><img class="img-logo" src="~assets/images/logo.png"></div>
                    <a href="#" class="closesidebar" @click.prevent="sidebarClose()"><font-awesome-icon class="fontIcons" :icon="fontsIcons.close" /></a>
                    <ul class="navigation navigation-main navigation-accordion" v-if="$dataRole">
                        <div v-if="$getRoles <= 3">
                            <div class="sidebar-nav active" id="produk">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <produk-menu></produk-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="pelanggan">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <pelanggan-menu></pelanggan-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="agent">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <agent-menu></agent-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="mobile-app">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <mobile-apps-menu></mobile-apps-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="services">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <offline-hub-menu></offline-hub-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="notifications">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <notifications-menu></notifications-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="gold">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <gold-menu></gold-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="banks">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <bank-mutation-menu></bank-mutation-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="product-status">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <product-status-menu></product-status-menu>
                                </el-menu>
                            </div>
                            <div class="sidebar-nav" id="drone">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <drone-menu></drone-menu>
                                </el-menu>
                            </div>
                        </div>
                        <div v-else>
                            <div class="sidebar-nav active" id="pelanggan">
                                <el-menu class="el-menu-vertical-demo" :unique-opened="true">
                                    <produk-menu></produk-menu>
                                    <pelanggan-menu></pelanggan-menu>
                                    <agent-menu></agent-menu>
                                    <mobile-apps-menu></mobile-apps-menu>
                                    <offline-hub-menu></offline-hub-menu>
                                    <notifications-menu></notifications-menu>
                                    <bank-mutation-menu></bank-mutation-menu>
                                    <gold-menu></gold-menu>
                                    <product-status-menu></product-status-menu>
                                    <drone-menu></drone-menu>
                                </el-menu>
                            </div>
                        </div>
                    </ul>
                    <a href="#" @click.prevent="logout" class="sidebarlogout">Sign Out</a>
                    <div class="versions">{{versions}}</div>
                </div>
            </div>
            <!-- /main navigation -->
        </div>
    </div>
</template>
<script>
    import produkMenu from './sidebarMenu/produkMenu.vue'
    import pelangganMenu from './sidebarMenu/pelangganMenu.vue'
    import agentMenu from './sidebarMenu/agenMenu.vue'
    import mobileAppsMenu from './sidebarMenu/mobileApps.vue'
    import offlineHubMenu from './sidebarMenu/serviceOfflineHubMenu.vue'
    import notificationsMenu from './sidebarMenu/serviceNotificationsMenu.vue'
    import bankMutationMenu from './sidebarMenu/serviceBankMutationMenu.vue'
    import goldMenu from './sidebarMenu/serviceGoldMenu.vue'
    import productStatusMenu from './sidebarMenu/serviceProductStatusMenu.vue'
    import droneMenu from './sidebarMenu/serviceDroneMenu.vue'
    import { faTimes } from '@fortawesome/free-solid-svg-icons'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'sidebar-component',
        components: { 
            produkMenu, 
            pelangganMenu, 
            agentMenu, 
            mobileAppsMenu, 
            offlineHubMenu,
            notificationsMenu,
            bankMutationMenu,
            goldMenu,
            productStatusMenu,
            droneMenu
        },
        data() {
            return {
                versions: process.env.VERSION_DASHBOARD,
                fontsIcons: {
                    close: faTimes
                }
            }
        },
        methods: {
            sidebarClose(){ document.getElementsByClassName('sidebar')[0].classList.remove('showing') },
            logout() {
                FUNCTIONS.logout('expired-token', 'Berhasil Logout')
            },
        }
    }
</script>
<style lang="scss">
.version-dashboard{
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
}
</style>