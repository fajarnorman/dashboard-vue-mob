<template>
    <div class="content-wrapper">
        <div id="report">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Transaksi Klaim</h4>
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
                        <div class="" v-if="itemsData">
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <div class="grand-total">
                                <span>Grand total</span>
                                Rp. {{formatPrice(grandTotal)}}
                            </div>

                            <div class="filterSearching clearfix">
                                <div class="input-with-icons with-dropdowns clearfix">
                                    <el-input v-model="searchQuery" class="float-left" :disabled="searchKey == '' ? true : false">
                                        <el-select v-model="searchKey" slot="prepend" placeholder="Search by">
                                            <el-option label="MSISDN" value="msisdn"></el-option>
                                            <el-option label="TRX ID" value="trx_id"></el-option>
                                            <el-option label="Username" value="username"></el-option>
                                        </el-select>
                                    </el-input>
                                    <img src="~assets/images/icons/search1.png">
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
                                <el-select v-model="supplierQuery">
                                    <el-option value="" label="All Supplier">All Supplier</el-option>
                                    <el-option 
                                        v-for="(dataFilterSup, indexSup) in $dataSupplier"
                                        :key="indexSup"
                                        :value="dataFilterSup"
                                        :label="(dataFilterSup).toUpperCase()">{{(dataFilterSup).toUpperCase()}}</el-option>
                                </el-select>
                            </div>

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Status" name=""></el-tab-pane>
                                    <el-tab-pane label="Success" name="success"></el-tab-pane>
                                    <el-tab-pane label="Pending" name="pending"></el-tab-pane>
                                    <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                                    <el-tab-pane label="Expired" name="expired"></el-tab-pane>
                                </el-tabs>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="trx_id" label="Transaction ID" width="200"></el-table-column>
                                <el-table-column prop="msisdn" label="MSISDN" width="120"></el-table-column>
                                <el-table-column prop="supplier" label="Supplier" width="120"></el-table-column>
                                <el-table-column prop="payment_method" label="Payment Method" width="140"></el-table-column>
                                <el-table-column label="Status" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="(scope.row.status == 'success')" class="badge success">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'pending')" class="badge pending">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'failed')" class="badge failed">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'expired')" class="badge failed">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'start_payment')" class="badge pending">{{scope.row.status}}</span>
                                        <span v-else>{{scope.row.status}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Claim Date" width="150"></el-table-column>
                                <el-table-column label="Base price" width="120">
                                    <template slot-scope="scope">
                                        Rp.{{ formatPrice(scope.row.base_price * scope.row.point_value) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="In Rupiah" width="120">
                                    <template slot-scope="scope">
                                        Rp.{{ formatPrice(scope.row.total * scope.row.point_value) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Point" width="120">
                                    <template slot-scope="scope">
                                        {{parseInt(scope.row.total)}}
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div class="mobayar-actions-bottom clearfix">
                                <div class="total-report clearfix">
                                    <div class="span-report" style="margin-left: 15px;">
                                        <span>Total Poin: </span>
                                        {{getTotalPoint}}
                                    </div>
                                    <div class="span-report">
                                        <span>Total In Rupiah: </span>
                                        Rp. {{formatPrice(getPriceTotal)}}
                                    </div>
                                </div>
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

                                <div class="content" v-if="itemDataDetail">
                                    <header class="clearfix">
                                        <h4>Detail Laporan Transaksi Claim</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                        
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Laporan</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Transaction ID">
                                                                {{itemDataDetail.trx_id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="MSISDN">
                                                                {{itemDataDetail.msisdn}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="SKU">
                                                                {{itemDataDetail.name}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Supplier">
                                                                {{itemDataDetail.supplier}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Type Transaction">
                                                                {{itemDataDetail.trx_type}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                <span v-if="(itemDataDetail.status == 'success')" class="badge success inline">{{itemDataDetail.status}}</span>
                                                                <span v-else-if="(itemDataDetail.status == 'pending')" class="badge pending inline">{{itemDataDetail.status}}</span>
                                                                <span v-else-if="(itemDataDetail.status == 'failed')" class="badge failed inline">{{itemDataDetail.status}}</span>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="User">
                                                                <span>{{itemDataDetail.fullname}}</span>
                                                                (<span @click.prevent="gotoUser(itemDataDetail.user_id)" style="color: blue;cursor:pointer;">{{itemDataDetail.username}}</span>)
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Claim Date">
                                                                {{itemDataDetail.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Base Price">
                                                                Rp.{{ formatPrice(itemDataDetail.base_price * itemDataDetail.point_value) }}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="In Rupiah">
                                                                Rp.{{ formatPrice(itemDataDetail.total * itemDataDetail.point_value) }}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Poin">
                                                                {{parseInt(itemDataDetail.total)}}
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
    import XLSX from 'xlsx'
    import FUNCTIONS from '@/functions'
    
    import JQuery from 'jquery'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__transaksi__claim',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportTransaction/claim',
                sectionDetailApi: 'reportTransactionDetail',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',
                searchKey: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.claim'])
        },
        mounted () {
            // this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '')
        },
        watch: {
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newFilter){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            supplierQuery: function(newSupplier){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateRange: function(newdaterange){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newdaterange[0], newdaterange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto, status) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC&dateFrom=' + datefrom + '&dateTo=' + dateto + '&status=' + status + '&searchKey=' + this.searchKey + '&supplier=' + this.supplierQuery
            },

            // Get All Post
            getPosts(num, pg, sch, dtfrom, dtto, stat){
                let url = this.buildUrl(num, pg, sch, dtfrom, dtto, stat)
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
                        this.grandTotal = response.data.totalPrice
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
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
                            let url = this.apiURL + this.sectionApi + "?limit=" + this.totalPage + "&page=1" + '&search=' + this.searchQuery + '&direction=DESC&dateFrom=' + this.dateRange[0] + '&dateTo=' + this.dateRange[1] + '&status=' + this.filterQuery + '&searchKey=' + this.searchKey + '&supplier=' + this.supplierQuery + '&export=1'

                            this.loadingExcel = true
                            this.axios.get(url)
                            .then(response => { 
                                if(response.data.status == 'success'){
                                    databeforeExcel = response.data.data

                                    this.loadingExcel = false

                                    databeforeExcel.forEach(function(currentValue, i, arr){
                                        exportToExcel.push(
                                            {
                                                'Transaksi ID' : currentValue.trx_id,
                                                'MSISDN' : currentValue.msisdn,
                                                'SKU' : currentValue.name,
                                                'Supplier' : currentValue.supplier,
                                                'Tipe' : currentValue.trx_type,
                                                'Status' : currentValue.status,
                                                'Nama Lengkap' : currentValue.fullname,
                                                'Username' : currentValue.username,
                                                'Tanggal Klaim' : currentValue.created_at,
                                                'Base Price' : (parseInt(currentValue.base_price) * parseInt(currentValue.point_value)),
                                                'In Rupiah' : (parseInt(currentValue.total) * parseInt(currentValue.point_value)),
                                                'Poin': parseInt(currentValue.total),
                                            }
                                        )
                                    })

                                    let filename = "transaksi-klaim-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                                    var wscols = [
                                        {wch:30},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:40},
                                        {wch:20},
                                        {wch:40},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                    ];

                                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                                    datas['!cols'] = wscols;
                                    var wb = XLSX.utils.book_new()
                                    XLSX.utils.book_append_sheet(wb, datas, 'Laporan Transaksi Klaim')
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
            }, 800),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                    // this.itemDataDetail = val
                    this.getDetailTransaction(val)
                }
            },

            getDetailTransaction(value){
                let url = this.apiURL + this.sectionDetailApi + '/' + value.id
                this.loadingForm = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        this.errored = true
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        this.itemDataDetail = response.data.data 
                    }
                })
                .catch(error => { 

                })
                .finally(() => this.loadingForm = false)
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },
        },
        computed: {
            // Get Total Price per showing data
            getPriceTotal: function(){
                let total = [];

                this.itemsData.forEach(element => {
                    let price = parseFloat(element.total) * parseFloat(element.point_value)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },

            getTotalPoint: function(){
                let totalpoint = [];

                this.itemsData.forEach(element => {
                    let point = parseInt(element.total)
                    totalpoint.push(point)
                });

                return totalpoint.reduce(function(totalpoint, nume){ return totalpoint + nume }, 0);
            },

            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy(){
            this.itemsData = []
            this.itemDataDetail = []
            this.searchQuery = ''
            this.dateRange = []
            this.grandTotal = ''
            this.totalPage = ''
            this.filterQuery = ''
            this.supplierQuery = ''
            this.searchKey = ''
            this.messageerror = ''
            this.messagesuccess = ''
        }
    }
</script>