<template>
    <div id="sidebar-menu-gold">
        <el-menu-item index="51" class="items-sidebar-menu-golds" v-if="$dataRole['service.gold.get.cms.transactions']">
            <router-link v-bind:to="'/gold/transaction'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>Transaksi Emas</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-gold'
}
</script>