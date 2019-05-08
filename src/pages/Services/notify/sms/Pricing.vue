<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="SMS Pricing" :isCreate="true"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
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
                    <el-table-column prop="operator" label="Operator"></el-table-column>
                    <el-table-column prop="provider" label="Provider"></el-table-column>
                    <el-table-column prop="currency" label="Currency"></el-table-column>
                    <el-table-column label="Price Regular">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.price_regular)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Price Premium">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.price_premium)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="Created At">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, h:mm:ss")}}
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
                                    <h5>Info Pricing</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Provider" prop="provider">
                                                    <el-select v-model="forms.provider" placeholder="Select">
                                                        <el-option 
                                                            v-for="(dataProvider, indexProvider) in itemsDataProvider"
                                                            :key="indexProvider"
                                                            :value="dataProvider.slug" 
                                                            :label="dataProvider.slug">{{dataProvider.name}} ({{dataProvider.slug}})</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Operator" prop="operator">
                                                    <el-select v-model="forms.operator" placeholder="Select">
                                                        <el-option 
                                                            v-for="(dataOperator, indexOperator) in itemsDataOperator"
                                                            :key="indexOperator"
                                                            :value="dataOperator.slug" 
                                                            :label="dataOperator.slug">{{dataOperator.name}} ({{dataOperator.slug}})</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Currency" prop="currency">
                                                    <el-input v-model="forms.currency" placeholder="IDR, EUR"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Price Regular" prop="price_regular">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.price_regular" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Price Premium" prop="price_premium">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.price_premium " v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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

export default {
    name: 'notify-smsPricing',
    data(){
        return{
            sectionApi: 'notification?servicePathUrl=sms/pricing',
            sectionApiProvider: 'notification?servicePathUrl=sms/provider',
            sectionApiOperator: 'notification?servicePathUrl=sms/operator',
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            itemsDataProvider: [],
            itemsDataOperator: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Pricing Baru',
            dataTextUpdate: 'Edit Pricing Baru',
            confirmDescDelete: 'Anda yakin akan menghapus data Pricing dari daftar?',
            confirmTitleDelete: 'Hapus Pricing',
            textDataCreateSuccess: 'Data Pricing Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Pricing Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                currency: '',
                price_premium: '',
                price_regular : '',
                provider: '',
                operator: '',
            },
            rules:{
                currency: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                price_premium: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                price_regular: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                provider: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                operator: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
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
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.getPostProvider()
        this.getPostOperator()
        this.initCreateFunction()
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt'
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
                this.loading = false
            })
        },
        getPostOperator(){
            this.loading = true
            let url = this.urlService + this.sectionApiOperator
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataOperator = response.data.data.rows
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
                        let formData = {
                            currency: (this.forms.currency).toUpperCase(),
                            operator: this.forms.operator,
                            price_premium: this.forms.price_premium,
                            price_regular: this.forms.price_regular,
                            provider: this.forms.provider,
                        }
                        this.postFunction('post', formData, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/' + this.itemDataDetail.id
                        let formData = {
                            currency: (this.forms.currency).toUpperCase(),
                            operator: this.forms.operator,
                            price_premium: this.forms.price_premium,
                            price_regular: this.forms.price_regular,
                            provider: this.forms.provider,
                        }
                        this.postFunction('put', formData, urlv)
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
                this.forms.provider = this.itemDataDetail.provider
                this.forms.operator = this.itemDataDetail.operator
                this.forms.price_premium = this.itemDataDetail.price_premium
                this.forms.price_regular = this.itemDataDetail.price_regular
                this.forms.currency = this.itemDataDetail.currency
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
            this.forms.price_premium = ''
            this.forms.price_regular  = ''
            this.forms.provider = ''
            this.forms.operator = ''
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
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
    },
    components: { pageHeader, loadingSvg, Money }
}
</script>