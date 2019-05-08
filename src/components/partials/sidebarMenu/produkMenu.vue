<template>
    <div id="sidebar-menu-produk">
        <el-menu-item index="11" v-if="$dataRole['dashboard.list']">
            <router-link v-bind:to="'/'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-dashboard.svg')"></div>
                <span>Dashboard</span>
            </router-link>
        </el-menu-item>
        <el-submenu index="12" v-if="$dataRole['report.list']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-report.svg')"></div>
                <span>Laporan</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="12-1" v-if="$dataRole['report.ppob']">
                <router-link v-bind:to="'/report/transaksi-digital'">
                    Transaksi Digital
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-2" v-if="$dataRole['report.claim']">
                <router-link v-bind:to="'/report/transaksi-claim'">
                    Transaksi Klaim
                </router-link>
            </el-menu-item>
            <!-- <el-menu-item index="12-3" v-if="$dataRole['report.transfer']">
                <router-link v-bind:to="'/report/transaksi-transfer'">
                    Transaksi Transfer
                </router-link>
            </el-menu-item> -->
            <el-menu-item index="12-4" v-if="$dataRole['report.item']">
                <router-link v-bind:to="'/report/penjualan'">
                    Penjualan
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-5" v-if="$dataRole['report.item.detail']">
                <router-link v-bind:to="'/report/penjualan/detail-penjualan'">
                    Detail Penjualan
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-6" v-if="$dataRole['report.item.customer']">
                <router-link v-bind:to="'/report/daftar-pelanggan'">
                    Daftar Pelanggan
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-7" v-if="$dataRole['report.balance.mutation']">
                <router-link v-bind:to="'/report/mutasi-saldo'">
                    Mutasi Saldo
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-8" v-if="$dataRole['report.promotion']">
                <router-link v-bind:to="'/report/pemakaian-promo'">
                    Pemakaian Promo
                </router-link>
            </el-menu-item>
            <el-menu-item index="12-9" v-if="$dataRole['report.topup']">
                <router-link v-bind:to="'/report/topup'">
                    Top Up
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="13" v-if="$dataRole['item.list']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-master-barang.svg')"></div>
                <span>Master Barang</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="13-1" v-if="$dataRole['item.list']">
                <router-link v-bind:to="'/barang'">
                    <span>Barang</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="13-2" v-if="$dataRole['attribute.list']">
                <router-link v-bind:to="'/atribut'">
                    <span>Atribut</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="13-3">
                <router-link v-bind:to="'/product'" v-if="$dataRole['product.list']">
                    <span>Produk</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="13-4">
                <router-link v-bind:to="'/category-product'" v-if="$dataRole['category_product.list']">
                    <span>Kategori Produk</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="14" v-if="$dataRole['sku.list']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-produk-digital.svg')"></div>
                <span>Produk Digital</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="14-1">
                <router-link v-bind:to="'/sku'">
                    <span>SKU</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="14-2">
                <router-link v-bind:to="'/skubrand'" v-if="$dataRole['skubrand.list']">
                    <span>SKU Brand</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="14-3">
                <router-link v-bind:to="'/sku-comparison'">
                    <span>Komparasi SKU</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="14-4" v-if="$dataRole['skulimit.list']">
                <router-link v-bind:to="'/sku-limit'">
                    <span>SKU Limit</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
    </div>    
</template>

<script>
export default {
    name: 'sidebar-menu-produk'
}
</script>