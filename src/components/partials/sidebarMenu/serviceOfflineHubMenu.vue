<template>
    <div id="sidebar-menu-offlinehub">
        <el-menu-item index="39" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['producer.list']">
            <router-link v-bind:to="'/offline-hub/produsen'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-produsen.svg')"></div>
                <span>Produsen</span>
            </router-link>
        </el-menu-item>
        <el-submenu index="43" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.item.dashboard']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-master-barang.svg')"></div>
                <span>Barang Offline Hub</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="43-1" v-if="$dataRole['service.offlinehub.get.item.dashboard']">
                <router-link v-bind:to="'/offline-hub/barang'">
                    <span>Item Produk</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="43-2" v-if="$dataRole['service.offlinehub.get.apply-item']">
                <router-link v-bind:to="'/offline-hub/approve/barang'">
                    <span>Pengajuan Barang</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="43-3" v-if="$dataRole['service.offlinehub.get.attribute']">
                <router-link v-bind:to="'/offline-hub/atribut'">
                    <span>Atribut</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="43-4" v-if="$dataRole['service.offlinehub.get.product']">
                <router-link v-bind:to="'/offline-hub/produk'">
                    <span>Produk</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="43-5" v-if="$dataRole['service.offlinehub.get.category']">
                <router-link v-bind:to="'/offline-hub/kategori-produk'">
                    <span>Kategori Produk</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="43-6" v-if="$dataRole['service.offlinehub.get.type']">
                <router-link v-bind:to="'/offline-hub/tipe'">
                    <span>Tipe Produk</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-menu-item index="42" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['store.delete'] == true || $dataRole['store.create'] == true">
            <router-link v-bind:to="'/offline-hub/store'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-kios.svg')"></div>
                <span>User Store</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="44" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.hub']">
            <router-link v-bind:to="'/offline-hub/locations'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-location.svg')"></div>
                <span>Lokasi Hubs</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="45" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.transaction.all']">
            <router-link v-bind:to="'/offline-hub/transactions'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-balance.svg')"></div>
                <span>List Transaksi</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="46" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.fee.unpaid']">
            <router-link v-bind:to="'/offline-hub/fee'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-produk-digital.svg')"></div>
                <span>Pencairan Fee</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="47" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.fee.history']">
            <router-link v-bind:to="'/offline-hub/history/fee'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>History Pencairan Fee</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="48" class="items-sidebar-menu-offline-hubs" v-if="$dataRole['service.offlinehub.get.fee.history']">
            <router-link v-bind:to="'/offline-hub/report/fee'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>Laporan Fee Crew</span>
            </router-link>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-offlinehub'
}
</script>