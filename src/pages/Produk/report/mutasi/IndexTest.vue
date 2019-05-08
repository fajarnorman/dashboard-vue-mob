<template>
    <div class="content-wrapper">
        <div id="report">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Mutasi Saldo</h4>
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
                                <!-- <div class="input-with-icons clearfix">
                                    <el-input v-model="filterQuery" class="float-left" placeholder="Search by Username"></el-input>
                                </div> -->
                                <el-select
                                    v-model="filterQuery"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="Select User"
                                    :loading="searchLoading"
                                    class="testingselectUser">
                                    <el-option value="" label="Select User">All</el-option>
                                    <el-option
                                        v-for="(itemUser, indexUser) in links"
                                        :key="indexUser"
                                        :label="itemUser.fullname"
                                        :value="itemUser.username">
                                        {{itemUser.fullname}} ({{itemUser.username}})
                                    </el-option>
                                </el-select>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="balance_created_at" label="Tanggal" width="200"></el-table-column>
                                <el-table-column prop="fullname" label="User" width="250"></el-table-column>
                                <el-table-column prop="description" label="Deskripsi" width="350"></el-table-column>
                                <el-table-column label="Saldo">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.amount)}}
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

                                <div class="content" v-if="itemDataDetail">
                                    <header class="clearfix">
                                        <h4>Detail Laporan Mutasi Saldo</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                        
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Laporan</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal">
                                                                {{itemDataDetail.balance_created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="User">
                                                                {{itemDataDetail.fullname}} ({{itemDataDetail.username}})
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Deskripsi">
                                                                {{itemDataDetail.description}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Saldo">
                                                                Rp. {{formatPrice(itemDataDetail.amount)}}
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
    

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__mutasi_saldo',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportBalanceMutation',
                sectionApiUser: 'user',

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

                links: [],
                searchLoading: false,

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
                countErrorGetUserAll: 0,

                timer: null,
            }
        },
        mounted () {
            this.getUserAll('')
            this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '')


            // Get the input box
            var textInput = document.querySelector('.testingselectUser').children[0].children[0];

            // Init a timeout variable to be used below
            var timeout = null;
            let that = this

            // Listen for keystroke events
            textInput.onkeyup = function (e) {

                // Clear the timeout if it has already been set.
                // This will prevent the previous task from executing
                // if it has been less than <MILLISECONDS>
                clearTimeout(timeout);

                // Make a new timeout set to go off in 800ms
                timeout = setTimeout(function () {
                    // that.getUserAll(textInput.value)
                    that.doStuff(textInput.value)
                    // console.log('Input Value:', textInput.value);
                }, 500);
            };
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult(newQuestion)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newFilterUser){
                if(newFilterUser == '' || newFilterUser == 'Select%20User'){
                    this.getUserAll('')
                }
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], newFilterUser)
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
            buildUrl (limit, page, search, datefrom, dateto, username) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC&dateFrom=' + datefrom + '&dateTo=' + dateto + '&username=' + username
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

                            let url = this.buildUrl(this.totalPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.filterQuery)

                            this.loadingExcel = true
                            this.axios.get(url)
                            .then(response => { 
                                databeforeExcel = response.data.data
                            })
                            .catch(error => { 
                                this.countErrorGetExcel++
                                if(this.countErrorGetExcel >= 3){
                                    this.errored = true
                                }else{
                                    this.getExcel()
                                }
                            })
                            .finally(() => {
                                this.loadingExcel = false

                                databeforeExcel.forEach(function(currentValue, i, arr){
                                    exportToExcel.push(
                                        {
                                            'Tanggal' : currentValue.balance_created_at,
                                            'User' : currentValue.fullname,
                                            'Deskripsi' : currentValue.description,
                                            'Saldo' : currentValue.amount,
                                        }
                                    )
                                })

                                let filename = "mutasi-saldo-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                                var wscols = [
                                    {wch:30},
                                    {wch:20},
                                    {wch:40},
                                    {wch:20},
                                ];

                                var datas = XLSX.utils.json_to_sheet(exportToExcel)
                                datas['!cols'] = wscols;
                                var wb = XLSX.utils.book_new()
                                XLSX.utils.book_append_sheet(wb, datas, 'Laporan Mutasi Saldo')
                                XLSX.writeFile(wb, filename+'.xlsx')
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

            getUserAll(search){
                clearTimeout(this.timer); 
                this.searchLoading = true
                this.timer = setTimeout(this.doStuff(search), 1000)

                // let that = this
                // this.searchLoading = true
                // setTimeout(function(){
                //     let userDataurl = that.apiURL + that.sectionApiUser + '?limit=50&direction=ASC&order=fullname&page=1&username=' + search
                //     that.axios.get(userDataurl)
                //     .then(response => {
                //         if(response.data.status == 'success'){
                //             that.links = response.data.data
                //         }
                //     })
                //     .catch(error => {
                //         that.countErrorGetUserAll++
                //         if(that.countErrorGetUserAll >= 3){
                //             that.errored = true
                //         }else{
                //             that.getUserAll('')
                //         }
                //     })
                //     .finally(() => {
                //         that.searchLoading = false
                //     })
                // }, 700)
            },

            doStuff(search){
                let that = this
                let userDataurl = that.apiURL + that.sectionApiUser + '?limit=50&direction=ASC&order=fullname&page=1&username=' + search
                console.log(userDataurl)
                that.axios.get(userDataurl)
                .then(response => {
                    if(response.data.status == 'success'){
                        that.links = response.data.data
                    }
                })
                .catch(error => {
                    // that.countErrorGetUserAll++
                    // if(that.countErrorGetUserAll >= 3){
                    //     that.errored = true
                    // }else{
                    //     that.getUserAll('')
                    // }
                })
                .finally(() => {
                    that.searchLoading = false
                })
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
            this.dateRange = []
            this.links = []
            this.searchQuery = ''
            this.direction = ''
            this.grandTotal = ''
            this.totalPage = ''
            this.filterQuery = ''
            this.supplierQuery = ''
        }
    }
</script>