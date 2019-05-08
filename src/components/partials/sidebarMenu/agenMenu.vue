<template>
    <div id="sidebar-menu-agent">
        <el-submenu index="31" v-if="
            $dataRole['agent.list'] 
            || $dataRole['agent.transaction'] 
            || $dataRole['agent.head']
            || $dataRole['agent.target']
            || $dataRole['agent.bonus']
            || $dataRole['agent.targetedproduct']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-agen.svg')"></div>
                <span>Agen</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="31-1" v-if="$dataRole['agent.list']">
                <router-link v-bind:to="'/agent'">
                    Daftar Agen
                </router-link>
            </el-menu-item>
            <el-menu-item index="31-2" v-if="$dataRole['agent.transaction']">
                <router-link v-bind:to="'/agent/transaksi'">
                    Transaksi Digital
                </router-link>
            </el-menu-item>
            <el-menu-item index="31-3" v-if="$dataRole['agent.head']">
                <router-link v-bind:to="'/agent/head'">
                    Kepala SPK
                </router-link>
            </el-menu-item>
            <el-menu-item index="31-4" v-if="$dataRole['agent.target']">
                <router-link v-bind:to="'/agent/target'">
                    Target & Pencapaian
                </router-link>
            </el-menu-item> 
            <el-menu-item index="31-5" v-if="$dataRole['agent.bonus']">
                <router-link v-bind:to="'/agent/bonus'">
                    Bonus Bulanan
                </router-link>
            </el-menu-item>
            <el-menu-item index="31-6" v-if="$dataRole['agent.targetedproduct']">
                <router-link v-bind:to="'/agent/targeted-product'">
                    Produk Yang Ditargetkan
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-menu-item index="32" v-if="$dataRole['user.list']">
            <router-link v-bind:to="'/user'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-staff.svg')"></div>
                <span>User</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="33" v-if="$dataRole['kios.list']">
            <router-link v-bind:to="'/kios'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-kios.svg')"></div>
                <span>Kios</span>
            </router-link>
        </el-menu-item>
        <el-submenu index="34" v-if="$dataRole['manager.list']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-kirim-balance.svg')"></div>
                <span>Pengiriman Balance</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="34-1">
                <router-link v-bind:to="'/user/sendBalance'">
                    <span>Kirim Balance</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="34-2">
                <router-link v-bind:to="'/users/sendBalanceGroup'">
                    <span>Grup</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
        <el-menu-item index="35" v-if="$dataRole['permission.list']">
            <router-link v-bind:to="'/permission'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-permission.svg')"></div>
                <span>Permission</span>
            </router-link>
        </el-menu-item>
        <el-menu-item index="36" v-if="$dataRole['reference.list']">
            <router-link v-bind:to="'/reference'">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-reference.svg')"></div>
                <span>Reference</span>
            </router-link>
        </el-menu-item>
        <el-submenu index="38" v-if="$dataRole['withdrawal.list']">
            <template slot="title">
                <div class="icon-sidebar" v-html="require('../../../assets/images/icons/sidebar/icon-transfer-pulsa.svg')"></div>
                <span>Withdrawal</span>
                <div class="caret-custom"></div>
            </template>
            <el-menu-item index="38-1">
                <router-link v-bind:to="'/withdrawal'">
                    <span>History Withdrawal</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="38-2" v-if="$dataRole['cashoutpoint.list']">
                <router-link v-bind:to="'/withdrawal/cashoutpoint'">
                    <span>Cash Out Point</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="38-3" v-if="$dataRole['review.list']">
                <router-link v-bind:to="'/withdrawal/review'">
                    <span>Reviews</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="38-4" v-if="$dataRole['withdrawal.setting']">
                <router-link v-bind:to="'/withdrawal/setting'">
                    <span>Withdrawal Setting</span>
                </router-link>
            </el-menu-item>
        </el-submenu>
    </div>
</template>

<script>
export default {
    name: 'sidebar-menu-agent'
}
</script>
