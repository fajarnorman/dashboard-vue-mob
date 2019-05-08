<template>
    <div id="sidebar-menu-notifications">
        <el-submenu index="51" class="items-sidebar-menu-notifications sms-trigger" v-if="$dataRole['service.notification.get.sms.provider'] || $dataRole['service.notification.get.sms.operator']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-otp.svg')"></div>
                <span>SMS</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="51-1" v-if="$dataRole['service.notification.get.sms.provider']">
                <router-link v-bind:to="'/notify/sms/provider'">
                    Provider
                </router-link>
            </el-menu-item>
            <el-menu-item index="51-2" v-if="$dataRole['service.notification.get.sms.operator']">
                <router-link v-bind:to="'/notify/sms/operator'">
                    Operator
                </router-link>
            </el-menu-item>
            <!-- <el-menu-item index="51-3">
                <router-link v-bind:to="'/notify/sms/pricing'">
                    Pricing
                </router-link>
            </el-menu-item> -->
        </el-submenu>
        <el-menu-item index="52" class="items-sidebar-menu-notifications" v-if="$dataRole['service.notification.get.sms.report']">
            <router-link v-bind:to="'/notify/sms/report'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>SMS Report</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-notifications'
}
</script>