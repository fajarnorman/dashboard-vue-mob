<template>
    <div class="content-wrapper">
        <div id="agent-transactions">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Transaksi Digital</h4>
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

                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>
                            
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="fullname" label="Full Name" width="200"></el-table-column>
                                <el-table-column prop="username" label="Username"></el-table-column>
                                <el-table-column prop="phone_number" label="Phone Number"></el-table-column>
                                <el-table-column label="Total">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.sumTotal)}}
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
        name: 'agent-transactions',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'agent/ppobTransaction',

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
                direction: 'DESC',
                orderBy: 'sumTotal',
                totalPage: '',
                totalPoint: '',
                filterQuery: '',
                supplierQuery: '',
                switchOnOff: false,
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',

                // Message
                messageerror: '',
                messagesuccess: '',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['agent.transaction'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, this.orderBy, '', this.dateRange[0], this.dateRange[1])
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
            dateRange: function(newDateRange){
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery, newDateRange[0], newDateRange[1])
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, order, search, datfrom, datTo) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&order=' + order + '&search=' + search + '&direction=' + this.direction + '&dateFrom=' + datfrom + '&dateTo=' + datTo
            },

            // Get All Post
            getPosts(num, pg, odr, sch, dtFrom, dtTo){
                let url = this.buildUrl(num, pg, odr, sch, dtFrom, dtTo)
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
                .catch(error => { 
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery, this.dateRange[0], this.dateRange[1])
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery, this.dateRange[0], this.dateRange[1])
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery, this.dateRange[0], this.dateRange[1])
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        }
    }
</script>

<style>

</style>
