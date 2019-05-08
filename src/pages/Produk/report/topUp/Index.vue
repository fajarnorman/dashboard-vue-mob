<template>
    <div class="content-wrapper">
        <div id="user">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Top Up</h4>
                        <div class="add-actions">
                            <a @click.prevent="getExcel" class="float-right">
                                <el-button class="button-outline-green" round>
                                    <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)"> 
                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                                </el-button>
                            </a>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="grand-total">
                            <span>Grand total</span>
                            Rp. {{formatPrice(grandTotal)}}
                        </div>

                        <div v-if="messagesuccess">
                            <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                        </div>

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

                            <el-select v-model="metodeTopup" placeholder="Select Metode">
                                <el-option value="" label="Semua Metode">Semua Metode</el-option>
                                <el-option value="alfamart" label="Alfamart">ALFAMART</el-option>
                                <el-option value="manual_transfer" label="Manual Transfer">Manual Transfer</el-option>
                                <el-option value="instant_topup" label="Instan Topup">Instan Topup</el-option>
                                <el-option value="promo_code" label="Promo Code">Promo Code</el-option>
                            </el-select>

                            <div class="another-metode">
                                <div v-show="(metodeTopup == 'promo_code')">
                                    <span>Promo Code</span>
                                    <el-input v-model="promoCode"></el-input>
                                </div>
                                <div v-show="(metodeTopup == 'manual_transfer' || metodeTopup == 'instant_topup')">
                                    <span>Pilih Bank</span>
                                    <el-select v-model="bankmetode" placeholder="Pilih Bank" :popper-append-to-body="false">
                                        <el-option value="" label="Semua Bank">Semua Bank</el-option>
                                        <!-- <el-option value="bni" label="BNI">BNI</el-option>
                                        <el-option value="bca" label="BCA">BCA</el-option>
                                        <el-option value="bri" label="BRI">BRI</el-option>
                                        <el-option value="permata" label="Permata">Permata</el-option>
                                        <el-option value="mandiri" label="Mandiri">Mandiri</el-option> -->
                                        <el-option 
                                            v-for="bank in itemsBank"
                                            :value="bank"
                                            :label="bank"
                                            :key="bank">
                                            {{bank}}
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>

                            <el-button 
                                class="button-white-green" 
                                round 
                                style="margin-left: 10px;float:left;"
                                @click.prevent="filterMetode">Filter</el-button>
                        </div>

                        <div class="filterstatus">
                            <el-tabs v-model="statusSearch">
                                <el-tab-pane label="Semua Status" name=""></el-tab-pane>
                                <el-tab-pane label="Approved" name="approved"></el-tab-pane>
                                <el-tab-pane label="User Confirmed" name="user%20confirmed"></el-tab-pane>
                                <el-tab-pane label="Waiting Confirmation" name="waiting%20confirmation"></el-tab-pane>
                                <el-tab-pane label="Pending" name="pending"></el-tab-pane>
                                <el-tab-pane label="Expired" name="expired"></el-tab-pane>
                                <el-tab-pane label="Rejected" name="rejected"></el-tab-pane>
                            </el-tabs>
                        </div>

                        <el-table 
                            :data="itemsData" 
                            max-height="530" 
                            empty-text="No data available in table"
                            @current-change="handleCurrentChange"
                            ref="singleTable"
                            v-loading="loading"
                            class="mobayar-table">
                            <el-table-column prop="trx_id" label="Transaction ID" width="180"></el-table-column>
                            <el-table-column label="User" width="130">
                                <template slot-scope="scope">
                                    <span v-if="(scope.row.user != '')" style="text-align: left;display:block">
                                        {{scope.row.user.fullname}}<br>
                                        <b>{{scope.row.user.username}}</b><br>
                                        {{scope.row.user.phone_number}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="Payment Method" width="160" align="center">
                                <template slot-scope="scope" align="center">
                                    <div v-if="(scope.row.payment_method == 'bank_bni_')">Manual Transfer BNI</div>
                                    <div v-else-if="(scope.row.payment_method == 'bank_bri_')">Manual Transfer BRI</div>
                                    <div v-else-if="(scope.row.payment_method == 'bank_bca_')">Manual Transfer BCA</div>
                                    <div v-else-if="(scope.row.payment_method.substring(0, 2) == 'va')">
                                        <span style="display:block;">Instant Topup</span>
                                        <b>{{scope.row.payment_method}}</b>
                                    </div>
                                    <div v-else-if="(scope.row.payment_method == 'promo_code')">
                                        <span style="display:block;">Promo Code</span>
                                        <b>{{scope.row.promo_code}}</b>
                                    </div>
                                    <div v-else-if="(scope.row.payment_method.substring(0, 5) == 'alfa_')">
                                        <span style="display:block;">Alfamart</span>
                                        <b>{{scope.row.payment_method}}</b>
                                    </div>
                                    <div v-else>{{scope.row.payment_method}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Status" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.status}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Amount" width="150">
                                <template slot-scope="scope">
                                    Rp.{{formatPrice(scope.row.amount)}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Admin Fee" align="center" width="100">
                                <template slot-scope="scope">
                                    <span v-if="(scope.row.admin_fee != 0)">Rp. {{formatPrice(scope.row.admin_fee)}}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="Total" width="150">
                                <template slot-scope="scope">
                                    <span v-if="(scope.row.total)">
                                        Rp. {{formatPrice(scope.row.total)}}
                                        <b v-if="scope.row.bonus !== 0 && scope.row.bonus !== '0.00'" style="display:block;">+{{formatPrice(scope.row.bonus)}}</b>
                                    </span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="created_at" label="Created at" width="150"></el-table-column>
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
                                <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalData)}}</span>
                                <el-pagination
                                    layout="prev, pager, next"
                                    :total="parseInt(totalData)"
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

                            <div class="content" v-if="itemDataDetail">
                                <header class="clearfix">
                                    <h4>Laporan Topup</h4>
                                    <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                </header>
                                <section>
                                    <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                        <div class="item-forms-details">
                                            <h5>Info Laporan</h5>
                                            <div class="forms-details">
                                                <el-row :gutter="20">
                                                    <el-col :span="12">
                                                        <el-form-item label="TRX ID">
                                                            {{itemDataDetail.trx_id}}
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Username">
                                                            <div v-if="itemDataDetail.user">
                                                                <b>{{itemDataDetail.user.username}}</b>
                                                            </div>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Fullname">
                                                            <div v-if="itemDataDetail.user">
                                                                {{itemDataDetail.user.fullname}}
                                                            </div>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="No. Handphone">
                                                            <div v-if="itemDataDetail.user">
                                                                {{itemDataDetail.user.phone_number}}
                                                            </div>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Payment Method">
                                                            <div v-if="itemDataDetail.payment_method" style="line-height: normal;">
                                                                <div v-if="(itemDataDetail.payment_method == 'bank_bni_')">Manual Transfer BNI</div>
                                                                <div v-else-if="(itemDataDetail.payment_method == 'bank_bri_')">Manual Transfer BRI</div>
                                                                <div v-else-if="(itemDataDetail.payment_method == 'bank_bca_')">Manual Transfer BCA</div>
                                                                <div v-else-if="(itemDataDetail.payment_method.substring(0, 2) == 'va')">
                                                                    <span style="display: block;">Instant Topup</span>
                                                                    {{itemDataDetail.payment_method}}
                                                                </div>
                                                                <div v-else-if="(itemDataDetail.payment_method == 'promo_code')">
                                                                    <span style="display: block;">Promo Code</span>
                                                                </div>
                                                                <div v-else>{{itemDataDetail.payment_method}}</div>
                                                            </div>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Amount">
                                                            Rp. {{formatPrice(itemDataDetail.amount)}}
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Admin Fee">
                                                            Rp. <span v-if="(itemDataDetail.admin_fee)">{{itemDataDetail.admin_fee}}</span>
                                                                <span v-else>-</span>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Total">
                                                            Rp. <span v-if="(itemDataDetail.total)">{{formatPrice(itemDataDetail.total)}}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-form-item label="Created At">
                                                            {{itemDataDetail.created_at}}
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
                                <el-button 
                                    class="button-white-green" 
                                    id="save" 
                                    @click.prevent="actionTopups('manual_confirmation', itemDataDetail)"
                                    v-if="metodeTopup == 'alfamart' 
                                    && (statusSearch == 'expired' 
                                        || statusSearch == 'pending' 
                                        || itemDataDetail.status == 'expired' 
                                        || itemDataDetail.status == 'pending') 
                                    && $dataRole['topup.approve.alfa']">Konfirmasi Manual</el-button>
                                <el-button 
                                    class="button-white-green" 
                                    id="save" 
                                    @click.prevent="actionTopups('check_status_mitrans', itemDataDetail)"
                                    v-if="metodeTopup == 'instant_topup' 
                                    && (statusSearch == 'expired' 
                                        || statusSearch == 'pending' 
                                        || itemDataDetail.status == 'expired' 
                                        || itemDataDetail.status == 'pending') 
                                    && $dataRole['topup.check.midtrans']">Cek Status ke Midtrans</el-button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import FUNCTIONS from '@/functions'
    

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__topup',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportTopup',
                sectionApiDoku: 'approveDoku',
                sectionApiMitrans: 'checkMidtransStatus',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsBank: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                filterStatus: '',
                totalData: '',
                grandTotal: '',
                metodeTopup: '',
                bankmetode: '',
                promoCode: '',
                statusSearch: '',
                moreFilter: false,
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                messagesuccess: '',

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.topup'])
        },
        mounted () {
            // this.getPosts(this.perPage, this.currentPage, '', '', '', '', this.dateRange[0], this.dateRange[1])
        },
        watch: {
            // always watch this function for change
            // searchQuery: function (newQuestion) {
            //     this.getResult()
            //     document.querySelector('.el-pagination').children[1].children[0].click()
            // },
            filterQuery: function(newFilter){
                this.getResultFilter()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            // dateRange: function(newDateRange){
            //     this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, newDateRange[0], newDateRange[1])
            //     document.querySelector('.el-pagination').children[1].children[0].click()
            // },
            statusSearch: function(newStatus){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            buildUrl (limit, page, search, type, bank, promocode, startDate, endDate, status = this.statusSearch) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&type=' + type + '&bank=' + bank + '&promo_code=' + promocode + '&start_date=' + startDate + '&end_date=' + endDate + '&status=' + status
            },

            // Get All Post
            getPosts(num, pg, sch, type, bank, promo, dateStart, dateEnd){
                let url = this.buildUrl(num, pg, sch, type, bank, promo, dateStart, dateEnd)
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
                        this.itemsBank = response.data.banks 
                        this.totalData = response.data.totalData
                        this.grandTotal = response.data.totalAmount
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, '', '', '', '', this.dateRange[0], this.dateRange[1])
                    }
                })
                .finally(() => this.loading = false)
            },

            // Get Excel Download
            getExcel(){
                if(this.itemsData.length != 0){
                    let getDateMonth_1 = new Date(this.dateRange[0]).getMonth() + 1
                    let getDateMonth_2 = new Date(this.dateRange[1]).getMonth() + 1
                    let getYear_1 = new Date(this.dateRange[0]).getFullYear()
                    let getYear_2 = new Date(this.dateRange[1]).getFullYear()

                    if((getYear_1 - getYear_2) == 0){
                        if((getDateMonth_1 - getDateMonth_2) == 0){
                            let databeforeExcel = [];
                            let exportToExcel = [];

                            let url = this.buildUrl(this.totalData, '1', this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                            this.loadingExcel = true
                            this.axios.get(url)
                            .then(response => { 
                                if(response.data.status == 'success'){
                                    databeforeExcel = response.data.data

                                    this.loadingExcel = false
                                    // let methodPayment = ''
                                    // let vaPayment = ''
                                    // let promoCode = ''

                                    databeforeExcel.forEach(function(currentValue, i, arr){
                                        // if(currentValue.payment_method == 'bank_bni_'){
                                        //     methodPayment = 'Manual Transfer BNI'
                                        //     vaPayment = '-'
                                        //     promoCode = '-'
                                        // }else if(currentValue.payment_method == 'bank_bri_'){
                                        //     methodPayment = 'Manual Transfer BRI'
                                        //     vaPayment = '-'
                                        //     promoCode = '-'
                                        // }else if(currentValue.payment_method == 'bank_bca_'){
                                        //     methodPayment = 'Manual Transfer BCA'
                                        //     vaPayment = '-'
                                        //     promoCode = '-'
                                        // }else if((currentValue.payment_method).substring(0, 2) == 'va'){
                                        //     methodPayment = 'Instant Topup'
                                        //     vaPayment = currentValue.payment_method
                                        //     promoCode = '-'
                                        // }else if(currentValue.payment_method == 'promo_code'){
                                        //     methodPayment = 'Promo Code'
                                        //     vaPayment = '-'
                                        //     promoCode = currentValue.payment_method
                                        // }else{
                                        //     methodPayment = currentValue.payment_method
                                        //     vaPayment = '-'
                                        //     promoCode = '-'
                                        // }

                                        exportToExcel.push(
                                            {
                                                'No': i+1,
                                                'Transaction ID' : currentValue.trx_id,
                                                'Full Name' : currentValue.user.fullname,
                                                'Username' : currentValue.user.username,
                                                'Phone Number' : currentValue.user.phone_number,
                                                'Payment Method' : currentValue.payment_method,
                                                'Status': currentValue.status,
                                                'Amount' : parseInt(currentValue.amount),
                                                'Admin Fee' : parseInt(currentValue.admin_fee),
                                                'Total' : parseInt(currentValue.amount) + parseInt(currentValue.admin_fee),
                                                'Topup Bonus' : currentValue.bonus,
                                                'Created at' : currentValue.created_at,
                                            }
                                        )
                                    })

                                    let filename = "laporan-topup-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                                    var wscols = [
                                        {wch:6},
                                        {wch:30},
                                        {wch:20},
                                        {wch:15},
                                        {wch:15},
                                        {wch:30},
                                        {wch:15},
                                        {wch:15},
                                        {wch:15},
                                        {wch:15},
                                        {wch:15},
                                        {wch:25},
                                    ];

                                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                                    datas['!cols'] = wscols;
                                    var wb = XLSX.utils.book_new()
                                    XLSX.utils.book_append_sheet(wb, datas, 'Laporan Top Up')
                                    XLSX.writeFile(wb, filename+'.xlsx')
                                }else{
                                    this.loadingExcel = false
                                    this.$notify.error({
                                        title: 'Error',
                                        message: response.data.message
                                    });
                                }
                            })
                            .catch(error => { 
                                this.loadingExcel = false
                                this.$notify.error({
                                    title: 'Error',
                                    message: error.response.data.message
                                });
                            })
                        }else{
                            this.$notify.error({
                                title: 'Maaf',
                                message: 'Export tidak boleh lebih dari 1 bulan'
                            });
                        }
                    }else{
                        this.$notify.error({
                            title: 'Maaf',
                            message: 'Export tidak boleh lebih dari 1 bulan'
                        });
                    }
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Data Kosong'
                    });
                }
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
            }, 300),

            // Get Result data from select filter
            getResultFilter(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
            },
            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            filterMetode(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
            },
            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                    this.itemDataDetail = val
                }
            },
            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },
            actionTopups(value, data){
                this.messagesuccess = ''
                let textData, descData
                if(value == 'manual_confirmation'){
                    textData = 'Apakah anda yakin?'
                    descData = 'Saat anda klik OK, maka saldo akan langsung masuk ke User'
                }else{
                    textData = 'Cek status ke Midtrans'
                    descData = 'Jika status di Midtrans settlement, maka saldo akan langsung masuk ke User'
                }
                this.$confirm(descData, textData, {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    if(value == 'manual_confirmation'){
                        let urldoku = this.apiURL + this.sectionApiDoku
                        const formsData = new FormData()
                        formsData.append('order_id', 'topup_'+data.trx_id)
                        this.axios.post(urldoku, formsData)
                        .then(response => {
                            if(response.data.status == 'success'){
                                this.messagesuccess = response.data.message
                                this.closeModal()
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                            }else{
                                this.$notify.error({
                                    title: response.data.status,
                                    message: response.data.message
                                });
                            }
                        }).catch(error => {
                            console.log(error)
                            this.$notify.error({
                                title: 'Error',
                                message: error
                            });
                        })
                    }else{
                        let urlmitrans = this.apiURL + this.sectionApiMitrans
                        const formsDatas = new FormData()
                        formsDatas.append('order_id', 'topup_'+data.trx_id)
                        this.axios.post(urlmitrans, formsDatas)
                        .then(response => {
                            if(response.data.status == 'success'){
                                this.messagesuccess = response.data.message
                                this.closeModal()
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.metodeTopup, this.bankmetode, this.promoCode, this.dateRange[0], this.dateRange[1])
                            }else{
                                this.$notify.error({
                                    title: response.data.status,
                                    message: response.data.message
                                });
                            }
                        }).catch(error => {
                            console.log(error)
                            this.$notify.error({
                                title: 'Error',
                                message: error
                            });
                        })
                    }
                })
            }
        },
        computed: {
            // Get Total Price per showing data
            getPriceTotal: function(){
                let total = [];

                this.itemsData.forEach(element => {
                    let price = parseFloat(element.total)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },

            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy(){
            this.itemsData = []
            this.itemDataDetail = []
            this.itemsBank = []
            this.dateRange = []
            this.searchQuery = ''
            this.filterStatus = ''
            this.totalData = ''
            this.grandTotal = ''
            this.metodeTopup = ''
            this.bankmetode = ''
            this.promoCode = ''
            this.statusSearch = ''
        }
    }
</script>

<style lang="scss">
    .filterSearching{
        .el-select{
            margin-left: 0 !important;
        }
    }
</style>