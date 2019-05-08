<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="History Pencairan Fee" :isCreate="false"></page-header>
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
                    <el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format"></el-date-picker>
                    <div style="float:left;">
                        <el-radio v-model="typeFee" label="spk" border>Crew</el-radio>
                        <el-radio v-model="typeFee" label="store" border>Store</el-radio>
                    </div>
                    <div class="input-with-icons clearfix">
                        <div class="el-input searchtype">
                            <input v-if="typeFee == 'spk'" type="text" v-model="filterQuery" class="el-input__inner selectUser" :placeholder="'Select User by Crew'">
                            <input v-else type="text" v-model="filterQuery" class="el-input__inner selectUser" :placeholder="'Select User by Store'">
                            <img src="~assets/images/icons/arrow-down.png">
                            <div class="dropdown-filterable">
                                <ul>
                                    <div v-if="searchLoading == true">
                                        <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                    </div>
                                    <div v-else>
                                        <div v-if="links.length !== 0">
                                            <li><a href="#" @click.prevent="filterByUser('')">All User</a></li>
                                            <li v-for="(itemUser, indexUser) in links"
                                            :key="indexUser"
                                            :label="itemUser.fullname"
                                            :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} <span v-if="typeFee == 'store'">({{itemUser.username}})</span></a></li>
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
                    ref="singleTable"
                    @current-change="handleCurrentChange"
                    v-loading="loading"
                    class="mobayar-table">
                    <!-- <el-table-column label="Periode" width="250">
                        <template slot-scope="scope">
                            {{scope.row.start_date | moment("YYYY-MM-DD")}} <b>s/d</b> {{scope.row.end_date | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="User">
                        <template slot-scope="scope">
                            <div v-if="scope.row.user">
                                {{scope.row.user.fullname}}<br>
                                {{scope.row.user.phone_number}}
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="user_type" label="Type" width="100"></el-table-column> -->
                    <el-table-column label="Amount">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.amount)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Creator">
                        <template slot-scope="scope">
                            <div v-if="scope.row.creator">
                                {{scope.row.creator.fullname}}
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
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
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info History Pencairan Fee</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Crew" v-if="typeFee == 'spk'">
                                                    <div v-if="itemDataDetailLocal.user" style="line-height: normal;">
                                                        {{itemDataDetailLocal.user.fullname}} <span v-if="itemDataDetailLocal.user.phone_number !== null">({{itemDataDetailLocal.user.phone_number}})</span>
                                                    </div>
                                                </el-form-item>
                                                <el-form-item label="Store" v-else>
                                                    <div v-if="itemDataDetailLocal.user" style="line-height: normal;">
                                                        {{itemDataDetailLocal.user.fullname}} <span v-if="itemDataDetailLocal.user.phone_number !== null">({{itemDataDetailLocal.user.phone_number}})</span>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Creator">
                                                    <div v-if="itemDataDetailLocal.creator" style="line-height: normal;">
                                                        {{itemDataDetailLocal.creator.fullname}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Created At">
                                                    <div v-if="itemDataDetailLocal.created_at" style="line-height: normal;">
                                                        {{itemDataDetailLocal.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <div v-if="(itemDataDetail).length !== 0">
                                                <el-col :span="12" v-if="(itemDataDetail.detailFee).length == 0">
                                                    <el-form-item label="Total Amount">
                                                        <div v-if="itemDataDetailLocal.amount" style="line-height: normal;">
                                                            Rp. {{formatPrice(itemDataDetailLocal.amount)}}
                                                        </div>
                                                    </el-form-item>
                                                </el-col>
                                            </div>
                                            <div class="barang-content clearfix" v-if="(itemDataDetail).length !== 0">
                                                <el-col :span="24" v-if="(itemDataDetail.detailFee).length !== 0">
                                                    <h5>Detail Rincian Amount</h5>
                                                    <div class="el-table mobayar-table">
                                                        <table cellspacing="0" cellpadding="0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nama Barang</th>
                                                                    <th style="text-align: center;">Qty</th>
                                                                    <th>Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr 
                                                                    v-for="(itembarang, indexbarang) in itemDataDetail.detailFee" 
                                                                    :key="indexbarang">
                                                                    <td>{{itembarang.transactionDetail.item.name}}</td>
                                                                    <td style="text-align: center;">{{itembarang.transactionDetail.qty}}</td>
                                                                    <td>Rp. {{formatPrice(itembarang.amount)}}</td>
                                                                </tr>
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colspan="2"><b>Total Amount</b></td>
                                                                    <td align="left">Rp. {{formatPrice(itemDataDetailLocal.amount)}}</td>
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
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import JQuery from 'jquery'
import FUNCTIONS from '@/functions'

import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default {
    name: 'offline-hubs-attribute',
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=fee',
            sectionApiGetHistory: '/history',
            sectionApiUser: 'user',
            sectionApiUserSpkHub: 'offlinehub?servicePathUrl=hub/spk',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            itemsData: [],
            itemDataDetail: [],
            itemDataDetailLocal: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            typeFee: 'spk',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            dataTextCreate: 'Buat Attribute Barang Offline Hub',
            dataTextUpdate: 'Detail History Pencairan Fee Offline Hub',
            confirmDescDelete: 'Anda yakin akan menghapus data Attribute dari daftar?',
            confirmTitleDelete: 'Hapus Attribute',
            textDataCreateSuccess: 'Data Attribute Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Attribute Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            filterQuery: '',
            links: [],
            searchLoading: false,
            idUser: '',
            forms:{
                key: '',
                value: '',
            },
            rules:{}
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.fee.history'])
    },
    watch:{
        typeFee: function(newValue){
            this.getPost('')
            this.getUserAll('', newValue)
            this.filterQuery = ''
            this.idUser = ''
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        dateRange: function(newValue, oldValue){
            if(newValue == null){
                this.dateRange = oldValue
            }else{
                this.getPost(this.idUser)
            }
        }
    },
    mounted(){
        this.getPost(this.idUser)
        this.searchUserInit()
        this.getUserAll('', this.typeFee)
    },
    methods:{
        getPost(userid){
            this.loading = true
            let url = this.urlService + this.sectionApi + this.sectionApiGetHistory + '&limit=' + this.perPage + '&page=' + this.currentPage + '&direction=DESC' + '&type=' + this.typeFee + '&userId=' + userid + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1]
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
        getExcel(){
            if(this.itemsData.length != 0){
                let databeforeExcel = [];
                let exportToExcel = [];
                let url = this.urlService + this.sectionApi + this.sectionApiGetHistory + '&limit=' + this.totalPage + '&page=1' + '&direction=DESC' + '&type=' + this.typeFee + '&userId=' + this.idUser + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1]

                this.loadingExcel = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'success'){
                        databeforeExcel = response.data.data.rows

                        this.loadingExcel = false

                        databeforeExcel.forEach(function(currentValue, i, arr){
                            let dataUser = currentValue.user !== null ? currentValue.user.fullname : '-'
                            let dataUserPhone = currentValue.user !== null ? currentValue.user.phone_number : '-'
                            let dataCreator = currentValue.creator !== null ? currentValue.creator.fullname : '-'
                            let dateCreatedAt = new Date(currentValue.created_at)
                            let fulldateCreatedAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()

                            exportToExcel.push(
                                {
                                    'Fullname': dataUser,
                                    'Phone Number': dataUserPhone,
                                    'Amount': currentValue.amount,
                                    'Creator': dataCreator,
                                    'Created At': fulldateCreatedAt
                                }
                            )
                        })

                        let filename
                        let excelTabName

                        if(this.typeFee == 'spk'){
                            excelTabName = 'History Pencairan Fee SPK'
                        }else{
                            excelTabName = 'History Pencairan Fee Store'
                        }

                        if(this.filterQuery == ''){
                            filename = "history-pencairan-fee-" + this.typeFee
                        }else{
                            filename = "history-pencairan-fee-" + this.typeFee + ' ' + this.filterQuery
                        }

                        var wscols = [
                            {wch:20},
                            {wch:20},
                            {wch:40},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                        ];

                        setTimeout(function(){
                            var datas = XLSX.utils.json_to_sheet(exportToExcel)
                            datas['!cols'] = wscols;
                            var wb = XLSX.utils.book_new()
                            XLSX.utils.book_append_sheet(wb, datas, excelTabName)
                            XLSX.writeFile(wb, filename+'.xlsx')
                        }, 200)
                    }else{
                        this.loadingExcel = false
                        this.$notify.error({
                            title: 'Error',
                            message: 'Gagal Export Data'
                        });
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: 'Error',
                        message: 'Gagal Export Data'
                    });
                })
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Data Kosong'
                });

            }
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                document.querySelector('.selectUser').addEventListener('click', function(){
                    if(document.querySelector('.dropdown-filterable')){
                        document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                    }
                });
                document.addEventListener('click', function(e){
                    if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                        if(document.querySelector('.dropdown-filterable')){
                            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                        }
                    }
                })
                var textInput = document.querySelector('.selectUser');
                var timeout = null;
                textInput.onkeyup = function (e) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        that.getUserAll(textInput.value, that.typeFee)
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
                this.idUser = ''
                this.getUserAll('', this.typeFee)
            }else{
                this.filterQuery = user.fullname
                if(this.typeFee == 'spk'){
                    usernameData = user.user_id
                    this.idUser = user.user_id
                }else{
                    usernameData = user.id
                    this.idUser = user.id
                }
            }
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.getPost(usernameData)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        getUserAll(search, types){
            let userDataurl
            if(types == 'spk'){
                userDataurl = this.urlService + this.sectionApiUserSpkHub + '&limit=100&direction=ASC&page=1&keyword=' + search
            }else{
                userDataurl = this.apiURL + this.sectionApiUser + '?limit=100&direction=ASC&order=fullname&page=1&search=' + search + '&role=10'
            }
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    if(types == 'spk'){
                        this.links = response.data.data.rows
                    }else{
                        this.links = response.data.data
                    }
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
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.fee.history.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    this.itemDataDetailLocal = val
                    let url = this.urlService + this.sectionApi + this.sectionApiGetHistory + '/' + val.id
                    this.postFunction('getbyid', '' , url)
                    this.initClickCreateFunction('show')
                }
            }else{
                this.$notify.error({
                    title: 'Error',
                    message: 'Anda tidak punya akses'
                });
            }
        },
        pageChange (page) {
            this.currentPage = page
            this.getPost(this.idUser)
        },
        limitChange(limit){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPost(this.idUser)
            document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
            event.target.parentNode.classList.add('active')
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.itemDataDetail = []
            this.itemDataDetailLocal = []
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
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menyimpan data'
                    });
                })
            }else if(type == 'put'){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                })
            }else if(type == 'getbyid'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        // this.forms = this.itemDataDetail
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }else if(type == 'delete'){
                this.axios.delete(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menghapus data'
                    });
                })
                .finally(() => {
                    this.closeModal();
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
    },
    components: { pageHeader, loadingSvg }
}
</script>