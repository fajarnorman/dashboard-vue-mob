<template>
    <div class="content-wrapper">
        <div id="transaksi-penjualan">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Transaksi Pulsa</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="" v-if="itemsData">
                            <div class="filterSearching clearfix">
                                <div class="input-with-icons clearfix">
                                    <el-input v-model="searchQuery" class="float-left"></el-input>
                                    <img src='~assets/images/icons/search1.png'>
                                </div>
                                <el-date-picker
                                    class="date-range-picker"
                                    v-model="dateRange"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="Start date"
                                    end-placeholder="End date"
                                    :format="format"
                                    :value-format="format"></el-date-picker>

                                <div class="more-filter">
                                    <a href="#" @click.prevent="toggleMoreFilter()">
                                        More Filter
                                        <img v-if="(moreFilter == false)" src="~assets/images/icons/arrow-down.png">
                                        <img v-else src="~assets/images/icons/arrow-up.png">
                                    </a>
                                </div>

                                <div class="content-more-filter clearfix">
                                    <transition name="slide-down">
                                        <div v-show="(moreFilter == true)">
                                            <el-row :gutter="20">
                                                <el-col :span="5">
                                                    <el-select v-model="supplierQuery" placeholder="Transaction Supplier">
                                                        <el-option value="" label="Transaction Supplier">All Supplier</el-option>
                                                        <el-option value="narindo" label="Narindo">Narindo</el-option>
                                                        <el-option value="sakalaguna" label="Sakalaguna">Sakalaguna</el-option>
                                                        <el-option value="sepulsa" label="Sepulsa">Sepulsa</el-option>
                                                        <el-option value="bosbiller" label="Bosbiller">Bosbiller</el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-select v-model="ppobQuery" placeholder="Transaksi Digital Type">
                                                        <el-option label="Transaksi Digital Type" value="">All Transaksi Digital Type</el-option>
                                                        <el-option label="BPJS" value="bpjskes">BPJS</el-option>
                                                        <el-option label="Data" value="data">Data</el-option>
                                                        <el-option label="Pulsa" value="pulsa">Pulsa</el-option>
                                                        <el-option label="Game Voucher" value="gamevoucher">Game Voucher</el-option>
                                                        <el-option label="Mobile Post" value="mobilepost">Mobile Post</el-option>
                                                        <el-option label="PDAM" value="pdam">PDAM</el-option>
                                                        <el-option label="PLN Post" value="plnpost">PLN Post</el-option>
                                                        <el-option label="PLN Pre" value="plnpre">PLN Pre</el-option>
                                                        <el-option label="TELKOM" value="telkom">TELKOM</el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="8">
                                                    <span class="tittle-content-more">Transaction type</span>
                                                    <el-radio-group v-model="typeQuery">
                                                        <el-radio label="claim">Claim</el-radio>
                                                        <el-radio label="transaction">Transaction</el-radio>
                                                    </el-radio-group>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </transition>
                                </div>
                            </div>

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Status" name=""></el-tab-pane>
                                    <el-tab-pane label="Success" name="success"></el-tab-pane>
                                    <el-tab-pane label="Pending" name="pending"></el-tab-pane>
                                    <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                                </el-tabs>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="trx_id" label="No. Transaksi" width="200"></el-table-column>
                                <el-table-column label="Nama Agen" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.user">{{scope.row.user.fullname}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Nama Pelanggan" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.user">{{scope.row.user.fullname}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="msisdn" label="MSISDN"></el-table-column>
                                <el-table-column prop="supplier" label="Supplier"></el-table-column>
                                <el-table-column label="Total Transaksi">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.total)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Tanggal"></el-table-column>
                            </el-table>

                            <div class="mobayar-actions-bottom clearfix">
                                <div class="showing-page float-left">
                                    <span>View</span>
                                    <ul>
                                        <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                                        <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                                        <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                                        <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                                    </ul>
                                </div>
                                <div class="pagination-result float-right">
                                    <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                                    <el-pagination
                                        layout="prev, pager, next"
                                        :total="parseInt(totalPage)"
                                        @current-change="pageChange"
                                        :page-size="parseInt(perPage)">
                                    </el-pagination>
                                </div>
                            </div>

                            <!-- Detail, Edit, Create Forms -->
                            <div class="base-template-sidebar">
                                <!-- loading bar -->
                                <div class="el-loading-mask" v-show="(loadingForm == true)">
                                    <div class="el-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular">
                                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                        </svg>
                                    </div>
                                </div>

                                <div class="content">
                                    <header class="clearfix">
                                        <h4>Detail Transaksi Pulsa</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                        
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm" v-if="itemDataDetail">
                                            <div class="item-forms-details">
                                                <h5>Info Transaksi Pulsa</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID Transaksi">
                                                                {{itemDataDetail.trx_id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Transaksi Type">
                                                                {{itemDataDetail.trx_type}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Agen">
                                                                <div v-if="itemDataDetail.user">
                                                                    {{itemDataDetail.user.fullname}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Pelanggan">
                                                                <div v-if="itemDataDetail.user">
                                                                    {{itemDataDetail.user.fullname}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Type Trans. Digital">
                                                                {{itemDataDetail.type}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="MSISDN">
                                                                {{itemDataDetail.msisdn}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Catatan">
                                                                {{itemDataDetail.note}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Supplier">
                                                                {{itemDataDetail.supplier}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                {{itemDataDetail.status}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Transaksi">
                                                                {{itemDataDetail.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Total Transaksi">
                                                                Rp. {{formatPrice(itemDataDetail.total)}}
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Close</el-button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import FUNCTIONS from '@/functions'
    

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'transaksiPenjualan',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'transactionPpob',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsDataDetailBarang: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: 'DESC',
                order: 'created_at',
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',
                typeQuery: '',
                ppobQuery: '',
                getUserTotalData: '',
                moreFilter: false,
            }
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, this.filterQuery)

            if(window.location.hash) {
                let idURL = window.location.hash.substring(1)
                let that = this

                setTimeout(function(){
                    that.formsType = 'edit'
                    that.getDetailPost(idURL, 'edit-url')
                }, 1000)
            }
        },
        watch: {
            searchQuery: function(newQuery){
                this.getResult()
            },
            dateRange: function(newDateRange){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newDateRange[0], newDateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, this.filterQuery)
            },
            supplierQuery: function(newSupplier){
              this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], newSupplier, this.ppobQuery, this.typeQuery, this.filterQuery)  
            },
            ppobQuery: function(newPPOB){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, newPPOB, this.typeQuery, this.filterQuery)
            },
            typeQuery: function(newType){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, newType, this.filterQuery)
            },
            filterQuery: function(newStatus){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, newStatus)
            },
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto, supplier, ppobtype, trxType, status) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&order=' + this.order + '&search=' + search + '&direction=' + this.direction + '&start_date=' + datefrom + '&end_date=' + dateto + '&supplier=' + supplier + '&type=' + ppobtype + '&trx_type=' + trxType + '&status=' + status
            },

            // Get All Post
            getPosts(num, pg, sch, dtfrom, dtto, supp, ppob, trx, status){
                let url = this.buildUrl(num, pg, sch, dtfrom, dtto, supp, ppob, trx, status)
                this.loading = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        this.errored = true
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        this.itemsData = response.data.data 
                        this.totalPage = response.data.totalData
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, this.filterQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery, this.ppobQuery, this.typeQuery, this.filterQuery)
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['transaction.ppob.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.getDetailPost(val.id, 'edit')
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },

            getDetailPost(id, value){
                let that = this
                this.loadingForm = true
                let url = this.apiURL + this.sectionApi + '/' + id
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        if(value == 'edit-url'){
                            document.querySelector('.base-template-sidebar').classList.add('showing')
                            document.querySelector('.backdrop').classList.add('show')
                            document.querySelector('body').classList.add('no-scroll')
                        }
                        this.itemDataDetail = response.data.data
                    }
                })
                .finally(() => {
                    setTimeout(function(){
                        that.loadingForm = false
                    }, 1000)
                })
            },

            // close modal function
            closeModal(row){
                window.location.hash = ''
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                // this.$refs.formsvalid.resetFields();
            }, 

            toggleMoreFilter: function(){
                this.moreFilter = !this.moreFilter
            }
        }
    }
</script>

<style>

</style>
