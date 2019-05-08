<template>
    <div class="content-wrapper">
        <div id="master-barang-category-product">
            <div class="page-header">
                <page-header titleName="Item Produk" :isCreate="$dataRole['service.offlinehub.post.item.create']"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                    <div class="input-with-icons clearfix">
                        <div class="el-input searchtype">
                            <input type="text" v-model="filterSearchQuery" class="el-input__inner selectUser" :placeholder="'Select Tipe Produk'">
                            <img src="~assets/images/icons/arrow-down.png">
                            <div class="dropdown-filterable">
                                <ul>
                                    <div v-if="searchLoading == true">
                                        <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                    </div>
                                    <div v-else>
                                        <div v-if="links.length !== 0">
                                            <li><a href="#" @click.prevent="filterByUser('')">All Tipe Produk</a></li>
                                            <li v-for="(itemUser, indexUser) in links"
                                            :key="indexUser">
                                                <a href="#" @click.prevent="filterByUser(itemUser)">
                                                    <span style="vertical-align: middle;">{{itemUser.title}}</span>
                                                </a>
                                            </li>
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
                    <el-table-column prop="name" label="Nama"></el-table-column>
                    <el-table-column label="Base Price">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.base_price)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fee Crew">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.fee_spk)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fee Mobayar">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.fee_mobayar)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fee Toko">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.fee_store)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fee User">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.fee_user)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Harga Jual">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.sell_price)}}
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
                            <div v-if="(messageerror != '')">
                                <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                            </div>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info Produk Offline Hub</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Produk" prop="productId">
                                                    <el-select no-data-text="No data" v-model="forms.productId" placeholder="Select Produk">
                                                        <el-option v-for="(dataCat, indexCat) in itemsDataProduct" :value="dataCat.id" :label="dataCat.name" :key="indexCat">{{dataCat.name}}</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Produsen" prop="producerId">
                                                    <el-select no-data-text="No data" v-model="forms.producerId" placeholder="Select Produsen">
                                                        <el-option v-for="(dataCat, indexCat) in itemsDataProdusen" :value="dataCat.id" :label="dataCat.fullname" :key="indexCat">{{dataCat.fullname}}</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Tipe Produk" prop="typeId">
                                                    <el-select no-data-text="No data" v-model="forms.typeId" placeholder="Select Produsen">
                                                        <el-option v-for="(dataType, indexType) in itemsDataType" :value="dataType.id" :label="dataType.title" :key="indexType">
                                                            <img v-if="dataType.icon !== null" :src="dataType.icon" class="images-select">
                                                            <img v-else src="~assets/images/logo.png" class="images-select no-images">
                                                            <span style="vertical-align: middle;">{{dataType.title}}</span>
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Deskripsi">
                                                    <el-input v-model="forms.description" :rows="5" type="textarea"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <!-- <el-col :span="24">
                                                <el-form-item label="Status" prop="status">
                                                    <el-radio-group v-model="forms.status">
                                                        <el-radio label="active">Active</el-radio>
                                                        <el-radio label="inactive">Inactive</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col> -->
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details">
                                    <h5>Harga</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Base Price" prop="basePrice">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.basePrice" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Fee Mobayar" prop="feeMobayar">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.feeMobayar" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Fee Crew" prop="feeSpk">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.feeSpk" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Fee Store" prop="feeStore">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.feeStore" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Fee User" prop="feeUser">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.feeUser" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Atribut" prop="attribute">
                                                    <el-checkbox-group v-model="forms.attribute" class="attribute-check">
                                                        <el-checkbox-button 
                                                            v-for="(dataAttr, Indexattr) in itemsDataAttribute" 
                                                            :key="Indexattr"
                                                            :label="dataAttr.id">{{dataAttr.key}} {{dataAttr.value}}</el-checkbox-button>
                                                    </el-checkbox-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Images" class="offline-hub">
                                                    <form ref="fileform" class="fileForm ">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img src="~assets/images/icons/image.png"></span>
                                                                <div class="text" style="margin-top: 5px;">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                <input id="product-images-change" type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
                                                            </div>
                                                            <div class="result-upload-img" v-if="formsType == 'create'">
                                                                <div class="file-listing">
                                                                    <div 
                                                                        class="images-many" 
                                                                        v-for="(dataImages, indexImages) in filesfake" 
                                                                        :id="'images-preview-result'+indexImages" 
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img src="~assets/images/icons/big-close.png"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="result-upload-img" v-else>
                                                                <div class="file-listing">
                                                                    <div 
                                                                        class="images-many" 
                                                                        v-for="(dataImages, indexImages) in filesEdit" 
                                                                        :id="'images-preview-result'+indexImages" 
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'edit-previews'+indexImages" :src="dataImages.url + dataImages.image"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" v-if="$dataRole['service.offlinehub.delete.item.image.delete.*']" @click.prevent="removeImages(indexImages, dataImages)" class="remove-images removedata"><img src="~assets/images/icons/big-close.png"></a>
                                                                    </div>
                                                                    <div 
                                                                        class="images-many" 
                                                                        v-for="(dataImages, indexImages) in filesfake" 
                                                                        :id="'images-preview-result'+indexImages" 
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" :src="dataImages.image" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img src="~assets/images/icons/big-close.png"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.offlinehub.delete.item.delete.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.offlinehub.post.item.update.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-if="$dataRole['service.offlinehub.post.item.create']" v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
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
import JQuery from 'jquery'

export default {
    name: 'offline-hub-barang-product',
    data(){
        var ValidateMinus = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('Inputan tidak boleh minus'));
            }
            callback();
        };
        return{
            apiUrl: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=item',
            sectionApiNew: 'offlinehub?servicePathUrl=item/dashboard',
            sectionApiProduct: 'offlinehub?servicePathUrl=product',
            sectionApiAttribute: 'offlinehub?servicePathUrl=attribute',
            sectionApiType: 'offlinehub?servicePathUrl=type',
            sectionApiProdusen: 'producer',
            loading: false,
            loadingProduct: false,
            loadingProdusen: false,
            loadingForm: false,
            loadingAttribute: false,
            loadingType: false,
            searchLoading: false,
            itemsData: [],
            itemsDataProduct: [],
            itemsDataProdusen: [],
            itemsDataAttribute: [],
            itemsDataType: [],
            itemDataDetail: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Item Produk Offline Hub',
            dataTextUpdate: 'Edit Item Produk Offline Hub',
            confirmDescDelete: 'Anda yakin akan menghapus data Barang dari daftar?',
            confirmTitleDelete: 'Hapus Barang',
            textDataCreate: 'Data Barang Berhasil ditambahkan.',
            textDataUpdate: 'Data Barang Berhasil diupdate.',
            textDataDelete: '1 Items Berhasil dihapus.',
            textImages: 'Maaf Images tidak boleh kosong',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                // status: 'active',
                productId: '',
                producerId: '',
                typeId: '',
                basePrice: '',
                feeMobayar: '',
                feeSpk: '',
                feeStore: '',
                feeUser: '',
                attribute: [],
                files: [],
                description: '',
            },
            filesfake: [],
            filesEdit: [],
            rules:{
                name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                status: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                productId: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                producerId: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                typeId: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                basePrice: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeMobayar: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeSpk: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeStore: [ { validator: ValidateMinus, trigger: 'blur' } ],
                feeUser: [ { validator: ValidateMinus, trigger: 'blur' } ],
                attribute: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ]
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false
            },
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
            filesEdit: '',
            uploadPercentage: 0,
            imageValue: '',
            imageOpen: false,
            filterbyType: '',
            filterSearchQuery: '',
            links: [],
        }
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.item.dashboard'])
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.getPostProduk()
        this.getPostProdusen()
        this.getPostAttribute()
        this.getPostType()
        this.initCreateFunction()
        this.dragInit()
        this.searchTypeInit()
        this.getTypeAll('')
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApiNew + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt&typeId=' + this.filterbyType
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
                    message: 'Gagal mendapatkan data Item Produk'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getPostProduk(){
            this.loadingProduct = true
            let url = this.urlService + this.sectionApiProduct + '&limit=100' + '&page=1&direction=DESC'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataProduct = response.data.data.rows
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data produk'
                });
            })
            .finally(() => {
                this.loadingProduct = false
            })
        },
        getPostProdusen(){
            this.loadingProdusen = true
            let url = this.apiUrl + this.sectionApiProdusen + '?limit=100' + "&page=1&direction=DESC"
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataProdusen = response.data.data
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data produsen'
                });
            })
            .finally(() => {
                this.loadingProdusen = false
            })
        },
        getPostAttribute(){
            this.loadingAttribute = true
            let url = this.urlService + this.sectionApiAttribute + '&limit=100' + '&page=1&direction=DESC'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataAttribute = response.data.data.rows
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data attribute'
                });
            })
            .finally(() => {
                this.loadingAttribute = false
            })
        },
        getPostType(){
            this.loadingType = true
            let url = this.urlService + this.sectionApiType + '&limit=100' + '&page=1&direction=DESC'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataType = response.data.data.rows
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data Tipe'
                });
            })
            .finally(() => {
                this.loadingType = false
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
                        this.$confirm('Apakah anda sudah yakin dengan data yang anda inputkan?', 'Perhatian!', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        }).then(() => {
                            if((this.forms.files).length !== 0){
                                let that = this
                                document.getElementById('save').children[0].innerHTML = loadingform
                                let urlv = this.urlService + this.sectionApi + '/create&multipart=true'
                                const formData = new FormData()
                                formData.append('name', this.forms.name)
                                // formData.append('status', this.forms.status)
                                formData.append('productId', this.forms.productId)
                                formData.append('producerId', this.forms.producerId)
                                formData.append('typeId', this.forms.typeId)
                                formData.append('basePrice', this.forms.basePrice)
                                formData.append('feeMobayar', this.forms.feeMobayar)
                                formData.append('feeSpk', this.forms.feeSpk)
                                formData.append('feeStore', this.forms.feeStore)
                                formData.append('feeUser', this.forms.feeUser)
                                formData.append('attribute', this.forms.attribute)
                                formData.append('description', this.forms.description)
                                if((this.forms.files).length == 1){
                                    formData.append('file', this.forms.files[0])
                                }else{
                                    this.forms.files.forEach(function(e, i){
                                        formData.append('file[]', that.forms.files[i])
                                    })
                                }
                                this.postFunction('post', formData, urlv)
                            }else{
                                this.messageerror = this.textImages
                            }
                        })
                    }else{
                        if((this.filesfake).length !== 0 || (this.filesEdit).length !== 0){
                            let that = this
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.urlService + this.sectionApi + '/update/' + this.itemDataDetail.id + '&multipart=true'
                            const formData = new FormData()
                            formData.append('name', this.forms.name)
                            formData.append('productId', this.forms.productId)
                            formData.append('producerId', this.forms.producerId)
                            formData.append('typeId', this.forms.typeId)
                            formData.append('basePrice', this.forms.basePrice)
                            formData.append('feeMobayar', this.forms.feeMobayar)
                            formData.append('feeSpk', this.forms.feeSpk)
                            formData.append('feeStore', this.forms.feeStore)
                            formData.append('feeUser', this.forms.feeUser)
                            formData.append('attribute', this.forms.attribute)
                            formData.append('description', this.forms.description)
                            if((this.forms.files).length == 1){
                                formData.append('file', this.forms.files[0])
                            }else{
                                this.forms.files.forEach(function(e, i){
                                    formData.append('file[]', that.forms.files[i])
                                })
                            }
                            this.postFunction('put', formData, urlv)
                        }else{
                            this.messageerror = this.textImages
                        }
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
                let url = this.urlService + this.sectionApi + '/delete/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.item.detail.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.urlService + this.sectionApi + '/detail/' + val.id
                    this.postFunction('getbyid', '', url)
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
            this.forms.productId = ''
            this.forms.producerId = ''
            this.forms.typeId = ''
            this.forms.basePrice = ''
            this.forms.feeMobayar = ''
            this.forms.feeSpk = ''
            this.forms.feeStore = ''
            this.forms.feeUser = ''
            this.forms.attribute = []
            this.forms.description = ''
            this.forms.files = []
            this.filesfake = []
            this.filesEdit = []
            document.getElementById("product-images-change").value = "";
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
                        this.messagesuccess = this.textDataCreate
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
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        }); 
                    }else{
                        this.messagesuccess = this.textDataUpdate
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
                this.filesEdit = []
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                        this.itemDataDetail = response.data.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.status = this.itemDataDetail.status
                        if(this.itemDataDetail.product){
                            this.forms.productId = this.itemDataDetail.product.id
                        }
                        if(this.itemDataDetail.producer){
                            this.forms.producerId = this.itemDataDetail.producer.user_id
                        }
                        if(this.itemDataDetail.type){
                            this.forms.typeId = this.itemDataDetail.type.id
                        }
                        this.forms.basePrice = this.itemDataDetail.base_price
                        this.forms.feeMobayar = this.itemDataDetail.fee_mobayar
                        this.forms.feeSpk = this.itemDataDetail.fee_spk
                        this.forms.feeStore = this.itemDataDetail.fee_store
                        this.forms.feeUser = this.itemDataDetail.fee_user
                        this.forms.description = this.itemDataDetail.description
                        this.itemDataDetail.attributes.forEach(function(e){
                            this.forms.attribute.push(e.attribute.id)
                        }, this)
                        if(this.itemDataDetail.images !== null){
                            this.itemDataDetail.images.forEach(function(e){
                                this.filesEdit.push(e)
                            }, this)
                        }
                    }
                })
                .catch(erro => {
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
                        message: 'Gagal menghapus data'
                    });
                })
                .finally(() => {
                    this.closeModal();
                    this.messagesuccess = this.textDataDelete
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        searchTypeInit(){
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
                        that.getTypeAll(textInput.value)
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
                this.filterbyType = ''
                this.getTypeAll('')
            }else{
                this.filterSearchQuery = user.title
                this.filterbyType = user.id
            }
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        getTypeAll(search){
            let userDataurl = this.urlService + this.sectionApiType + '&limit=10&page=1' + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt'
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
        },

        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            if((event.target.files).length !== 0){
                this.forms.files.push(event.target.files[0])
                this.filesfake.push(event.target.files[0])
                // this.filesEdit.push(event.target.files[0])
                // this.progressFirst = true
                this.move()
            }
        },
        getImagePreviews(){
            let that = this
            this.filesfake.forEach(function(value, index){
                // if(value.type !== undefined){
                    let reader = new FileReader();
                    reader.addEventListener("load", function(){
                        setTimeout(function(){
                            JQuery('#previews'+index).attr('src', reader.result)
                        }, 300)
                    });
                    reader.readAsDataURL( value );
                // }
            })
        },
        formatBytes(bytes,decimals) {
            if(bytes == 0) return '0 Bytes';
            var k = 1024,
                dm = decimals || 2,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        move() {
            let that = this
            this.progressShow = true
            this.doneProgress = false
            this.forms.files.forEach(function(value, index){
                setTimeout(function(){
                    let elem = JQuery(".myBar");
                    let width = 1;
                    let id = setInterval(frame, 10);
                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                            that.getImagePreviews()
                            that.progressShow = false
                            that.doneProgress = true
                        } else {
                            width++; 
                            elem.css('width', width + '%')
                        }
                    }
                }, 200)
            })
        },
        dragInit(){
            this.dragAndDropCapable = this.determineDragAndDropCapable();
            if( this.dragAndDropCapable ){
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                    this.$refs.fileform.addEventListener(evt, function(e){
                        if(evt == 'dragenter'){
                            document.querySelector('.fileForm').classList.add("dragging");
                        }
                        if(evt == 'drop'){
                            document.querySelector('.fileForm').classList.remove("dragging");
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this), false);
                }.bind(this));

                this.$refs.fileform.addEventListener('drop', function(e){
                    let dataImagesDrop = e.dataTransfer.files
                    for(var i = 0; i<dataImagesDrop.length;i++){
                        this.forms.files.push(e.dataTransfer.files[i])
                        this.filesfake.push(e.dataTransfer.files[i])
                        if((i+1) === dataImagesDrop.length){
                            this.move()
                        }
                    }
                }.bind(this));
            }
        },
        determineDragAndDropCapable(){
            var div = document.createElement('div');
            return ( ( 'draggable' in div )
                    || ( 'ondragstart' in div && 'ondrop' in div ) )
                    && 'FormData' in window
                    && 'FileReader' in window;
        },
        removeImages(index, value){
            let that = this
            document.getElementById("product-images-change").value = "";
            if(value == ''){
                this.filesfake.splice(index, 1)
                this.forms.files.splice(index, 1)
                this.getImagePreviews()
            }else{
                this.$confirm('Apakah anda yakin ingin menghapus images?', 'Hapus Images', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let url = this.urlService + this.sectionApi + '/image/delete/' + value.id
                    this.axios.delete(url)
                    .then(response => {
                        JQuery('#images-preview-result'+index).remove()
                        this.filesfake.splice(index, 1)
                        this.filesEdit.splice(index, 1)
                        this.getImagePreviews()
                    })
                })  
            }
        }
    },
    components: { pageHeader, loadingSvg, Money }
}
</script>
<style lang="scss" scoped>
.images-select{
    display:inline-block;
    vertical-align: middle;
    max-height: 30px;
    margin-right:5px;
    max-width: 30px;
    width: 100%;
    height: auto;
    // border: 1px solid #eee;
    // &.no-images{
    //     height: 100%;
    // }
}
.offline-hub{
    .result-upload-img{
        border-top: 1px solid #eee;
        margin-top: 3em;
    }
    .file-listing{
        text-align: left;
        padding: 15px;
    }
    .progressbar-content{
        margin-top: 0 !important;
        display: inline-block;
        width: 100%;
        height: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        vertical-align: top;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #eee;
        border-radius: 4px;
        background:#fafafa;
        .progressbar{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .images-many{
        display: inline-block;
        width: 15%;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
        .remove-images{
            position: absolute;
            top: -5px;
            right: -5px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        // .progressbar-content{
        //     display: none;
        // }
        &:last-child{
            margin-right: 0;
            // .progressbar-content{
            //     display: block;
            // }
        }
        img{
            max-width: 100% !important;
            max-height: 100% !important;
            margin-top: 0 !important;
            width: 91px;
            height: 91px;
            object-fit: cover;
        }
        span{
            margin-top: 5px;
            font-size: 12px !important;
        }
    }
}
</style>
