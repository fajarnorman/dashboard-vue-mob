<template>
    <div class="content-wrapper">
        <div id="report-penjualan">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Penjualan</h4>
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

                            <div class="grand-total">
                                <span>Grand total</span>
                                Rp. {{formatPrice(grandTotal)}}
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
                                <div class="input-with-icons clearfix">
                                    <div class="el-input searchtype">
                                        <input type="text" v-model="filterQuery" class="el-input__inner selectUser selectPenjualanUser" placeholder="Select SPK">
                                        <img src="~assets/images/icons/arrow-down.png">
                                        <div class="dropdown-filterable">
                                            <ul>
                                                <div v-if="searchLoading == true">
                                                    <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                                </div>
                                                <div v-else>
                                                    <div v-if="links.length !== 0">
                                                        <li><a href="#" @click.prevent="filterByUser('')">All SPK</a></li>
                                                        <li v-for="(itemUser, indexUser) in links"
                                                        :key="indexUser"
                                                        :label="itemUser.fullname"
                                                        :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                    </div>
                                                    <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                                </div>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <el-table 
                                :data="itemsOtherData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="itemData.trx_id" label="Kode" width="180"></el-table-column>
                                <el-table-column label="Tanggal Invoice" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData.created_at != null">{{scope.row.itemData.created_at}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Kode SPK" width="100">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <div v-if="scope.row.itemData.created_by != null">{{scope.row.itemData.created_by.username}}</div>
                                            <div v-else>-</div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Nama SPK" width="120">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <div v-if="scope.row.itemData.created_by != null">{{scope.row.itemData.created_by.fullname}}</div>
                                            <div v-else>-</div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="itemData.user.username" label="Kode Pelanggan" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <div v-if="scope.row.itemData.user != null">{{scope.row.itemData.user.username}}</div>
                                            <div v-else>-</div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="itemData.user.fullname" label="Nama Pelanggan" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData">
                                            <div v-if="scope.row.itemData.user != null">{{scope.row.itemData.user.fullname}}</div>
                                            <div v-else>-</div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Perolehan Poin" align="center" width="130">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.itemData.point">
                                            {{parseInt(scope.row.itemData.point.amount)}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total Transaksi" width="150">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.TotalDataDetail)}}
                                    </template>
                                </el-table-column>
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

                                <div class="content" v-if="itemDataDetail.itemData">
                                    <header class="clearfix">
                                        <h4>Detail Laporan Penjualan</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                        
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Pembeli</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="No. Invoice">
                                                                {{itemDataDetail.itemData.trx_id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Invoice">
                                                                {{itemDataDetail.itemData.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nomor Induk SPK">
                                                                <div v-if="itemDataDetail.itemData.created_by != null">{{itemDataDetail.itemData.created_by.username}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama SPK">
                                                                <div v-if="itemDataDetail.itemData.created_by != null">{{itemDataDetail.itemData.created_by.fullname}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kode Pelanggan">
                                                                <div v-if="itemDataDetail.itemData.user != null">{{itemDataDetail.itemData.user.username}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Pelanggan">
                                                                <div v-if="itemDataDetail.itemData.user != null">{{itemDataDetail.itemData.user.fullname}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="No. Nota">
                                                                <div v-if="itemDataDetail.itemData.note != null">{{itemDataDetail.itemData.note}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Perolehan Poin">
                                                                <div v-if="itemDataDetail.itemData.point">{{itemDataDetail.itemData.point.amount}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <div class="barang-content clearfix">
                                                            <el-col :span="24">
                                                                <h5>Item Barang</h5>
                                                                <div class="el-table mobayar-table">
                                                                    <table cellspacing="0" cellpadding="0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Nama Barang</th>
                                                                                <th>Jenis barang</th>
                                                                                <th style="text-align: center;">Jml Barang</th>
                                                                                <th>Harga</th>
                                                                                <th>Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr 
                                                                                v-for="(itembarang, indexbarang) in itemsDataDetailBarang" 
                                                                                :key="indexbarang">
                                                                                <td>{{itembarang.dataBarang.display_name}}</td>
                                                                                <td>{{itembarang.dataBarang.product.category_product.name}}</td>
                                                                                <td align="center">{{itemDataDetail.itemData.details[indexbarang].qty}}</td>
                                                                                <td>Rp. {{formatPrice(itemDataDetail.itemData.details[indexbarang].price)}}</td>
                                                                                <td>Rp. {{ formatPrice(itemDataDetail.itemData.details[indexbarang].qty * itemDataDetail.itemData.details[indexbarang].price)}}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <td colspan="2">Total</td>
                                                                                <td align="center">{{getTotalBarang}}</td>
                                                                                <td></td>
                                                                                <td align="left">Rp. {{formatPrice(getTotalPrice)}}</td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </el-col>
                                                        </div>
                                                        <!-- <el-col :span="12">
                                                            <el-form-item label="Total Transaksi">
                                                                Rp. {{formatPrice(itemDataDetail.TotalDataDetail)}}
                                                            </el-form-item>
                                                        </el-col> -->
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
        name: 'report__mutasi_saldo',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportDgwSales',
                sectionItemBarang: 'item/',
                sectionApiUser: 'user',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsOtherData: [],
                itemsDataDetailBarang: [],

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
                getUserTotalData: '',

                // for autocomplete
                links: [],
                searchLoading: false,

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.item'])
        },
        mounted () {
            this.getUserAll('')
            this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '')
            this.searchUserInit()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult(newQuestion)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            supplierQuery: function(newSupplier){
                this.getPosts(this.perPage, this.currentPage, newSupplier, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateRange: function(newdaterange){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newdaterange[0], newdaterange[1], this.filterQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto, username) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC&dateFrom=' + datefrom + '&dateTo=' + dateto + '&spk=' + username
            },

            // Get All Post
            getPosts(num, pg, sch, dtfrom, dtto, stat){
                let url = this.buildUrl(num, pg, sch, dtfrom, dtto, stat)
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
                        this.grandTotal = response.data.totalPrice

                        this.itemsData.forEach(element => {
                            let sum = []
                            element.details.forEach(element2 => {
                                let price2 = parseFloat(element2.price) * parseInt(element2.qty)
                                sum.push(price2)
                            })
                            let sumArray = sum.reduce(function(accumulator, currentValue){
                                return accumulator + currentValue
                            })
                            this.itemsOtherData.push({
                                "itemData": element,
                                "TotalDataDetail": sumArray
                            })
                        })
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], '')
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
                            let datafterExcel  = [];
                            let exportToExcel = [];

                            let url = this.buildUrl(this.totalPage, '1', this.searchQuery, this.dateRange[0], this.dateRange[1], '')

                            this.loadingExcel = true
                            this.axios.get(url)
                            .then(response => { 
                                if(response.data.status == 'success'){
                                    databeforeExcel = response.data.data
                                    databeforeExcel.forEach(element => {
                                        let sum = []
                                        element.details.forEach(element2 => {
                                            let price2 = parseFloat(element2.price) * parseInt(element2.qty)
                                            sum.push(price2)
                                        })
                                        let sumArray = sum.reduce(function(accumulator, currentValue){
                                            return accumulator + currentValue
                                        })
                                        datafterExcel.push({
                                            "itemData": element,
                                            "TotalDataDetail": sumArray
                                        })
                                    })
                                }else{
                                    this.loadingExcel = false
                                    this.$notify.error({
                                        title: 'Error',
                                        message: response.data.message
                                    });
                                }
                            })
                            .catch(error => { 
                                this.$notify.error({
                                    title: 'Error',
                                    message: error.response.data.message
                                });
                            })
                            .finally(() => {
                                if(datafterExcel.length !== 0){
                                    this.loadingExcel = false

                                    let dataAmount = ''
                                    let kodeSPK, nameSPK, kodeCustomer, nameCustomer

                                    datafterExcel.forEach(function(currentValue, i, arr){
                                        if(currentValue.itemData.point){
                                            dataAmount = currentValue.itemData.point.amount
                                        }else{
                                            dataAmount = '-'
                                        }

                                        kodeSPK = currentValue.itemData.created_by == null ? '-' : currentValue.itemData.created_by.username
                                        nameSPK = currentValue.itemData.created_by == null ? '-' : currentValue.itemData.created_by.fullname
                                        kodeCustomer = currentValue.itemData.user == null ? '-' : currentValue.itemData.user.username
                                        nameCustomer = currentValue.itemData.user == null ? '-' : currentValue.itemData.user.fullname

                                        exportToExcel.push(
                                            {
                                                'Kode' : currentValue.itemData.trx_id,
                                                'Tanggal Invoice' : currentValue.itemData.created_at,
                                                'Kode SPK' : kodeSPK,
                                                'Nama SPK' : nameSPK,
                                                "Kode Pelanggan": kodeCustomer,
                                                "Nama Pelanggan": nameCustomer,
                                                "Perolehan Poin": dataAmount,
                                                "Total Transaksi": currentValue.TotalDataDetail,
                                            }
                                        )
                                    })

                                    let filename = "transaksi-penjualan-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                                    var wscols = [
                                        {wch:30},
                                        {wch:20},
                                        {wch:40},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                        {wch:20},
                                    ];

                                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                                    datas['!cols'] = wscols;
                                    var wb = XLSX.utils.book_new()
                                    XLSX.utils.book_append_sheet(wb, datas, 'Laporan Penjualan')
                                    XLSX.writeFile(wb, filename+'.xlsx')
                                }
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
                this.getPosts(this.perPage, this.currentPage, this.supplierQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.supplierQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(newsearch){
                this.getPosts(this.perPage, this.currentPage, newsearch, this.dateRange[0], this.dateRange[1], this.filterQuery)
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['report.item.detail']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.itemDataDetail = val
                        this.itemsDataDetailBarang = []
                        this.loadingForm = true

                        let that = this

                        let dataBarang = this.itemDataDetail.itemData.details
                        dataBarang.forEach(function(element){
                            let url = that.apiURL + that.sectionItemBarang + element.item_id
                            that.axios.get(url)
                            .then(response => {
                                that.itemsDataDetailBarang.push({
                                    "dataBarang" : response.data.data
                                })
                            })
                            .finally(() => {
                                setTimeout(function(){
                                    that.loadingForm = false
                                }, 500)
                            })
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
                this.$refs.formsvalid.resetFields();
            },

            searchUserInit(){
                let that = this
                setTimeout(function(){
                    document.querySelector('.selectUser').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-filterable') !== null){
                            document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                            if(document.querySelector('.dropdown-filterable') !== null){
                                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                            }
                        }
                    })
                    var textInput = document.querySelector('.selectUser');
                    var timeout = null;
                    textInput.onkeyup = function (e) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            that.getUserAll(textInput.value)
                            console.log('Input Value:', textInput.value);
                        }, 800);
                    };
                }, 500)
            },

            filterByUser(user){
                let usernameData
                if(user == ''){
                    usernameData = ''
                    this.filterQuery = ''
                    this.getUserAll('')
                }else{
                    usernameData = user.username
                }
                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], usernameData)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },

            getUserAll(search){
                let userDataurl = this.apiURL + this.sectionApiUser + '?limit=20&role=4&direction=ASC&order=fullname&page=1&username=' + search
                this.searchLoading = true
                this.axios.get(userDataurl)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.links = response.data.data
                        this.searchLoading = false
                    }
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.searchLoading = false
                })
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

            getTotalBarang: function(){
                let totalBarang = [];

                this.itemDataDetail.itemData.details.forEach(element => {
                    let qty = parseFloat(element.qty)
                    totalBarang.push(qty)
                })

                return totalBarang.reduce(function(total, num){ return total + num }, 0);
            },

            getTotalPrice: function(){
                let totalBarangPrice = [];

                this.itemDataDetail.itemData.details.forEach(element => {
                    let qtyprice = parseFloat(element.price) * parseFloat(element.qty)
                    totalBarangPrice.push(qtyprice)
                })

                return totalBarangPrice.reduce(function(total, num){ return total + num }, 0);
            },

            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy(){
            this.itemsData = []
            this.itemDataDetail = []
            this.itemsOtherData = []
            this.itemsDataDetailBarang = []
            this.links = []
            this.dateRange = []
            this.searchQuery = ''
            this.grandTotal = ''
            this.totalPage = ''
            this.filterQuery = ''
            this.supplierQuery = ''
            this.getUserTotalData = ''
        }
    }
</script>