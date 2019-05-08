<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="SMS Report" :isCreate="false"></page-header>
                </div>
                <div class="add-actions" style="margin-top: 10px;">
                    <a @click.prevent="getExcel" class="float-right">
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
                    <el-select v-model="typeSearch" placeholder="Select Type">
                        <el-option value="all" label="Select Type">All Type</el-option>
                        <el-option value="alert" label="Alert">Alert</el-option>
                        <el-option value="otp" label="OTP">OTP</el-option>
                    </el-select>
                    <el-select v-model="providerSearch" placeholder="Select Provider">
                        <el-option value="all" label="Select Provider">All Provider</el-option>
                        <el-option 
                            v-for="(dataProvider, indexProvider) in itemsDataProvider"
                            :key="indexProvider"
                            :value="dataProvider.slug" 
                            :label="dataProvider.name">{{dataProvider.name}}</el-option>
                    </el-select>
                </div>
                <el-alert 
                    v-if="messagesuccess" 
                    title="" 
                    type="success" 
                    :description="messagesuccess" 
                    show-icon></el-alert>
                <div class="filterstatus">
                    <el-tabs v-model="filterQuery">
                        <el-tab-pane label="Pending" name="pending"></el-tab-pane>
                        <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                        <el-tab-pane label="Success" name="success"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="recipient" label="Recipient" width="120"></el-table-column>
                    <el-table-column prop="message" label="Message" width="250">
                        <template slot-scope="scope">
                            <div v-if="scope.row.message == null">-</div>
                            <div v-else class="more-description">
                                <read-more more-str="read more" :text="scope.row.message" link="#" less-str="read less" :max-chars="80"></read-more>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="provider" label="Provider"></el-table-column>
                    <el-table-column prop="price" label="Price">
                        <template slot-scope="scope">
                            {{scope.row.currency}} {{scope.row.price}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="Type" width="100"></el-table-column>
                    <el-table-column prop="value" label="Created At" width="150">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="Detail SMS Report" placement="top">
                                <a style="margin-right: 15px;" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.detail" /></a>
                            </el-tooltip>
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
                                    <h5>Info Operator</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Receipent">
                                                    <div v-if="itemDataDetail.recipient" style="line-height: normal;">
                                                        {{itemDataDetail.recipient}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Message">
                                                    <div v-if="itemDataDetail.message" style="line-height: normal;">
                                                        {{itemDataDetail.message}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Provider">
                                                    <div v-if="itemDataDetail.provider">
                                                        {{itemDataDetail.provider}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Price">
                                                    <div v-if="itemDataDetail.price">
                                                        {{itemDataDetail.price}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Type">
                                                    <div v-if="itemDataDetail.type">
                                                        {{itemDataDetail.type}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Status">
                                                    <div v-if="itemDataDetail.status">
                                                        {{itemDataDetail.status}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Currency">
                                                    <div v-if="itemDataDetail.currency">
                                                        {{itemDataDetail.currency}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Created At">
                                                    <div v-if="itemDataDetail.created_at">
                                                        {{itemDataDetail.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Division">
                                                    <div v-if="itemDataDetail.division">
                                                        {{itemDataDetail.division}}
                                                    </div>
                                                    <div v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'
import readMore from '@/components/partials/readmore.vue'

import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default {
    name: 'notify-smsReport',
    data(){
        return{
            sectionApi: 'notification?servicePathUrl=sms/report',
            sectionApiProvider: 'notification?servicePathUrl=sms/provider',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            itemsData: [],
            itemDataDetail: [],
            itemsDataProvider: [],
            searchQuery: '',
            typeSearch: '',
            providerSearch: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            filterQuery: 'pending',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Operator Baru',
            dataTextUpdate: 'Detail SMS Report',
            confirmDescDelete: 'Anda yakin akan menghapus data Operator dari daftar?',
            confirmTitleDelete: 'Hapus Operator',
            textDataCreateSuccess: 'Data Operator Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Operator Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                sender_slug: '',
            },
            rules:{
                name: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                sender_slug: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
            },
            fontsIcons:{
                edit: faEdit,
                detail: faInfoCircle,
            }
        }
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        dateRange: function(newValue, oldValue){
            if(newValue !== null){
                this.getPost(this.searchQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }else{
                this.dateRange = oldValue
            }
        },
        filterQuery: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        typeSearch: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        providerSearch: function(){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    created(){
        // FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
        FUNCTIONS.checkPermissions(this.$dataRole['service.notification.get.sms.report'])
    },
    mounted(){
        this.getPost(this.searchQuery)
    },
    methods:{
        getPost(search){
            this.getPostProvider()
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt' + '&date_start=' + this.dateRange[0] + '&date_end=' + this.dateRange[1] + '&status=' + this.filterQuery + '&type=' + this.typeSearch + '&provider=' + this.providerSearch
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
        getPostProvider(){
            this.loading = true
            let url = this.urlService + this.sectionApiProvider
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataProvider = response.data.data.rows
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
                // this.loading = false
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        getExcel(){
            if(this.dateRange !== null){
                if(this.itemsData.length != 0){
                    let databeforeExcel = [];
                    let exportToExcel = [];
                    let url = this.urlService + this.sectionApi + '&limit=' + this.totalPage + '&page=1' + '&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt' + '&date_start=' + this.dateRange[0] + '&date_end=' + this.dateRange[1] + '&status=' + this.filterQuery + '&type=' + this.typeSearch + '&provider=' + this.providerSearch

                    this.loadingExcel = true
                    this.axios.get(url)
                    .then(response => { 
                        if(response.data.status == 'success'){
                            databeforeExcel = response.data.data.rows

                            this.loadingExcel = false

                            databeforeExcel.forEach(function(currentValue, i, arr){
                                let dateCreatedAt = new Date(currentValue.created_at)
                                let fulldateCreateAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()
                                exportToExcel.push(
                                    {
                                        'Recepient' : currentValue.recipient,
                                        'Message' : currentValue.message,
                                        'Provider' : currentValue.provider,
                                        'Price' : currentValue.price,
                                        'Type' : currentValue.type,
                                        'Status' : currentValue.status,
                                        'Currency' : currentValue.currency,
                                        'Created At' : fulldateCreateAt
                                    }
                                )
                            })

                            let filename = "laporan-sms-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                            var wscols = [
                                {wch:20},
                                {wch:50},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20}
                            ];

                            var datas = XLSX.utils.json_to_sheet(exportToExcel)
                            datas['!cols'] = wscols;
                            var wb = XLSX.utils.book_new()
                            XLSX.utils.book_append_sheet(wb, datas, 'Laporan SMS')
                            XLSX.writeFile(wb, filename+'.xlsx')
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
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Data Kosong'
                    });

                }
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Tanggal Tidak Boleh Kosong'
                });
            }
        },
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.itemsData = []
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi
                        this.postFunction('post', this.forms, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/' + this.itemDataDetail.id
                        this.postFunction('put', this.forms, urlv)
                    }
                }
            })
        },
        deletePost(id){
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.itemsData = []
                let url = this.urlService + this.sectionApi + '/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
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
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){ 
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.initClickCreateFunction('show')
                    }else{
                        that.$notify({
                            type: 'warning',
                            title: 'Maaf',
                            message: that.textMemuatData
                        });
                    } 
                })
            }, 500)
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.forms.name = ''
            this.forms.sender_slug = ''
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
                        this.forms = this.itemDataDetail
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
    },
    computed: { 
        message () {
            return this.$store.getters.message
        }
    },
    components: { pageHeader, loadingSvg, readMore }
}
</script>