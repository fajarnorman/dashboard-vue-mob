<template>
    <div class="content-wrapper">
        <div id="report">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Pemakaian Promo</h4>
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
                                Rp. <div v-if="grandTotal">{{formatPrice(grandTotal)}}</div><div v-else>0,00</div>
                            </div>

                            <div class="filterSearching clearfix">
                                <div class="input-with-icons clearfix">
                                    <el-input v-model="searchQuery" placeholder="Search Promo Code" class="float-left"></el-input>
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
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column label="Transaction ID" width="200">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.transaction !== null">
                                            {{scope.row.transaction.trx_id}}
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="SKU" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.transaction">
                                            <div v-if="scope.row.transaction.sku">
                                                {{scope.row.transaction.sku.name}}
                                            </div>
                                            <div v-else>-</div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
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
                                <el-table-column label="Username" width="100">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.user">
                                            {{scope.row.user.username}}
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Promo Code" width="190" align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.promotion">
                                            {{scope.row.promotion.name}}
                                            <b style="display:block;">{{scope.row.promo_code}}</b>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Original Amount" width="150" align="center">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.original_amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Discount Amount" width="150">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.disc_amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total" width="150">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.total)}}
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
                                    <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                                    <el-pagination
                                        layout="prev, pager, next"
                                        :total="parseInt(totalPage)"
                                        @current-change="pageChange"
                                        :page-size="parseInt(perPage)">
                                    </el-pagination>
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
    

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__usepromo',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportPromo',

                // for store data after get api
                itemsData: [],

                // another important variable data
                searchQuery: '',
                loading: true,
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

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.promotion'])
        },
        mounted () {
            // this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newFilter){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            supplierQuery: function(newSupplier){
                this.getPosts(this.perPage, this.currentPage, newSupplier, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateRange: function(newdaterange){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newdaterange[0], newdaterange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto, status) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC&from=' + datefrom + '&to=' + dateto + '&status=' + status
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
                        this.grandTotal = response.data.totalAmount
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

                            let url = this.buildUrl(this.totalPage, '1', this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                            this.loadingExcel = true
                            this.axios.get(url)
                            .then(response => { 
                                if(response.data.status == 'success'){
                                    databeforeExcel = response.data.data

                                    this.loadingExcel = false
                                    let trxId, skuName, userName, promoName

                                    databeforeExcel.forEach(function(currentValue, i, arr){
                                        trxId = currentValue.transaction == null ? '-' : currentValue.transaction.trx_id
                                        skuName = currentValue.transaction == null ? '-' : currentValue.transaction.sku.name
                                        userName = currentValue.user == null ? '-' : currentValue.user.username
                                        promoName = currentValue.promotion == null ? '-' : currentValue.promotion.name
                                        exportToExcel.push(
                                            {
                                                'Transaction ID' : trxId,
                                                'SKU' : skuName,
                                                'Status' : currentValue.status,
                                                'Username' : userName,
                                                'Promo Name' : promoName,
                                                'Promo Code' : currentValue.promo_code,
                                                'Amount' : parseInt(currentValue.original_amount),
                                                'Discount Amount' : parseInt(currentValue.disc_amount),
                                                'Total' : parseInt(currentValue.total),
                                                'Create At' : currentValue.created_at,
                                            }
                                        )
                                    })

                                    let filename = "pemakaian-promo-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                                    var wscols = [
                                        {wch:30},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:35},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                    ];

                                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                                    datas['!cols'] = wscols;
                                    var wb = XLSX.utils.book_new()
                                    XLSX.utils.book_append_sheet(wb, datas, 'Laporan Pemakaian Promo')
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
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
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
            this.dateRange = []
            this.searchQuery = ''
            this.grandTotal = ''
            this.totalPage = ''
            this.filterQuery = ''
            this.supplierQuery = ''
            this.messageerror = ''
            this.messagesuccess = ''
        }
    }
</script>