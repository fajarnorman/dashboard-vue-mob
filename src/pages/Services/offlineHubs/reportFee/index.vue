<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="Laporan Fee Crew" :isCreate="false"></page-header>
                </div>
                <div class="add-actions float-right" style="margin-top: 10px;">
                    <a @click.prevent="getExcel">
                        <el-button class="button-outline-green" round>
                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                            <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                        </el-button>
                    </a>
                </div>
            </div>
            <div class="content">
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
                            <input type="text" v-model="filterSearchQuery" class="el-input__inner selectUser" :placeholder="'Select Hub '">
                            <img src="~assets/images/icons/arrow-down.png">
                            <div class="dropdown-filterable">
                                <ul>
                                    <div v-if="searchLoading == true">
                                        <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                    </div>
                                    <div v-else>
                                        <div v-if="links.length !== 0">
                                            <li><a href="#" @click.prevent="filterByUser('')">All Hub</a></li>
                                            <li v-for="(itemUser, indexUser) in links"
                                            :key="indexUser"
                                            :label="itemUser.fullname"
                                            :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.name}}</a></li>
                                        </div>
                                        <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <el-alert 
                    v-if="messagesuccess" 
                    title="" 
                    type="success" 
                    :description="messagesuccess" 
                    show-icon></el-alert>
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    @current-change="handleCurrentChange"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column type="index" label="No" width="50"></el-table-column>
                    <el-table-column label="Hub">
                        <template slot-scope="scope">
                            <div v-if="scope.row.hub">{{scope.row.hub.name}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Crew">
                        <template slot-scope="scope">
                            <div v-if="scope.row.crew">{{scope.row.crew.fullname}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Pay At">
                        <template slot-scope="scope">
                            {{scope.row.payed_at | moment("YYYY-MM-DD, H:mm:ss")}}
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
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm nolineHeight">
                                <div class="item-forms-details" v-if="itemDataDetail">
                                    <h5>Info Transaksi</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Crew">
                                                    <div v-if="itemDataDetail.crew">
                                                        {{itemDataDetail.crew.fullname}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Pay At">
                                                    {{itemDataDetail.payed_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Hub">
                                                    <div v-if="itemDataDetail.hub">
                                                        {{itemDataDetail.hub.name}}<br>
                                                        {{itemDataDetail.hub.address}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24" v-if="itemDataDetail.details">
                                                <div class="barang-content clearfix">
                                                    <h5>Details</h5>
                                                    <div class="el-table mobayar-table">
                                                        <table cellspacing="0" cellpadding="0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Deskripsi</th>
                                                                    <th>Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr 
                                                                    v-for="(itembarang, indexbarang) in itemDataDetail.details" 
                                                                    :key="indexbarang">
                                                                    <td>{{itembarang.description}}</td>
                                                                    <td>Rp. {{formatPrice(itembarang.amount)}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
                    </div>
                </div>
                <table border="1" style="width: 100%;display:none;" id="table-export-fee-crew">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Waktu</th>
                            <th>User</th>
                            <th>Deskripsi</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody 
                        v-for="(dataCrewFee, indexCrewFee) in itemsDataExport" 
                        :key="indexCrewFee">
                        <tr 
                            v-for="(dataDetails, indexDetails) in dataCrewFee.details" 
                            :key="indexDetails">
                            <td>{{dataCrewFee.payed_at | moment("YYYY-MM-DD")}}</td>
                            <td>{{dataCrewFee.payed_at | moment("H:mm:ss")}}</td>
                            <td><div v-if="dataCrewFee.crew">{{dataCrewFee.crew.fullname}}</div></td>
                            <td>{{dataDetails.description}}</td>
                            <td>{{dataDetails.amount}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: 'offline-hubs-transactions',
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=report/transactionCrew',
            sectionApiHub: 'offlinehub?servicePathUrl=hub',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            searchLoading: false,
            links: [],
            itemsData: [],
            itemDataDetail: [],
            itemsDataExport: [],
            filterQuery: ' ',
            filterSearchQuery: '',
            filterbyHub: '',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextUpdate: 'Detail Fee Crew',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{},
            rules:{}
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.transaction.all'])
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            FUNCTIONS.checkPaginations()
        },
        dateRange: function(newValue){
            this.getPost(this.searchQuery)
            FUNCTIONS.checkPaginations()
        },
        filterQuery: function(newValue){
            this.getPost(this.searchQuery)
            FUNCTIONS.checkPaginations()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.searchUserInit()
        this.getUserAll('')
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt' + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&hubId=' + this.filterbyHub
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: response.data.message
                    });    
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        getExcel(){
            if(this.itemsData.length != 0){
                let databeforeExcel = [];
                let exportToExcel = [];
                let url = this.urlService + this.sectionApi + '&limit=' + this.totalPage + '&page=1' + '&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt' + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&hubId=' + this.filterbyHub + '&export=1'

                this.loadingExcel = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'success'){
                        this.itemsDataExport = response.data.data.rows
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
                    let that = this
                    setTimeout(function(){
                        that.loadingExcel = false
                        var wscols = [
                            {wch:15},
                            {wch:10},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                        ];
                        var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-fee-crew'))
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        let filename = "laporan-fee-crew-" + that.dateRange[0] + "-to-" + that.dateRange[1]
                        XLSX.utils.book_append_sheet(wb, datas, 'Laporan Fee Crew')
                        XLSX.writeFile(wb, filename+'.xlsx')
                    }, 1000)
                })
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Data Kosong'
                });

            }
        },
        handleCurrentChange(val){
            if(val){
                this.titleForms = this.dataTextUpdate
                this.formsType = 'edit'
                this.itemDataDetail = val
                this.initClickCreateFunction('show')
            }
        },
        pageChange (page) {
            this.currentPage = page
            this.getPost(this.searchQuery)
        },
        limitChange(limit){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPost(this.searchQuery)
            document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
            event.target.parentNode.classList.add('active')
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.itemDataDetail = []
        },
        initClickCreateFunction(value){
            if(value == 'show'){
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            }else{
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
            }
        },
        formatPrice(value) {
            return FUNCTIONS.formatPrice(value)
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                document.querySelector('.selectUser').addEventListener('click', function(){
                    document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                });
                document.addEventListener('click', function(e){
                    if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                        document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
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
                this.filterSearchQuery = ''
                this.filterbyHub = ''
                this.getUserAll('')
            }else{
                this.filterSearchQuery = user.name
                this.filterbyHub = user.id
            }
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        getUserAll(search){
            let userDataurl = this.urlService + this.sectionApiHub + '&limit=100&page=1' + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt'
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    this.links = response.data.data.rows
                    this.searchLoading = false
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                this.searchLoading = false
            })
        }
    },
    components: { pageHeader, loadingSvg }
}
</script>
