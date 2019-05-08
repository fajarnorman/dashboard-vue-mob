<template>
    <div id="sidebar-menu-bank-mutations">
        <el-menu-item index="61" class="items-sidebar-menu-banks" v-if="$dataRole['service.banking.get.cms.report']">
            <router-link v-bind:to="'/bank/mutation'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-transfer-pulsa.svg')"></div>
                <span>Mutasi Bank</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-bank-mutations'
}
</script>