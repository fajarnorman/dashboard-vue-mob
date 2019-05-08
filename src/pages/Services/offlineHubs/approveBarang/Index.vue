<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Daftar Pengajuan Barang" :isCreate="false"></page-header>
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
                    <el-table-column prop="name" label="Nama"></el-table-column>
                    <el-table-column label="Produsen">
                        <template slot-scope="scope">
                            <div v-if="scope.row.producer">{{scope.row.producer.fullname}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Status">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 'waiting'" class="badge inline pending">{{scope.row.status}}</span>
                            <span v-else-if="scope.row.status == 'accept'" class="badge inline success">{{scope.row.status}}</span>
                            <span v-else-if="scope.row.status == 'reject'" class="badge inline failed">{{scope.row.status}}</span>
                            <span v-else>{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Base Price">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.buy_price)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="Deskripsi">
                        <template slot-scope="scope">
                            <less-text :text="scope.row.description" :max-chars="80"></less-text>
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
                            <el-button @click="closeModal()" id="cancel"><img src="~assets/images/icons/big-close.png"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details forms-side-by-side">
                                    <h5>Info Barang</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Nama : ">
                                                    {{itemDataDetail.name}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Produsen : ">
                                                    <div v-if="itemDataDetail.producer">
                                                        {{itemDataDetail.producer.fullname}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Base Price : ">
                                                    Rp. {{formatPrice(itemDataDetail.buy_price)}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Deskripsi : ">
                                                    <div style="white-space: pre-line;white-space: pre-line;">{{itemDataDetail.description}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Status : ">
                                                    <span v-if="itemDataDetail.status == 'waiting'" class="badge inline pending">{{itemDataDetail.status}}</span>
                                                    <span v-else-if="itemDataDetail.status == 'accept'" class="badge inline success">{{itemDataDetail.status}}</span>
                                                    <span v-else-if="itemDataDetail.status == 'reject'" class="badge inline failed">{{itemDataDetail.status}}</span>
                                                    <span v-else>{{itemDataDetail.status}}</span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24" v-if="itemDataDetail.images">
                                                <el-form-item label="Images : " v-if="(itemDataDetail.images).length !== 0">
                                                    <div 
                                                        v-for="(dataImages, indexImages) in itemDataDetail.images" 
                                                        :key="indexImages"
                                                        class="img-approve-container">
                                                        <img :src="dataImages.url + dataImages.image" class="img-approve-detail">
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24" v-if="itemDataDetail.action == 'update'">
                                                <div class="barang_sebelumnya">
                                                    <h5>Info Barang Sebelumnya</h5>
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Barang : ">
                                                                {{itemDataProductItems.name}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Base Price: ">
                                                                <b>Rp. {{formatPrice(itemDataProductItems.base_price)}}</b>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="SPK Fee: ">
                                                                Rp. {{formatPrice(itemDataProductItems.fee_spk)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Store Fee: ">
                                                                Rp. {{formatPrice(itemDataProductItems.fee_store)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="User Fee: ">
                                                                Rp. {{formatPrice(itemDataProductItems.fee_user)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Mobayar Fee: ">
                                                                Rp. {{formatPrice(itemDataProductItems.fee_mobayar)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Harga Jual: ">
                                                                <b>Rp. {{formatPrice(itemDataProductItems.sell_price)}}</b>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Images : ">
                                                                <div 
                                                                    v-for="(dataImages, indexImages) in itemDataProductItems.images" 
                                                                    :key="indexImages"
                                                                    class="img-approve-container">
                                                                    <img :src="dataImages.url + dataImages.image" class="img-approve-detail">
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details forms-side-by-side" v-if="statusItem == 'accept'">
                                    <h5>Fee & Price Barang</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Base Price : ">
                                                    <b style="font-size: 20px;">Rp. {{formatPrice(itemDataDetail.buy_price)}}</b>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="SPK Fee" prop="feeSpk">
                                                    <div class="el-form-item__content custom-price-format" >
                                                        <div class="el-input">
                                                            <money v-model="feeSpk" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Store Fee" prop="feeStore">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="feeStore" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="User Fee" prop="feeUser">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="feeUser" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Mobayar Fee" prop="feeMobayar">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="feeMobayar" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Harga Jual : ">
                                                    <b style="font-size: 20px;">Rp. {{formatPrice(itemDataDetail.buy_price + sellPrice)}}</b>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>  
                                <div class="item-forms-details" v-if="statusItem == 'reject'">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Alasan Menolak Pengajuan Barang" prop="reasonReject">
                                                    <el-input type="textarea" :rows="5" placeholder="Tulis Alasan Anda untuk menolak pengajuan barang dari produsen" v-model="reasonReject"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix" v-if="$dataRole['service.offlinehub.get.item.update.status.*']" v-show="statusItem == ''">
                        <el-button class="button-outline-black" @click.prevent="setStatusProduct('reject')">Reject</el-button>
                        <el-button class="button-white-green" @click.prevent="setStatusProduct('accept')">Approve</el-button>
                    </div>
                    <div class="actions-button clearfix" v-if="statusItem == 'reject'">
                        <el-button class="button-outline-black" @click="setStatusProduct('')">Cancel</el-button>
                        <el-button class="button-white-green" id="save" @click.prevent="submitSave('formsvalid')">Submit</el-button>
                    </div>
                    <div class="actions-button clearfix" v-else-if="statusItem == 'accept'">
                        <el-button class="button-outline-black" @click="setStatusProduct('')">Cancel</el-button>
                        <el-button class="button-white-green" id="save" @click.prevent="submitSave('formsvalid')">Submit</el-button>
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
import lessText from '../lessText.vue'

export default {
    name: 'offline-hubs-approve-barang',
    data(){
        var ValidateMinus = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('Inputan tidak boleh minus'));
            }
            callback();
        };
        return{
            sectionApi: 'offlinehub?servicePathUrl=apply-item',
            sectionApiItems: 'offlinehub?servicePathUrl=item',
            sectionApiApproveProduct: 'offlinehub?servicePathUrl=item/update/status/',
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            itemDataProductItems: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Attribute Barang Offline Hub',
            dataTextUpdate: 'Detail Pengajuan Barang',
            confirmDescDelete: 'Anda yakin akan menghapus data Attribute dari daftar?',
            confirmTitleDelete: 'Hapus Attribute',
            textDataCreateSuccess: 'Pengajuan Barang di sejutui',
            textDataUpdateSuccess: 'Pengajuan Barang tidak di sejutui',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textErrorNetwork: 'Jaringan Bermasalah',
            statusItem: '',
            sellPrice: '',
            feeMobayar: 0,
            feeSpk: 0,
            feeStore: 0,
            feeUser: 0,
            reasonReject: '',
            forms:{
                feeMobayar: 0,
                feeSpk: 0,
                feeStore: 0,
                feeUser: 0,
                reasonReject: '',
            },
            rules:{
                feeMobayar: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeSpk: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeStore: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeUser: [ { validator: ValidateMinus, trigger: 'blur' } ],
                reasonReject: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ]
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false
            },
        }
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        feeSpk: function(newValue){
            this.sellPrice = newValue  + this.feeMobayar + this.feeStore + this.feeUser
            this.forms.feeSpk = newValue
        },
        feeMobayar: function(newValue){
            this.sellPrice = newValue  + this.feeSpk + this.feeStore + this.feeUser
            this.forms.feeMobayar = newValue
        },
        feeStore: function(newValue){
            this.sellPrice = newValue  + this.feeSpk + this.feeMobayar + this.feeUser
            this.forms.feeStore = newValue
        },
        feeUser: function(newValue){
            this.sellPrice = newValue  + this.feeSpk + this.feeMobayar + this.feeStore
            this.forms.feeUser = newValue
        },
        reasonReject: function(newValue){
            this.forms.reasonReject = newValue
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.apply-item'])
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.initCreateFunction()
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC&orderBy=createdAt' 
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
                    message: 'Gagal mendapatkan data pengajuan barang'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        submitSave(formName){
            let formsData
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.$confirm('Apakah anda sudah yakin dengan data yang anda inputkan?', 'Perhatian!', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApiApproveProduct + this.itemDataDetail.id
                        if(this.statusItem == 'accept'){
                            formsData = {
                                feeMobayar: this.feeMobayar,
                                feeSpk: this.feeSpk,
                                feeStore: this.feeStore,
                                feeUser: this.feeUser,
                                status: this.statusItem,
                            }
                        }else{
                            formsData = {
                                failedReason: this.reasonReject,
                                status: this.statusItem,
                            }
                        }
                        this.postFunction('put', formsData, urlv)
                    })
                }
            })
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.apply-item.detail.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.urlService + this.sectionApi + '/detail/' + val.id
                    this.postFunction('getbyid', '', url)
                    if(val.product_item !== null){
                        let urlProductItems = this.urlService + this.sectionApiItems + '/detail/' + val.product_item
                        this.postFunction('getproductItems', '', urlProductItems)
                    }
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
                if(document.querySelector('.add-click-forms') !== null){
                    document.querySelector('.add-click-forms').addEventListener('click', function(){ 
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.initClickCreateFunction('show') 
                    })
                }
            }, 500)
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.statusItem = ''
            this.sellPrice = ''
            this.feeMobayar = 0
            this.feeSpk = 0
            this.feeStore = 0
            this.feeUser = 0
            this.reasonReject = ''
            this.itemDataProductItems = []
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
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    console.log(error)
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal meyimpan data'
                    });
                })
            }else if(type == 'put'){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        if(this.statusItem == 'accept'){
                            this.messagesuccess = this.textDataCreateSuccess 
                        }else{
                            this.messagesuccess = this.textDataUpdateSuccess
                        }
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
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }else if(type == 'delete'){
                this.axios.delete(url)
                .then(response => {
                    this.getPost('')
                    this.closeModal();
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.closeModal();
                    this.messagesuccess = this.textDataDeleteSuccess
                })
            }else if(type == 'getproductItems'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataProductItems = response.data.data
                        this.feeMobayar = this.itemDataProductItems.fee_mobayar
                        this.feeSpk = this.itemDataProductItems.fee_spk
                        this.feeStore = this.itemDataProductItems.fee_store
                        this.feeUser = this.itemDataProductItems.fee_user
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
                        message: 'Gagal mendapatkan data produk item'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        setStatusProduct(value){
            this.statusItem = value
            this.reasonReject = ''
        }
    },
    components: { pageHeader, loadingSvg, Money, lessText }
}
</script>
<style lang="scss" scoped>
.img-approve-container{
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
    .img-approve-detail{
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
}
.barang_sebelumnya{
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #fafafa;
}
</style>
