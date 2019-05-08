<template>
    <div id="sidebar-menu-product-status">
        <el-menu-item index="51" class="items-sidebar-menu-product-status" v-if="$dataRole['service.product-status.get.cms.monitoring.sku']">
            <router-link v-bind:to="'/product-status/dashboard'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-dashboard.svg')"></div>
                <span>Dashboard</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="52" class="items-sidebar-menu-product-status" v-if="$dataRole['service.product-status.get.cms.sku']">
            <router-link v-bind:to="'/product-status/sku'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-produk-digital.svg')"></div>
                <span>SKU</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-product-status'
}
</script>