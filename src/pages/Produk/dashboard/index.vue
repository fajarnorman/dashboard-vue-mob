<template>
    <div class="content-wrapper">
        <div id="dashboard">
            <div class="page-header">
                <div class="page-header-content clearfix">
                    <div class="page-title float-left">
                        <h4><span class="text-semibold">Dashboard</span> Anda</h4>
                    </div>
                    <div class="float-right" style="margin-top: 10px;" v-if="$dataRole['dashboard.list']">
                        <el-button round class="button-outline-green float-right" @click.prevent="getRefreshData">
                            <div v-show="(loadingRefresh != true)">Refresh Saldo</div>
                            <div v-show="(loadingRefresh == true)" class="lds-ring"><div></div><div></div><div></div><div></div></div>
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <h2 style="margin-top: 30px;">Welcome, {{getUsernameName}}</h2>
                </section>
                <div v-else>
                    <div v-if="$dataRole['dashboard.list']">
                        <div class="content-gutter">
                            <el-row :gutter="20">
                                <div class="saldo-list-dashboard" v-if="loadingDataSaldo == false">
                                    <el-col :span="12" :xs="24" 
                                        v-for="(val,key,index) in itemsSaldo"
                                        :key="index"
                                        :class="{'full-width' : index == Object.keys(itemsSaldo).length - 1 && isOdd(Object.keys(itemsSaldo).length) !== 0}">
                                        <div class="cards green">
                                            <h6 class="panel-title"><b>Saldo {{key.replace(/[_-]/g, " ")}}</b></h6>
                                            <div class="cards-content clearfix">
                                                <h5 class="text-semibold no-margin" v-if="val !== null">
                                                    <div class="sakalagunaCurrentBalance" v-if="loadingRefresh == false">
                                                        <span>Rp. </span>{{formatPrice(val)}}
                                                    </div> 
                                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div>
                                                </h5>
                                                <h5 class="text-semibold no-margin empty-data-saldo" v-else>
                                                    <div v-if="loadingRefresh == false">
                                                        Data Kosong
                                                    </div>
                                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div>
                                                </h5>
                                            </div>
                                        </div>
                                    </el-col>
                                </div>
                                <div v-else>
                                    <el-col :span="24" :xs="24" style="text-align: center;">
                                        <div style="font-size: 18px;">Loading Data Saldo <div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
                                    </el-col>
                                </div>

                                <el-col :span="24" class="floating-points-dashboard">
                                    <div class="floating-points">
                                        <div class="cards clearfix">
                                            <h4 class="title float-left">Floating Poin</h4>
                                            <el-date-picker
                                                class="date-range-picker float-right"
                                                v-model="dateFloating"
                                                type="year"
                                                format="yyyy"
                                                value-format="yyyy"
                                                placeholder="Pick a month">
                                            </el-date-picker>
                                        </div>
                                        <el-table 
                                            :data="itemsFloating" 
                                            @current-change="handleCurrentChange"
                                            empty-text="No data available in table"
                                            ref="singleTable"
                                            v-loading="loading"
                                            class="mobayar-table">
                                            <el-table-column label="Bulan">
                                                <template slot-scope="scope">
                                                    <b>{{scope.row.month}}</b>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Balance Awal" align="center" width="220">
                                                <template slot-scope="scope">
                                                    {{formatPrice(scope.row.fpBeginning.total)}}
                                                    <div class="total">(Rp. {{formatPrice(scope.row.fpBeginning.total * scope.row.ptMultiplier)}})</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Klaim" align="center" width="220">
                                                <template slot-scope="scope">
                                                    {{formatPrice(scope.row.minusPoints.total)}}
                                                    <div class="total">(Rp. {{formatPrice(scope.row.minusPoints.total * scope.row.ptMultiplier)}})</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Total Top Up" align="center" width="220">
                                                <template slot-scope="scope">
                                                    {{formatPrice(scope.row.plusPoints.total)}}
                                                    <div class="total">(Rp. {{formatPrice(scope.row.plusPoints.total * scope.row.ptMultiplier)}})</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Balance Akhir" align="center" width="220">
                                                <template slot-scope="scope">
                                                    {{formatPrice(scope.row.fpEnding.total)}}
                                                    <div class="total">(Rp. {{formatPrice(scope.row.fpEnding.total * scope.row.ptMultiplier)}})</div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="base-template-sidebar">
                                            <div class="content">
                                                <header class="clearfix">
                                                    <h4>Floating Poin - {{itemsFloatingDetail.month}}</h4>
                                                    <el-button @click="closeModal()"><img src=""></el-button>
                                                </header>
                                                <section v-if="itemsFloatingDetail">
                                                    <el-form :model="forms" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                                        <div v-if="itemsFloatingDetail.fpBeginning">
                                                            <div class="item-forms-details" v-if="itemsFloatingDetail.fpBeginning.data.length > 0">
                                                                <h5>BALANCE AWAL</h5>
                                                                <div class="forms-details">
                                                                    <el-row :gutter="20">
                                                                        <el-col 
                                                                            :span="8" 
                                                                            v-for="(datafirstBalance, indexfirstBalance) in itemsFloatingDetail.fpBeginning.data"
                                                                            :key="indexfirstBalance">
                                                                            <div class="field-forms">
                                                                                <h5 class="title" v-if="datafirstBalance.reference_type == 'transaction_sku'">Trans. Digital</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'transaction_item'">Trans. DGW</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'transaction_sku_bonus'">Bonus Trans.</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'admin'">Admin</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'referral'">Referral</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'referral_second_level'">Referral 2nd Lvl.</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'bonus'">Bonus</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'topup'">Topup</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'withdraw'">Withdraw</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'gamification'">Gamification</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'other'">Lain-lain</h5>
                                                                                <h5 class="title" v-else-if="datafirstBalance.reference_type == 'claim_item'">Claim Item</h5>
                                                                                <div class="field-disable">{{formatPrice(datafirstBalance.points)}}</div>
                                                                            </div>
                                                                        </el-col>
                                                                    </el-row>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="itemsFloatingDetail.minusPoints">
                                                            <div class="item-forms-details" v-if="itemsFloatingDetail.minusPoints.data.length > 0">
                                                                <h5>KLAIM</h5>
                                                                <div class="forms-details">
                                                                    <el-row :gutter="20">
                                                                        <el-col 
                                                                            :span="8" 
                                                                            v-for="(dataklaimBalance, indexklaimBalance) in itemsFloatingDetail.minusPoints.data"
                                                                            :key="indexklaimBalance">
                                                                            <div class="field-forms">
                                                                                <h5 class="title" v-if="dataklaimBalance.reference_type == 'transaction_sku'">Trans. Digital</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'transaction_item'">Trans. DGW</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'transaction_sku_bonus'">Bonus Trans</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'admin'">Admin</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'referral'">Referral</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'referral_second_level'">Referral 2nd Lvl.</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'bonus'">Bonus</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'topup'">Topup</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'withdraw'">Withdraw</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'gamification'">Gamification</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'other'">Lain-lain</h5>
                                                                                <h5 class="title" v-else-if="dataklaimBalance.reference_type == 'claim_item'">Claim Item</h5>
                                                                                <div class="field-disable">{{formatPrice(dataklaimBalance.points)}}</div>
                                                                            </div>
                                                                        </el-col>
                                                                    </el-row>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="itemsFloatingDetail.minusPoints">
                                                            <div class="item-forms-details" v-if="itemsFloatingDetail.plusPoints.data.length > 0">
                                                                <h5>TOTAL TOP UP</h5>
                                                                <div class="forms-details">
                                                                    <el-row :gutter="20">
                                                                        <el-col 
                                                                            :span="8" 
                                                                            v-for="(datatoptupBalance, indextoptupBalance) in itemsFloatingDetail.plusPoints.data"
                                                                            :key="indextoptupBalance">
                                                                            <div class="field-forms">
                                                                                <h5 class="title" v-if="datatoptupBalance.reference_type == 'transaction_sku'">Trans. Digital</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'transaction_item'">Trans. DGW</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'transaction_sku_bonus'">Bonus Trans</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'admin'">Admin</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'referral'">Referral</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'referral_second_level'">Referral 2nd Lvl.</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'bonus'">Bonus</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'topup'">Topup</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'withdraw'">Withdraw</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'gamification'">Gamification</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'other'">Lain-lain</h5>
                                                                                <h5 class="title" v-else-if="datatoptupBalance.reference_type == 'claim_item'">Claim Item</h5>
                                                                                <div class="field-disable">{{formatPrice(datatoptupBalance.points)}}</div>
                                                                            </div>
                                                                        </el-col>
                                                                    </el-row>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="itemsFloatingDetail.fpEnding">
                                                            <div class="item-forms-details" v-if="itemsFloatingDetail.fpEnding.data.length > 0">
                                                                <h5>BALANCE AKHIR</h5>
                                                                <div class="forms-details">
                                                                    <el-row :gutter="20">
                                                                        <el-col 
                                                                            :span="8" 
                                                                            v-for="(dataEndBalance, indexEndBalance) in itemsFloatingDetail.fpEnding.data"
                                                                            :key="indexEndBalance">
                                                                            <div class="field-forms">
                                                                                <h5 class="title" v-if="dataEndBalance.reference_type == 'transaction_sku'">Trans. Digital</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'transaction_item'">Trans. DGW</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'transaction_sku_bonus'">Bonus Trans</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'admin'">Admin</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'referral'">Referral</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'referral_second_level'">Referral 2nd Lvl.</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'bonus'">Bonus</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'topup'">Topup</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'withdraw'">Withdraw</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'gamification'">Gamification</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'other'">Lain-lain</h5>
                                                                                <h5 class="title" v-else-if="dataEndBalance.reference_type == 'claim_item'">Claim Item</h5>
                                                                                <div class="field-disable">{{formatPrice(dataEndBalance.points)}}</div>
                                                                            </div>
                                                                        </el-col>
                                                                    </el-row>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-form>
                                                </section>
                                            </div>
                                            <div class="actions-button clearfix">
                                                <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <!-- <el-col :span="24">
                                    <div class="cards" style="margin-top: 20px;">
                                        <div class="header-chart clearfix" style="margin-bottom: 15px;">
                                            <h4 class="float-left">Transaksi Digital Tahun 2018</h4>
                                        </div>
                                        <canvas id="planet-chart"></canvas>
                                    </div>
                                </el-col> -->
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .saldo-list-dashboard{
        .el-col{
            margin-bottom: 20px;
            &.full-width{
                width: 100%;
            }
        }
    }
    .dashboard-saldo-list{
        margin-bottom: 20px;
    }
    .content-gutter{
        margin-top: 20px;
        .header-chart{
            h4{
                font-size: 16px;
                margin-bottom: 15px;
            }
        }
    }
    #dashboard{
        .lds-ring{
            div{
                border: 2px solid #800080;
                border-color: #800080 transparent transparent transparent;
            }
        }
        .cards{
            padding: 20px;
            .panel-title{
                text-transform: capitalize;
            }
            .cards-content{
                h5{
                    &.empty-data-saldo{
                        font-size: 30px;
                    }
                }
            }
        }
        .floating-points{
            margin-top: 25px;
            background: #fff;
            .el-input__suffix{
                display: none;   
            }
            .cards{
                padding: 15px 20px;
                border-bottom: 0;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                .title{
                    margin: 7px 0 0;
                    font-size: 16px;
                }
                .date-range-picker{
                    max-width: 100px;
                    &.el-date-editor{
                        .el-input__prefix{
                            .el-icon-date{
                                &:before{
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .mobayar-table{
            thead{
                tr{
                    th{
                        padding: 9px 10px;
                    }
                }
            }
            tbody{
                tr{
                    td{
                        padding: 9px 10px;
                        .total{
                            display: block;
                            margin-top: -5px;
                            font-size: 12px;
                            color: #919eab;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    // import Chart from 'chart.js'
    // import planetChartData from '../functions/chart-data.js'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'dashboard',
        data () {
            return {
                apiUrl: process.env.ROOT_API,
                sectionApi: 'dashboards',
                sectionApiFloatingPoint: '/floatingPoint',
                itemsSaldo: [],
                saldoSepulsa: '',
                saldoSakalaguna: '',
                saldoSepulsanoRP: '',
                saldoSakalagunanoRP: '',
                loading: false,
                errored: false,
                loadingRefresh: false,
                loadingDataSaldo: false,
                // planetChartData: planetChartData,
                dateRange: '',
                dateFloating: '2019',
                itemsFloating: [],
                itemsFloatingDetail: [],
                forms: {},

                // for error counting
                countErrorPost: 0,
                countErrorFloating: 0,
                
                getUsernameName: this.$fullName,
            }
        },
        mounted(){
            this.getPosts('')
            this.getPostFloatingPoint()
            // this.createChart('planet-chart', this.planetChartData)
        },
        watch:{
            dateFloating: function(dateFloating){
                this.getPostFloatingPoint()
            }
        },
        methods: {
            buildUrl () {
                return this.apiUrl + this.sectionApi
            },
            buildUrlFloatingPoint(){
                return this.apiUrl + this.sectionApi + this.sectionApiFloatingPoint + '?year=' + this.dateFloating
            },
            getPosts(){
                let url = this.buildUrl()
                this.loadingDataSaldo = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.message == 'Akses ditolak!'){
                        this.errored = true
                    }else if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                        FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsSaldo = response.data.data.balances
                    }
                })
                .catch(error => {
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts()
                    }
                })
                .finally(() => {
                    this.loadingDataSaldo = false
                })
            },
            getPostFloatingPoint(){
                let url = this.buildUrlFloatingPoint()
                this.loading = true
                var countError = 0
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsFloating = response.data.data
                    }
                })
                .catch(error => {
                    this.countErrorFloating++
                    if(this.countErrorFloating >= 3){
                        this.errored = true
                    }else{
                        this.getPostFloatingPoint()
                    }
                })
                .finally(() => {
                    this.loading = false
                })
            },
            getRefreshData(){
                let url = this.buildUrl()
                this.loadingRefresh = true
                this.axios.get(url)
                .then(response => {
                    this.itemsSaldo = response.data.data.balances
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loadingRefresh = false)
            },
            isOdd(num) { return num % 2;},

            // createChart(chartId, chartData) {
            //     const ctx = document.getElementById(chartId);
            //     const myChart = new Chart(ctx, {
            //         type: chartData.type,
            //         data: chartData.data,
            //         options: chartData.options,
            //     });
            // },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(0).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing')
                    document.querySelector('.backdrop').classList.add('show')
                    document.querySelector('body').classList.add('no-scroll')
                    this.itemsFloatingDetail = val
                }
            },
            
            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing')
                document.querySelector('.backdrop').classList.remove('show')
                document.querySelector('body').classList.remove('no-scroll')
                this.$refs.singleTable.setCurrentRow(row)
            },
        },
        computed:{
            removeRP: function(value){
                return value.substring(3)
            }
        },
        beforeDestroy() {
            this.saldoSepulsa = ''
            this.saldoSakalaguna = ''
            this.saldoSepulsanoRP = ''
            this.saldoSakalagunanoRP = ''
            this.getUsernameName = ''
            this.itemsSaldo = []
        }
    }
</script>