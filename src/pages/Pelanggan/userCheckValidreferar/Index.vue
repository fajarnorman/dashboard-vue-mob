<template>
    <div class="content-wrapper">
        <div id="user">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Cek Valid Referrer</h4>
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
                            <span>Auto Approve</span>
                            <div class="switch-custom">
                                <el-switch
                                    v-model="switchOnOff"
                                    @change="setAvailable">
                                </el-switch>
                                <span style="display: inline-block;vertical-align: middle;" v-if="switchOnOff">Status On</span>
                                <span style="display: inline-block;vertical-align: middle;" v-else>Status Off</span>
                            </div>
                        </div>
                        <div class="filterSearching clearfix">
                            <div class="input-with-icons clearfix">
                                <el-input v-model="searchQuery" class="float-left"></el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                            <div class="datepicker-field float-left">
                                <el-date-picker 
                                    class="date-range-picker"
                                    v-model="dateFrom" 
                                    type="daterange" 
                                    range-separator="-" 
                                    start-placeholder="Start date" 
                                    end-placeholder="End date"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="">
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column label="Username" width="150">
                                    <template slot-scope="scope">
                                        <a :href="hostUrl + '/user#'+scope.row.id" class="id-green" @click.prevent="$router.push({path: '/user#'+scope.row.id})">{{scope.row.username}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Saldo" width="140">
                                    <template slot-scope="scope">
                                        {{formatPrice(scope.row.balance)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="points" label="Point" align="center" width="100"></el-table-column>
                                <el-table-column label="User Data" align="center" width="220">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.username}}</div>
                                        <div>{{scope.row.phone_number}}</div>
                                        <div><i>Join {{scope.row.created_at}}</i></div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Referrer">
                                    <template slot-scope="scope">
                                        <a :href="hostUrl + '/user#'+scope.row.ref_id" class="id-green" @click.prevent="$router.push({path: '/user#'+scope.row.ref_id})">{{scope.row.ref_username}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="Status"></el-table-column>
                                <el-table-column prop="downline_topup_at" label="Downline Topup" width="150"></el-table-column>
                                <el-table-column label="Cek" v-if="$dataRole['users.validatereferar']" align="center">
                                    <template slot-scope="scope">
                                        <a href="#" @click.prevent="updateCheckReveral(scope.row.id)">
                                            <img src="~assets/images/icons/icon-alert.png">
                                        </a>
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
                            <!-- <pre>{{itemsDataUser}}</pre> -->                            
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import XLSX from 'xlsx'
    
    import FUNCTIONS from '@/functions'

    const date = new Date();
    const firstDay = new Date();
    const lastDay = new Date();
    let lastDate = lastDay.setDate(lastDay.getDate() - 1)

    export default {
        name: 'user',
        data () {
            return {
                hostUrl: window.location.origin,
                apiURL: process.env.ROOT_API,
                sectionApi: 'userValidReferer',
                sectionApiGetStatus: '/getAutoApprovalStatus',
                sectionApiUser: 'user',

                format: 'yyyy-MM-dd',
                dateFrom: [FUNCTIONS.formatDate(lastDate), FUNCTIONS.formatDate(firstDay)],
                dateTo: FUNCTIONS.formatDate(lastDay),

                itemsData: [],
                itemsDataUser: [],
                itemsDevice: [],

                searchQuery: '',
                searchDevice: '',
                loading: true,
                loadingExcel: false,
                loadingUser: false,
                loadingDevice: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                switchOnOff: false,
                forms:{},
                TabsActive: 'info',
                hostUrl: window.location.origin,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['users.checkvalidreferar'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
            this.getAvailable()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newFilter){
                this.getResultFilter()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            dateFrom: function(newDate){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newDate[0], newDate[1])
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            buildUrl (limit, page, search, dateStart, dateEnd) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&date_start=' + dateStart + '&date_end=' + dateEnd
            },

            // get all post
            getPosts(num, pg, sch, dtst, dtend){
                let url = this.buildUrl(num, pg, sch, dtst, dtend)
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
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },
            
            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
            }, 300),

            updateCheckReveral(id){
                this.$confirm('Apakah anda yakin? Saat anda klik OK, maka referrer point akan di tambahkan', 'Perhatian', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                })
                .then(() => {
                    let url = this.apiURL + this.sectionApi + '/' + id
                    this.loading = true
                    this.axios.put(url)
                    .then(response => {
                        this.getPosts(this.perPage, this.currentPage, '', this.dateFrom[0], this.dateFrom[1])
                    })
                    .catch(error => { 
                        console.log(error);
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Lebih perhatikan lagi, data yang masuk'
                    });
                });
            },

            setAvailable(){
                let statusGami = ''
                if(this.switchOnOff == true){
                    statusGami = 'on'
                }else{
                    statusGami = 'off'
                }

                this.$confirm('Apakah anda yakin?', 'Auto Approve', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let url = this.apiURL + this.sectionApi
                    this.axios.post(url,{
                        status: statusGami
                    })
                    .then(response => {
                        this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
                        this.getAvailable()
                    })
                    .catch(error => { 
                        console.log(error);
                    })
                    .finally(() => {})
                }).catch(() => {
                    this.getAvailable()
                })
            },

            // Get Available Point Gamifications
            getAvailable(){
                let url = this.apiURL + this.sectionApi + this.sectionApiGetStatus
                this.axios.get(url)
                .then(response => {
                    console.log(response)
                    if(response.data.data.autoApproval == false){
                        this.switchOnOff = false
                    }else{
                        this.switchOnOff = true
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

            // Get Excel Download
            getExcel(){
                if(this.itemsData.length != 0){
                    let databeforeExcel = [];
                    let exportToExcel = [];

                    let url = this.buildUrl(this.totalPage, this.currentPage, this.searchQuery, this.dateFrom[0], this.dateFrom[1])
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
                                    'No': i + 1,
                                    'Username' : currentValue.username,
                                    'Full Name' : currentValue.fullname,
                                    'Email' : currentValue.email,
                                    'Phone Number' : currentValue.phone_number,
                                    'Balance' : currentValue.balance,
                                    'Point' : currentValue.points,
                                    'Referrer' : currentValue.ref_username,
                                    'Status' : currentValue.status,
                                    'Downline Topup At' : currentValue.created_at,
                                }
                            )
                        })

                        let filename = "Referrer-" + this.dateFrom[0] + "-to-" + this.dateFrom[1]

                        var wscols = [
                            {wch:3},
                            {wch:10},
                            {wch:15},
                            {wch:15},
                            {wch:15},
                            {wch:10},
                            {wch:10},
                            {wch:10},
                            {wch:10},
                            {wch:20},
                        ];

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'Cek Valid Referrer')
                        XLSX.writeFile(wb, filename+'.xlsx')
                    })
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Data Kosong'
                    });
                }
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                // this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
            itemUserDevice:function() {
                return this.itemsDevice.filter((row, index) => {
                    return row.device_token.toLowerCase().indexOf(this.searchDevice.toLowerCase()) > -1
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .manage-point{
        position: absolute;
        right: 25px;
        z-index: 100;
    }
    .tabs-device{
        .device-content{
            margin-top: 25px;
            .filterSearching{
                .input-with-icons{
                    width: 235px;
                }
            }
        }
    }
</style>