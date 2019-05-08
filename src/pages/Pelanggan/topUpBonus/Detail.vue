<template>
    <div class="content-wrapper">
        <div id="topup-bonus">
            <div class="page-header">
                <div class="page-header-content">
                    <router-link v-bind:to="'/topupbonus'" class="back-button">
                        <i class="icon icon-caret-left"></i> Topup Bonus
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Detail Pemakaian Topup Bonus</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="totaled">
                            <div class="grand-total">
                                <span>Total Bonus</span>
                                Rp. {{formatPrice(totalBonus)}}
                            </div>

                            <div class="grand-total">
                                <span>Total Topup Amount</span>
                                Rp. {{formatPrice(totalTopupAmount)}}
                            </div>
                        </div>

                        <div class="filterSearching clearfix">
                            <div class="input-with-icons with-dropdowns clearfix">
                                <el-input v-model="searchQuery" class="float-left" :disabled="searchKey == '' ? true : false">
                                    <el-select v-model="searchKey" slot="prepend" placeholder="Search by">
                                        <el-option label="Username" value="username"></el-option>
                                        <el-option label="TRX ID" value="topup"></el-option>
                                    </el-select>
                                </el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                        </div>

                        <div class="" v-if="itemsData">

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
                                <el-table-column prop="trx_id" label="Transaksi ID"></el-table-column>
                                <el-table-column label="User">
                                    <template slot-scope="scope">
                                        <div>
                                            {{scope.row.fullname}} ({{scope.row.username}})<br/>
                                            {{scope.row.phone_number}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total Bonus">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.total_bonus)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Topup Amount">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.topup_amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Created At"></el-table-column>
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
    import {Money} from 'v-money'
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'
    

    export default {
        name: 'topup-bonus',
        components: {Money},
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'topupBonusUsage',
                idData: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                searchKey: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                format: 'yyyy-MM-dd',
                formatTime: 'HH:mm',
                formatTimeValue: 'HH:mm:ss',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',

                totalBonus: '',
                totalTopupAmount: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false /* doesn't work with directive */
                },

                // for create, detail, edit forms and validation
                valuePriceMoney: '',
                forms:{
                    name: '',
                    min_topup: '',
                    dateStart: '',
                    timeStart: '00:00',
                    dateEnd: '',
                    timeEnd: '23:59',
                    type: 'percent',
                    value: '',
                    max_bonus: '',
                    max_usage: -1,
                    max_usage_user: -1,
                    max_usage_user_daily: -1,
                },
                rules2:{
                },
            }
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            getPosts(limit, page, search){
                let url = this.apiUrl + this.sectionApi + '/' + this.idData + "?limit=" + limit + "&page=" + page + '&search=' + search + '&searchKey=' + this.searchKey + '&direction=DESC'
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
                        this.totalBonus = response.data.totalBonuses
                        this.totalTopupAmount = response.data.totalTopupAmount
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },
            getResult: _.debounce(function(){
               this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 800),
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
        }
    }
</script>
<style lang="scss" scoped>
.totaled{
    .grand-total{
        display: inline-block;
        margin-right: 20px;
    }
}
</style>
