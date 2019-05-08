<template>
    <div id="sidebar-menu-drone">
        <el-menu-item index="51" class="items-sidebar-menu-drone" 
            v-if="$dataRole['service.drone.get.product'] == true
                && $dataRole['service.drone.post.product.create'] == true
                && $dataRole['service.drone.put.land.update.*'] == true
                && $dataRole['service.drone.delete.product.delete.*'] == true">
            <router-link v-bind:to="'/drone/package'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-master-barang.svg')"></div>
                <span>Paket Drone</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="52" class="items-sidebar-menu-drone" 
            v-if="$dataRole['service.drone.get.land'] == true 
                && $dataRole['service.drone.post.land.create'] == true
                && $dataRole['service.drone.put.land.update.*'] == true
                && $dataRole['service.drone.delete.land.delete.*'] == true">
            <router-link v-bind:to="'/drone/type-land'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-location.svg')"></div>
                <span>Jenis Pertanian</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="52" class="items-sidebar-menu-drone" 
            v-if="$dataRole['service.drone.get.transaction'] == true
                && $dataRole['service.drone.put.transaction.update.*'] == true">
            <router-link v-bind:to="'/drone/transactions'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>Transaksi Drone</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-drone'
}
</script>