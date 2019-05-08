<template>
    <div class="content-wrapper">
        <div id="transaksi-penjualan">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Transaksi Penjualan</h4>
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
                            </div>

                            <el-table 
                                :data="itemsOtherData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="itemData.trx_id" label="No. Transaksi" width="200"></el-table-column>
                                <el-table-column label="Nama Agen" width="200">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <span v-if="scope.row.itemData.created_by">{{scope.row.itemData.created_by.fullname}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Nama Pelanggan">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <span v-if="scope.row.itemData.user != null">
                                                {{scope.row.itemData.user.fullname}}
                                            </span>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total Transaksi">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.TotalDataDetail)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="itemData.created_at" label="Tanggal"></el-table-column>
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

                                <div class="content" v-if="itemDataDetail">
                                    <header class="clearfix">
                                        <h4>Detail Transaksi Penjualan</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                 
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Transaksi Penjualan</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID Transaksi">
                                                                {{itemDataDetail.trx_id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Agen">
                                                                <div v-if="itemDataDetail.created_by">
                                                                    {{itemDataDetail.created_by.fullname}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Pelanggan">
                                                                <div v-if="itemDataDetail.user">
                                                                    {{itemDataDetail.user.fullname }}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Catatan">
                                                                {{itemDataDetail.note}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                {{itemDataDetail.status}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <!-- <el-col :span="12">
                                                            <el-form-item label="Perolehan Poin">
                                                                {{itemDataDetail.itemData.trx_id}}
                                                            </el-form-item>
                                                        </el-col> -->
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Transaksi">
                                                                {{itemDataDetail.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <div class="barang-content clearfix">
                                                            <el-col :span="24">
                                                                <h5>Detil Transaksi</h5>
                                                                <div class="el-table mobayar-table">
                                                                    <table cellspacing="0" cellpadding="0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Kode Barang</th>
                                                                                <th>Nama Barang</th>
                                                                                <th>Harga Satuan</th>
                                                                                <th style="text-align: center;">Jumlah</th>
                                                                                <th>Total Harga</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody v-if="itemDataDetail.details">
                                                                            <tr 
                                                                                v-for="(itembarang, indexbarang) in itemDataDetail.details" 
                                                                                :key="indexbarang">
                                                                                <td>
                                                                                    <div v-if="itembarang.item">{{itembarang.item.item_code}}</div>
                                                                                </td>
                                                                                <td>
                                                                                    <div v-if="itembarang.item">{{itembarang.item.display_name}}</div>
                                                                                </td>
                                                                                <td>Rp. {{formatPrice(itembarang.price)}}</td>
                                                                                <td align="center">{{itembarang.qty}}</td>
                                                                                <td>Rp. {{ formatPrice(itembarang.qty * itembarang.price)}}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <td colspan="4" align="right">Total</td>
                                                                                <td align="left">Rp. {{formatPrice(getTotalPrice)}}</td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </el-col>
                                                        </div>
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
                sectionApi: 'transactionItem',
                sectionItemBarang: 'item/',

                // for store data after get api
                itemsData: [],
                itemsOtherData: [],
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
                getUserTotalData: '',
            }
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1])
        },
        watch: {
            searchQuery: function(newQuery){
                this.getResult()
            },
            dateRange: function(newDateRange){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newDateRange[0], newDateRange[1])
            },
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&order=' + this.order + '&search=' + search + '&direction=' + this.direction + '&start_date=' + datefrom + '&end_date=' + dateto
            },

            // Get All Post
            getPosts(num, pg, sch, dtfrom, dtto){
                let url = this.buildUrl(num, pg, sch, dtfrom, dtto)
                this.loading = true
                this.itemsOtherData = []
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

                        this.itemsData.forEach(element => {
                            let sum = []
                            let sumArray

                            if(element.details.length != 0){
                                element.details.forEach(element2 => {
                                    let price2 = parseFloat(element2.price) * parseFloat(element2.qty)
                                    sum.push(price2)
                                })

                                sumArray = sum.reduce(function(accumulator, currentValue){
                                    return accumulator + currentValue
                                })
                            }else{
                                sumArray = ''
                            }

                            this.itemsOtherData.push({
                                "itemData": element,
                                "TotalDataDetail": sumArray
                            })
                        })

                    }
                })
                .catch(error => { console.log(error); this.errored = true })
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1])
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1])
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1])
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['transaction.item.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.itemsDataDetailBarang = []
                        let that = this
                        this.loadingForm = true

                        let url = this.apiURL + this.sectionApi + '/' + val.itemData.id
                        
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                        })
                        .finally(() => {
                            setTimeout(function(){
                                that.loadingForm = false
                            }, 1000)
                        })
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                // this.$refs.formsvalid.resetFields();
            }, 
        },
        computed: {
            getTotalPrice: function(){
                let totalBarangPrice = [];
                if(this.itemDataDetail.length != 0){
                    this.itemDataDetail.details.forEach(element => {
                        let qtyprice = parseFloat(element.price) * parseFloat(element.qty)
                        totalBarangPrice.push(qtyprice)
                    })

                    return totalBarangPrice.reduce(function(total, num){ return total + num }, 0);
                }
            },
        }
    }
</script>

<style>

</style>
