<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="SMS Operator" :isCreate="$dataRole['service.notification.post.sms.operator']"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                    <el-select v-model="typeSearch" placeholder="Select Type">
                        <el-option value="all" label="Select Type">All Type</el-option>
                        <el-option value="reg" label="Regular">Regular</el-option>
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
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column type="index" label="No" width="50"></el-table-column>
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <!-- <el-table-column prop="slug" label="Slug"></el-table-column> -->
                    <el-table-column prop="type" label="Type"></el-table-column>
                    <el-table-column label="Price & Currency">
                        <template slot-scope="scope">
                            {{scope.row.currency}} {{scope.row.price}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="smsProviderSlug" label="SMS Provider" width="250">
                        <template slot-scope="scope">
                            <el-radio-group v-model="smsProviderChange[scope.$index]" @change="changProviderValue(scope.row, scope.$index)">
                                <el-radio 
                                    v-for="(dataProvider, indexProvider) in itemsDataProvider"
                                    :key="indexProvider" 
                                    :label="dataProvider.slug">{{dataProvider.name}}</el-radio>
                            </el-radio-group>
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions">
                        <template slot-scope="scope">
                            <a style="margin-right: 15px;" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" /></a>
                            <a @click.prevent="deletePost(scope.row.id)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="value" label="Created At">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, h:mm:ss")}}
                        </template>
                    </el-table-column> -->
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
                                                <el-form-item label="Name" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Sender" prop="sender_slug">
                                                    <el-select v-model="forms.sender_slug" placeholder="Select">
                                                        <el-option 
                                                            v-for="(dataProvider, indexProvider) in itemsDataProvider"
                                                            :key="indexProvider"
                                                            :value="dataProvider.slug" 
                                                            :label="dataProvider.slug">{{dataProvider.name}} ({{dataProvider.slug}})</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Type">
                                                    <el-radio-group v-model="forms.type">
                                                        <el-radio label="otp">OTP</el-radio>
                                                        <el-radio label="reg">Regular</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Currency" prop="currency">
                                                    <el-input v-model="forms.currency" placeholder="IDR, EUR"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Price" prop="price">
                                                    <!-- <div class="el-form-item__content custom-price-format"> -->
                                                        <!-- <div class="el-input"> -->
                                                            <!-- <money v-model="forms.price" v-bind="money" class="el-input__inner"></money> -->
                                                            <el-input v-model="forms.price"></el-input>
                                                        <!-- </div> -->
                                                    <!-- </div> -->
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.notification.delete.sms.operator.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.notification.put.sms.operator.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Money} from 'v-money'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'notify-smsOperator',
    data(){
        return{
            sectionApi: 'notification?servicePathUrl=sms/operator',
            sectionApiProvider: 'notification?servicePathUrl=sms/provider',
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            itemsDataProvider: [],
            smsProviderChange: [],
            searchQuery: '',
            providerSearch: '',
            totalPage: '',
            typeSearch: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Operator Baru',
            dataTextUpdate: 'Edit Operator',
            confirmDescDelete: 'Anda yakin akan menghapus data Operator dari daftar?',
            confirmDescEdit: 'Anda yakin akan mengganti data Operator dari daftar?',
            confirmTitleDelete: 'Hapus Operator',
            confirmTitleEdit: 'Edit Operator',
            textDataCreateSuccess: 'Data Operator Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Operator Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                sender_slug: '',
                type: 'otp',
                currency: '',
                price: '',
            },
            fontsIcons:{
                edit: faEdit,
                delete: faTrashAlt,
            },
            rules:{
                name: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                sender_slug: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                currency: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                price: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ]
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false /* doesn't work with directive */
            },
        }
    },
    created(){
        // FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
        FUNCTIONS.checkPermissions(this.$dataRole['service.notification.get.sms.operator'])
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        typeSearch: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        providerSearch: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.initCreateFunction()
    },
    methods:{
        getPost(search){
            this.getPostProvider()
            this.smsProviderChange = []
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt' + '&provider=' + this.providerSearch + '&type=' + this.typeSearch
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total

                    this.itemsData.forEach(function(e){
                        this.smsProviderChange.push(e.smsProviderSlug)
                    }, this)
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
        changProviderValue(data, value){
            this.$confirm(this.confirmDescEdit, this.confirmTitleEdit, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.loading = true
                // this.itemsData = []
                let urlv = this.urlService + this.sectionApi + '/' + data.id
                let dataEditForm = {
                    name: data.name,
                    sender_slug: this.smsProviderChange[value],
                    type: data.type,
                    currency: data.currency,
                    price: data.price
                }
                this.postFunction('put', dataEditForm, urlv)
            }).catch(() => {
                this.getPost(this.searchQuery)
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
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
                this.loading = true
                // this.itemsData = []
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
                this.forms.name = this.itemDataDetail.name
                this.forms.sender_slug = this.itemDataDetail.smsProviderSlug
                this.forms.type = this.itemDataDetail.type
                this.forms.currency = this.itemDataDetail.currency
                this.forms.price = this.itemDataDetail.price
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
            this.forms.type = 'otp'
            this.forms.currency = ''
            this.forms.price = ''
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
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        // this.itemsData = []
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
    components: { pageHeader, loadingSvg, Money }
}
</script>