<template>
    <div class="content-wrapper">
        <div id="mutation-point-detail">
            <div class="page-header">
                <div class="page-header-content">
                    <router-link v-bind:to="'/mutasi-point'" class="back-button">
                        <i class="icon icon-caret-left"></i> Mutasi Point
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Detail Mutasi Poin</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="getExcel" href="#">
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
                            <el-select v-model="supplierQuery" placeholder="Filter by reference type">
                                <el-option value="" label="All"></el-option>
                                <el-option value="other" label="Other"></el-option>
                                <el-option value="referral" label="Referral"></el-option>
                                <el-option value="topup" label="Topup"></el-option>
                                <el-option value="transaction_item" label="Transaction Item"></el-option>
                                <el-option value="transaction_sku" label="Transaction Sku"></el-option>
                                <el-option value="transaction_sku_bonus" label="Transaction Sku Bonus"></el-option>
                                <el-option value="withdraw" label="Withdraw"></el-option>
                                <el-option value="gamification" label="Gamification"></el-option>
                            </el-select>
                        </div>
                        
                        <div class="mutasi-point general-info">
                            <el-row :gutter="20">
                                <el-col :span="6" :xs="24" class="item-general-info">
                                    <h5>Name</h5>
                                    {{itemgeneralInfo.fullname}}
                                </el-col>
                                <el-col :span="6" :xs="24" class="item-general-info">
                                    <h5>Username</h5>
                                    {{itemgeneralInfo.username}}
                                </el-col>
                                <el-col :span="6" :xs="24" class="item-general-info">
                                    <h5>Point User</h5>
                                    {{parseInt(itemgeneralInfo.points)}}
                                </el-col>
                                <el-col :span="6" :xs="24" class="item-general-info">
                                    <h5>Point History Sum</h5>
                                    {{parseInt(grandTotal)}}
                                </el-col>
                            </el-row>
                        </div>

                        <div class="" v-if="itemsData">
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="reference_type" label="Reference Type" width="160"></el-table-column>
                                <el-table-column label="Reference ID" width="300">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.reference_type == 'transaction_sku' || scope.row.reference_type == 'transaction_sku_bonus'">
                                            <a :href="hostUrl + '/report/transaksi-digital#'+scope.row.reference_id" @click.prevent="$router.push({path: '/report/transaksi-digital#'+scope.row.reference_id})" class="id-green">{{scope.row.reference_id}}</a>
                                        </span>
                                        <span v-else-if="scope.row.reference_type == 'referral'">
                                            <a :href="hostUrl + '/user#'+scope.row.reference_id" @click.prevent="$router.push({path: '/user#'+scope.row.reference_id})" class="id-green">{{scope.row.reference_id}}</a>
                                        </span>
                                        <span v-else>{{scope.row.reference_id}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="description" label="Description" width="350"></el-table-column>
                                <el-table-column label="Amount" width="90">
                                    <template slot-scope="scope">
                                        {{parseInt(scope.row.amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Create at" width="157"></el-table-column>
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
    

    export default {
        name: 'mutasi-point-detail',
        data () {
            return {
                // for get api
                hostUrl: window.location.origin,
                apiURL: process.env.ROOT_API,
                sectionApi: 'managePoint/',
                sectionUserApi: 'user/',
                idUser: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemgeneralInfo: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingExcel: false,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: '',
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',
            }
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '', this.supplierQuery)
            this.getUserbyID()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            // filterQuery: function(newFilter){
            //     this.getPosts(this.perPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], this.filterQuery)
            // },
            supplierQuery: function(newSupplier){
                this.getPosts(this.perPage, '1', '', this.dateRange[0], this.dateRange[1], newSupplier)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateRange: function(newdaterange){
                this.getPosts(this.perPage, '1', '', newdaterange[0], newdaterange[1], this.supplierQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, datefrom, dateto, type) {
                return this.apiURL + this.sectionApi + this.idUser + "?limit=" + limit + "&page=" + page + '&search=' + search + '&start_date=' + datefrom + '&end_date=' + dateto + '&type=' +  type
            },

            buildUrlUserByID(){
                return this.apiURL + this.sectionUserApi + this.idUser
            },

            // Get All Post
            getPosts(num, pg, sch, dtfrom, dtto, stat){
                let url = this.buildUrl(num, pg, sch, dtfrom, dtto, stat)
                this.loading = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data 
                        this.totalPage = response.data.totalData
                        this.grandTotal = response.data.totalAmount
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            },

            // Get Username by ID
            getUserbyID(){
                let url = this.buildUrlUserByID()
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemgeneralInfo = response.data.data 
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => console.log(''))
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, '1', this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateRange[0], this.dateRange[1], this.supplierQuery)
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', '.')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // Get Excel 
            getExcel(){
                let databeforeExcel = [];
                let exportToExcel = [];

                let url = this.buildUrl(this.totalPage, this.currentPage, '', this.dateRange[0], this.dateRange[1], '', this.supplierQuery)

                this.loadingExcel = true
                this.axios.get(url)
                .then(response => { 
                    databeforeExcel = response.data.data
                })
                .catch(error => { this.errored = true })
                .finally(() => {
                    this.loadingExcel = false

                    databeforeExcel.forEach(function(currentValue, i, arr){
                        exportToExcel.push(
                            {
                                'Reference Type' : currentValue.reference_type,
                                'Reference ID' : currentValue.reference_id,
                                'Description' : currentValue.description,
                                'Amount' : currentValue.amount,
                                'Create at' : currentValue.created_at,
                            }
                        )
                    })

                    let filename = this.itemgeneralInfo.username + "-points-mutation"

                    var wscols = [
                        {wch:20},
                        {wch:40},
                        {wch:40},
                        {wch:20},
                        {wch:20},
                    ];

                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                    datas['!cols'] = wscols;
                    var wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, datas, 'Detail Mutation Point')
                    XLSX.writeFile(wb, filename+'.xlsx')
                })
            },
        },
    }
</script>