<template>
    <div class="content-wrapper">
        <div id="withdrawal">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4>History Withdrawal</h4>
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
                            <span>Total Amount</span>
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
                                    <input type="text" v-model="userChange" class="el-input__inner selectUser selectUserWitdrawal" placeholder="Select an User">
                                    <img src="~assets/images/icons/arrow-down.png">
                                    <div class="dropdown-filterable dropdownuser-withdrawal">
                                        <ul>
                                            <div v-if="loadingSelect == true">
                                                <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                            </div>
                                            <div v-else>
                                                <div v-if="itemsUser.length !== 0">
                                                    <li><a href="#" @click.prevent="filterByUser('')">All User</a></li>
                                                    <li v-for="(itemUser, indexUser) in itemsUser"
                                                    :key="indexUser"
                                                    :label="itemUser.fullname"
                                                    :value="itemUser.id"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                </div>
                                                <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="input-with-icons clearfix" style="width: 220px">
                                <div class="el-input searchtype">
                                    <input type="text" v-model="cashoutChange" class="el-input__inner selectUser selectCashoutPoint" placeholder="Select an Cash Out Point">
                                    <img src="~assets/images/icons/arrow-down.png">
                                    <div class="dropdown-filterable dropdown-cashout-point">
                                        <ul>
                                            <div v-if="loadingSelect2 == true">
                                                <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                            </div>
                                            <div v-else>
                                                <div v-if="itemsCahsoutPoint.length !== 0">
                                                    <li><a href="#" @click.prevent="filterByCashout('')">All Cashout Point</a></li>
                                                    <li v-for="(dataCash, indexCash) in itemsCahsoutPoint"
                                                    :key="indexCash"
                                                    :label="dataCash.fullname"
                                                    :value="dataCash.id"><a href="#" @click.prevent="filterByCashout(dataCash)">{{dataCash.fullname}} ({{dataCash.username}})</a></li>
                                                </div>
                                                <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="select-cashout">
                                <el-select 
                                    v-model="cashoutChange" 
                                    remote 
                                    filterable 
                                    placeholder="Select an Cash Out Point" 
                                    :remote-method="getPostUserCashoutPoint"
                                    :loading="loadingSelect2">
                                    <el-option v-if="itemsCahsoutPoint.length !== 0" label="Select an Cash Out Point" value="">All</el-option>
                                    <el-option
                                        v-for="(dataCash, indexCash) in itemsCahsoutPoint"
                                        :key="indexCash"
                                        :label="dataCash.fullname"
                                        :value="dataCash.id">
                                        <span>{{ dataCash.fullname }} ({{ dataCash.username }})</span>
                                    </el-option>
                                </el-select>
                            </div> -->
                        </div>
                        <div class="">

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Status" name="all"></el-tab-pane>
                                    <el-tab-pane label="Success" name="success"></el-tab-pane>
                                    <el-tab-pane label="Waiting" name="waiting"></el-tab-pane>
                                    <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                                </el-tabs>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                v-loading="loading"
                                @current-change="handleCurrentChange"
                                class="mobayar-table">
                                <el-table-column prop="created_at" label="Date" width="200"></el-table-column>
                                <el-table-column prop="code" label="Customer" width="220">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.customer">
                                            {{scope.row.customer.fullname}} ({{scope.row.customer.username}})
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Amount" width="180">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Cash Out Point">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.agent">
                                            {{scope.row.agent.fullname}} ({{scope.row.agent.username}})
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Status">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status == 'success'" class="badge inline success">{{scope.row.status}}</span>
                                        <span v-else-if="scope.row.status == 'waiting'" class="badge inline pending">{{scope.row.status}}</span>
                                        <span v-if="scope.row.status == 'failed'" class="badge inline failed">{{scope.row.status}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="mobayar-actions-bottom clearfix">
                                <div class="showing-page float-left">
                                    <span>View</span>
                                    <ul>
                                        <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                                        <li><a href="#" @click.prevent="limitChange('15', $event)">25</a></li>
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
                                        <h4>Detail Withdrawal History</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>General Info</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Transaction Date">
                                                                {{itemsDataDetail.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Customer">
                                                                <div v-if="itemsDataDetail.customer">{{itemsDataDetail.customer.fullname}} ({{itemsDataDetail.customer.username}})</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Cash Out Point">
                                                                <div v-if="itemsDataDetail.agent">{{itemsDataDetail.agent.fullname}} ({{itemsDataDetail.agent.username}})</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Amount">
                                                                Rp. {{formatPrice(itemsDataDetail.amount)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Notes">
                                                                {{itemsDataDetail.notes}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                <span v-if="itemsDataDetail.status == 'success'" class="badge inline success">{{itemsDataDetail.status}}</span>
                                                                <span v-else-if="itemsDataDetail.status == 'waiting'" class="badge inline pending">{{itemsDataDetail.status}}</span>
                                                                <span v-if="itemsDataDetail.status == 'failed'" class="badge inline failed">{{itemsDataDetail.status}}</span>
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
    
    import JQuery from 'jquery'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    export default {
        name: 'withDrawal',
        data () {
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'withdrawal',
                sectionApiUser: 'user',
                sectionApiCashout: 'cashoutpoint',
                itemsData: [],
                itemsDataDetail: [],
                itemsUser: [],
                itemsCahsoutPoint: [],
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingSelect: false,
                loadingSelect2: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                filterQuery: 'success',
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                grandTotal: '',
                userChange: '',
                userChangeid: '',
                cashoutChange: '',
                cashoutChangeid: '',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['withdrawal.list'])
        },
        mounted() {
            this.getPosts(this.perPage, this.currentPage, '')
            this.getPostUser('')
            this.getPostUserCashoutPoint('')
            this.searchUserInit()
            this.searchCashoutInit()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newValue){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, this.cashoutChangeid)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateRange: function(newDate, oldDate){
                if(newDate == null){
                    this.$notify.error({
                        title: 'Error',
                        message: 'Date range tidak boleh kosong'
                    });
                    this.dateRange = oldDate
                }else{
                    this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, this.cashoutChangeid)
                    document.querySelector('.el-pagination').children[1].children[0].click()
                }
            },
        },
        methods: {
            buildUrl (limit, page, search, userId, cashoutChangeid) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&start_date=' + this.dateRange[0] + '&end_date=' + this.dateRange[1] + '&status=' + this.filterQuery + '&user_customer_id=' + userId + '&user_agent_id=' + cashoutChangeid
            },

            buildUrlUser(search){
                return this.apiURL + this.sectionApiUser + '?limit=100&search=' + search + '&direction=ASC&order=fullname'
            },

            buildUrlUserCashoutPoint(search){
                return this.apiURL + this.sectionApiCashout + '?limit=10&search=' + search + '&order=fullname&direction=ASC'
            },

            // get all post
            getPosts(num, pg, sch, iduser, idcashout){
                let url = this.buildUrl(num, pg, sch, iduser, idcashout)
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
                        this.grandTotal = response.data.totalAmount
                        this.totalPage = response.data.totalData
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            searchUserInit(){
                let that = this
                setTimeout(function(){
                    document.querySelector('.selectUserWitdrawal').addEventListener('click', function(){
                        document.querySelector('.dropdownuser-withdrawal').classList.add('dropdown-showing')
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUserWitdrawal, .dropdownuser-withdrawal').length){
                            document.querySelector('.dropdownuser-withdrawal').classList.remove('dropdown-showing')
                        }
                    })
                    var textInput = document.querySelector('.selectUserWitdrawal');
                    var timeout = null;
                    textInput.onkeyup = function (e) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            that.getPostUser(textInput.value)
                            console.log('Input Value:', textInput.value);
                        }, 800);
                    };
                }, 500)
            },

            filterByUser(user){
                let usernameData
                if(user == ''){
                    usernameData = ''
                    this.userChange = ''
                    this.userChangeid = ''
                    this.getPostUser('')
                }else{
                    usernameData = user.id
                    this.userChangeid = user.id
                }
                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, usernameData, this.cashoutChangeid)
                setTimeout(function(){
                    document.querySelector('.el-pagination').children[1].children[0].click()
                }, 200)
            },

            getPostUser(searchUser){
                let url = this.buildUrlUser(searchUser)
                this.loadingSelect = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.loadingSelect = false
                        this.itemsUser = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
            },

            searchCashoutInit(){
                let that = this
                setTimeout(function(){
                    document.querySelector('.selectCashoutPoint').addEventListener('click', function(){
                        document.querySelector('.dropdown-cashout-point').classList.add('dropdown-showing')
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectCashoutPoint, .dropdown-cashout-point').length){
                            document.querySelector('.dropdown-cashout-point').classList.remove('dropdown-showing')
                        }
                    })
                    var textInput2 = document.querySelector('.selectCashoutPoint');
                    var timeout2 = null;
                    textInput2.onkeyup = function (e) {
                        clearTimeout(timeout2);
                        timeout2 = setTimeout(function () {
                            that.getPostUserCashoutPoint(textInput2.value)
                            console.log('Input Value:', textInput2.value);
                        }, 800);
                    };
                }, 500)
            },

            filterByCashout(user){
                let usernameData
                if(user == ''){
                    usernameData = ''
                    this.cashoutChange = ''
                    this.cashoutChangeid = ''
                    this.getPostUserCashoutPoint('')
                }else{
                    usernameData = user.id
                    this.cashoutChangeid = user.id
                }
                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, usernameData)
                setTimeout(function(){
                    document.querySelector('.el-pagination').children[1].children[0].click()
                }, 200)
            },

            getPostUserCashoutPoint(searchCash){
                let url = this.buildUrlUserCashoutPoint(searchCash)
                this.loadingSelect2 = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.loadingSelect2 = false
                        this.itemsCahsoutPoint = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, this.cashoutChangeid)
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, this.cashoutChangeid)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');

                    this.getDetailWithdrawal(val.id)
                }
            },

            getDetailWithdrawal(id){
                let url = this.apiURL + this.sectionApi + '/' + id
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDataDetail = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loadingForm = false)
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                console.log(this.userChange)
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.userChangeid, this.cashoutChangeid)
            }, 300),
        }
    }
</script>

<style lang="scss">
    .select-cashout{
        margin-left: 15px; 
        float: left;
    }
</style>
