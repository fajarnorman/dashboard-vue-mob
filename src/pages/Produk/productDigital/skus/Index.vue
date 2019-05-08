<template>
    <div class="content-wrapper">
        <div id="sku">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Daftar SKU</h4>
                        <div class="add-actions float-right" v-if="$dataRole['sku.create']">
                            <a @click.prevent="Create" class="float-right">
                                <el-button class="button-white-green" round>
                                    <i class="icon-plus3"></i> Create
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
                        <div class="filterSearching clearfix">
                            <div class="input-with-icons clearfix">
                                <el-input v-model="searchQuery" class="float-left"></el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                            <div class="btn-group float-right">
                                <button type="button" class="el-button button-white-green el-button--default is-round dropdown-toggle" data-toggle="dropdown" aria-expanded="false">PDAM <i class="caretsku"></i></button>
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li class="dropdown-header highlight">Sepulsa</li>
                                    <li><a href="#" @click.prevent="pdamStatus('update')"><i class="icon-spinner10"></i> Update All Status</a></li>
                                    <li><a href="#" @click.prevent="pdamStatus('create')"><i class="icon-enlarge5"></i> Retrieve New List</a></li>
                                    <li class="divider"></li>
                                    <li><a href="#" @click.prevent="pdamStatus('all')"><i class="icon-magic-wand"></i> Do All</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="" v-if="itemsData">
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <div v-if="messagesuccessCustom !== ''">
                                <div role="alert" class="el-alert el-alert--success">
                                    <i class="el-alert__icon el-icon-success is-big"></i>
                                    <div class="el-alert__content">
                                        <p class="el-alert__description">
                                            {{messagesuccessCustom}}<br>
                                            Perubahan: <br><br>
                                            <b>Activated ({{pdamActivated.length}}) :</b> <span v-for="(dataActivated, indexActive) in pdamActivated" :key="indexActive">{{dataActivated}},</span><br>
                                            <b>Inactivated ({{pdamInactivated.length}}) :</b> <span v-for="(dataInActivated, indexInActive) in pdamInactivated" :key="indexInActive">{{dataInActivated}}</span><br>
                                            <b>Created ({{pdamCreated.length}}) :</b> <span v-for="(dataCreated, indexCreated) in pdamCreated" :key="indexCreated">{{dataCreated}}</span><br>
                                        </p>
                                        <i class="el-alert__closebtn el-icon-close" @click.prevent="messagesuccessCustom = ''"></i>
                                    </div>
                                </div>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                @selection-change="handleSelectionChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column type="index" label="No" width="45"></el-table-column>
                                <el-table-column prop="name" label="Nama" width="250"></el-table-column>
                                <el-table-column prop="code" label="Kode" width="120"></el-table-column>
                                <el-table-column label="Harga">
                                    <template slot-scope="scope">
                                        Rp.{{formatPrice(scope.row.price)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="supplier" label="Supplier"></el-table-column>
                                <el-table-column label="Status">
                                    <template slot-scope="scope">
                                        {{scope.row.status}}
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
                            <div class="after-checked-section">
                                <div class="page-container">
                                    <div class="page-content">
                                        <div class="sidebar-checked"></div>
                                        <div class="content-wrapper clearfix">
                                            <el-checkbox v-model="afterChecked">{{totalChecked}} akun terpilih</el-checkbox>
                                            <div class="float-right">
                                                <el-select v-model="changeStatus" placeholder="Select" @change="onChange">
                                                    <el-option label="Active" value="active">Active</el-option>
                                                    <el-option label="InActive" value="inactive">InActive</el-option>
                                                    <el-option label="Maintenance" value="maintenance">Maintenance</el-option>
                                                    <el-option label="Out of Stock" value="out_of_stock">Out of Stock</el-option>
                                                </el-select>
                                                <el-button v-if="$dataRole['sku.delete']" class="button-outline-red" round @click.prevent="deletePost('all','')">Hapus</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Detail, Edit, Create Forms -->
                            <div class="base-template-sidebar">
                                <!-- loading bar -->
                                <div class="el-loading-mask" v-show="(loadingForm == true)">
                                    <div class="el-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular">
                                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                        </svg>
                                    </div>
                                </div>

                                <div class="content">
                                    <header class="clearfix">
                                        <h4>{{titleForms}}</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <div v-show="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info SKU</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Kode" prop="code">
                                                                <el-input v-model="forms.code"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item  label="Deskripsi">
                                                                <el-input type="textarea" v-model="forms.deskripsi" :rows="5"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">InActive</el-radio>
                                                                    <el-radio label="maintenance">Maintenance</el-radio>
                                                                    <el-radio label="out_of_stock">Out of Stock</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Harga</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Amount" prop="amount">
                                                                <el-input-number type="number" v-model="forms.amount" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Price" prop="price">
                                                                 <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.price" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Base Price" prop="base_price">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.base_price" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Produk SKU</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="SKU Brand" prop="skubrand">
                                                                <el-select v-model="forms.skubrand" placeholder="Select">
                                                                    <el-option
                                                                        v-for="(dataskuBrand, indexskubrand) in itemskuBrand"
                                                                        :key="indexskubrand"
                                                                        :value="dataskuBrand.id"
                                                                        :label="dataskuBrand.name">{{dataskuBrand.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="SKU Category" prop="skucategory">
                                                                <el-select v-model="skuCat" placeholder="Select" class="skuCategorySelect">
                                                                    <el-option
                                                                        v-for="(dataskuCat, indexskuCat) in itemskuCategory"
                                                                        :key="indexskuCat"
                                                                        :value="dataskuCat.id"
                                                                        :label="dataskuCat.name">{{dataskuCat.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Adm Fee" prop="adm_fee">
                                                                <el-input-number type="number" v-model="forms.adm_fee" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Komisi">
                                                                <el-input v-model="forms.commission"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item  label="Supplier">
                                                                <el-select v-model="forms.supplier" placeholder="Select">
                                                                    <el-option 
                                                                        v-for="(dataFilterSup, indexSup) in $dataSupplier"
                                                                        :key="indexSup"
                                                                        :value="(dataFilterSup).toUpperCase()"
                                                                        :label="(dataFilterSup).toUpperCase()">{{(dataFilterSup).toUpperCase()}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <!-- <el-col :span="12">
                                                            <el-form-item label="Type" prop="type">
                                                                <el-input v-model="forms.type"></el-input>
                                                            </el-form-item>
                                                        </el-col> -->
                                                        <el-col :span="12">
                                                            <el-form-item label="Delay Minute">
                                                                <el-input type="number" v-model="forms.delay_minute"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24" v-if="$getRoles == 1">
                                                            <el-form-item label="Supplier Url" prop="supplier_url">
                                                                <el-input v-model="forms.supplier_url"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Inquiry</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Inquiry Kode">
                                                                <el-input v-model="forms.inquiry_code"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Operator Kode (untuk PDAM)">
                                                                <el-input v-model="forms.operator_code"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24" v-if="$getRoles == 1">
                                                            <el-form-item label="Supplier Inquiry Url">
                                                                <el-input v-model="forms.supplier_inq_url"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="$dataRole['sku.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['sku.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
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
        name: 'sku',
        components: {Money},
        data () {
            var validatePrice = (rule, value, callback) => {
                var PriceString = this.forms.price
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (PriceString.toString().length > 11) {
                        callback(new Error('Harga yang anda masukkan terlalu besar'));
                    }
                    callback();
                }
            };
            var validateBasePrice = (rule, value, callback) => {
                var BasePriceString = this.forms.base_price
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (BasePriceString.toString().length > 11) {
                        callback(new Error('Base Harga yang anda masukkan terlalu besar'));
                    }
                    callback();
                }
            };
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (/^[a-zA-Z0-9- ,_]*$/.test( this.forms.code ) == false) {
                        callback(new Error('Kode tidak boleh ada symbol'));
                    }
                    callback();
                }
            };
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'skus',
                sectionApiskuBrand: 'skuBrand',
                sectionapiskuCategory: 'skuCategory',
                sectionApiBulkUpdate: 'bulkUpdateStatus',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemskuBrand: [],
                itemskuCategory: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                dismissSecs: 5,
                dismissCountDown: 0,
                dataModalName: '',
                dataModalSupplier: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                changeStatus: '',
                changeStatusbyOne: [],
                statusSKU: [
                    { name: 'Active', value: 'active', },
                    { name: 'Inactive', value: 'inactive', },
                    { name: 'Maintenance', value: 'maintenance', },
                    { name: 'Out of Stock', value: 'out_of_stock', },
                ],

                 // message variable
                messageerror: '',
                messagesuccess: '',
                messagesuccessCustom: '',

                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false /* doesn't work with directive */
                },

                // for create, detail, edit forms and validation
                skuCat: '',
                forms:{
                    code: '',
                    name: '',
                    status: 'active',
                    supplier: '',
                    amount: '',
                    price: 0,
                    base_price: 0,
                    adm_fee: '',
                    commission: '',
                    skubrand: '',
                    skucategory: '',
                    deskripsi: '',
                    inquiry_code: '',
                    operator_code: '',
                    type: '',
                    delay_minute: 0,
                    supplier_url: '',
                    supplier_inq_url: '',
                },
                rules2:{
                    code: [ { required: true, validator: validateCode, trigger: 'blur' } ],
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    deskripsi: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    amount: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    price: [ { required: true, validator: validatePrice, trigger: 'blur' } ],
                    base_price: [ { required: true, validator: validateBasePrice, trigger: 'blur' } ],
                    adm_fee: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    skubrand: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    skucategory: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    supplier: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // supplier_url: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // supplier_inq_url: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                },

                // for error counting
                countErrorPost: 0,
                countErrorGetSkuBrand: 0,
                countErrorGetSkuCategory: 0,

                pdamActivated: [],
                pdamInactivated: [],
                pdamCreated: [],
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['sku.list'])
        },
        mounted () {
            // let that = this
            // setTimeout(function(){
            //     console.log(that.$dataTest)
            // }, 2000)
            this.getPosts(this.perPage, this.currentPage, '')
            this.getPostSkuBrand()
            this.getPostSkuCategory()

            JQuery(".el-input-number .el-input__inner").bind({
                keydown: function(e) {
                    if (e.shiftKey === true ) {
                        if (e.which == 9) {
                            return true;
                        }
                        return false;
                    }
                    if (e.which > 57) {
                        return false;
                    }
                    if (e.which==32) {
                        return false;
                    }
                    return true;
                }
            });
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            skuCat: function(newValue){
                let textValue
                let that = this
                setTimeout(function(){
                    // textValue = document.querySelector('.skuCategorySelect .el-input input').value
                    that.forms.skucategory = newValue
                    if(newValue == 11){
                        that.forms.type = 'pgn'
                    }else if(newValue == 10){
                        that.forms.type = 'gamevoucher'
                    }else if(newValue == 9){
                        that.forms.type = 'multifinance'
                    }else if(newValue == 7){
                        that.forms.type = 'mobilepost'
                    }else if(newValue == 8){
                        that.forms.type = 'telkom'
                    }else if(newValue == 5){
                        that.forms.type = 'bpjskes'
                    }else if(newValue == 6){
                        that.forms.type = 'pdam'
                    }else if(newValue == 4){
                        that.forms.type = 'plnpost'
                    }else if(newValue == 1){
                        that.forms.type = 'pulsa'
                    }else if(newValue == 2){
                        that.forms.type = 'data'
                    }else if(newValue == 3){
                        that.forms.type = 'plnpre'
                    }
                }, 200)
            }
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC&order=code'
            },
            getPosts(num, pg, sch){
                let url = this.buildUrl(num, pg, sch)
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

                        // this.itemsData.forEach(function(element){
                        //     console.log(element.status)
                        //     this.changeStatusbyOne.push(element.status)
                        // }, this)
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, '')
                    }
                })
                .finally(() => this.loading = false)
            },
            getPostSkuBrand(){
                let url = this.apiURL + this.sectionApiskuBrand
                this.axios.get(url)
                .then(response => {
                    this.itemskuBrand = response.data.data
                })
                .catch(error => { 
                    this.countErrorGetSkuBrand++
                    if(this.countErrorGetSkuBrand >= 3){
                        this.errored = true
                    }else{
                        this.getPostSkuBrand()
                    }
                })
                .finally(() => this.loading = false)
            },
            getPostSkuCategory(){
                let url = this.apiURL + this.sectionapiskuCategory
                this.axios.get(url)
                .then(response => {
                    this.itemskuCategory = response.data.data
                })
                .catch(error => { 
                    this.countErrorGetSkuCategory++
                    if(this.countErrorGetSkuCategory >= 3){
                        this.errored = true
                    }else{
                        this.getPostSkuCategory()
                    }
                })
                .finally(() => this.loading = false)
            },
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerror = ''
                this.messagesuccess = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi

                            let dataForms

                            if(this.$getRoles == 1){
                                dataForms = {
                                    code: this.forms.code,
                                    name: this.forms.name,
                                    description: this.forms.deskripsi,
                                    status: this.forms.status,
                                    amount: this.forms.amount,
                                    price: this.forms.price,
                                    base_price: this.forms.base_price,
                                    skubrand: this.forms.skubrand,
                                    skucategory: this.forms.skucategory,
                                    adm_fee: this.forms.adm_fee,
                                    commission: this.forms.commission,
                                    supplier: this.forms.supplier,
                                    inquiry_code: this.forms.inquiry_code,
                                    operator_code: this.forms.operator_code,
                                    type: this.forms.type,
                                    delay_minute: this.forms.delay_minute,
                                    supplier_url: this.forms.supplier_url,
                                    supplier_inquiry_url: this.forms.supplier_inq_url    
                                }
                            }else{
                                dataForms = {
                                    code: this.forms.code,
                                    name: this.forms.name,
                                    description: this.forms.deskripsi,
                                    status: this.forms.status,
                                    amount: this.forms.amount,
                                    price: this.forms.price,
                                    base_price: this.forms.base_price,
                                    skubrand: this.forms.skubrand,
                                    skucategory: this.forms.skucategory,
                                    adm_fee: this.forms.adm_fee,
                                    commission: this.forms.commission,
                                    supplier: this.forms.supplier,
                                    inquiry_code: this.forms.inquiry_code,
                                    operator_code: this.forms.operator_code,
                                    type: this.forms.type,
                                    delay_minute: this.forms.delay_minute
                                }
                            }

                            this.axios.post(urlv, dataForms)
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.name + " Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // 
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id

                            let dataForms

                            if(this.$getRoles == 1){
                                dataForms = {
                                    code: this.forms.code,
                                    name: this.forms.name,
                                    description: this.forms.deskripsi,
                                    status: this.forms.status,
                                    amount: this.forms.amount,
                                    price: this.forms.price,
                                    base_price: this.forms.base_price,
                                    skubrand: this.forms.skubrand,
                                    skucategory: this.forms.skucategory,
                                    adm_fee: this.forms.adm_fee,
                                    commission: this.forms.commission,
                                    supplier: this.forms.supplier,
                                    inquiry_code: this.forms.inquiry_code,
                                    operator_code: this.forms.operator_code,
                                    type: this.forms.type,
                                    delay_minute: this.forms.delay_minute,
                                    supplier_url: this.forms.supplier_url,
                                    supplier_inquiry_url: this.forms.supplier_inq_url    
                                }
                            }else{
                                dataForms = {
                                    code: this.forms.code,
                                    name: this.forms.name,
                                    description: this.forms.deskripsi,
                                    status: this.forms.status,
                                    amount: this.forms.amount,
                                    price: this.forms.price,
                                    base_price: this.forms.base_price,
                                    skubrand: this.forms.skubrand,
                                    skucategory: this.forms.skucategory,
                                    adm_fee: this.forms.adm_fee,
                                    commission: this.forms.commission,
                                    supplier: this.forms.supplier,
                                    inquiry_code: this.forms.inquiry_code,
                                    operator_code: this.forms.operator_code,
                                    type: this.forms.type,
                                    delay_minute: this.forms.delay_minute
                                }
                            }

                            this.axios.put(urlv, dataForms)
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.name + " Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // 
                            })
                        }
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    if(id.length <= 5){
                        this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' dari daftar?', 'Hapus SKU', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        }).then(() => {
                            this.loading = true
                            for(let i = 0; i< id.length; i++){
                                let url = this.apiURL + this.sectionApi + '/' + id[i].id
                                this.axios.delete(url)
                                .then(response => {
                                    this.getPosts(this.perPage, this.currentPage, '')
                                })
                                .catch(error => { 
                                    console.log(error);
                                })
                                .finally(() => {
                                    document.querySelector('.after-checked-section').classList.remove('active')
                                    this.messagesuccess = id.length + " Items Berhasil dihapus."
                                })
                            }
                        })
                    }else{
                        this.$notify({
                            title: 'Maaf',
                            message: 'Untuk fitur ini sementara kita batasi hanya 5 list',
                            type: 'warning'
                        });
                    }
                }else if(type == 'once'){
                    this.$confirm('Apakah anda yakin akan menghapus item dari daftar?', 'Hapus SKU', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, '')
                        })
                        .catch(error => { 
                            console.log(error);
                        })
                        .finally(() => {
                            this.closeModal();
                            this.messagesuccess = "1 Items Berhasil dihapus."
                        })
                    })
                }
            },
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                this.loading = true
            },
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },
            getResult: _.debounce(function(){
                let vm = this
                let searchUrl = this.buildUrl(this.perPage, '', this.searchQuery)
                this.loading = true
                this.axios.get(searchUrl)
                .then(function (response) {
                    vm.itemsData = response.data.data
                    vm.totalPage = response.data.totalData
                })
                .catch(function (error) {
                    console.log(error);
                    vm.errored = true
                }).finally(() => this.loading = false)
            }, 800),
            onChange(name, supplier, id, num){
                this.$confirm('Apakah anda yakin akan mengubah status secara bersamaan?', 'Mengubah Status SKU', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let valueStatus = this.changeStatus
                    const formData = new FormData()
                    formData.append('status', valueStatus)
                    this.itemiDforDelete.forEach(function(e){
                        formData.append('ids[]', e.id)
                    })
                    this.loading = true
                    let url = this.apiURL + this.sectionApi + '/' + this.sectionApiBulkUpdate
                    this.axios.post(url, formData)
                    .then(response => {
                        this.getPosts(this.perPage, this.currentPage, '')
                    })
                    .catch(error => { 
                        console.log(error);
                        this.$notify.error({
                            title: 'Error',
                            message: 'Jaringan Bermasalah'
                        });
                    })
                    .finally(() => {
                        document.querySelector('.after-checked-section').classList.remove('active')
                        this.messagesuccess =  this.itemiDforDelete.length + " Items Berhasil di rubah."
                    })
                }).catch(() => {
                    this.getPosts(this.perPage, this.currentPage, '')
                })
            },
            handleSelectionChange(val) {
                if(val.length != 0){
                    document.querySelector('.after-checked-section').classList.add('active')
                }else{
                    document.querySelector('.after-checked-section').classList.remove('active')
                }
                this.multipleSelection = val
                this.totalChecked = val.length
                this.itemiDforDelete = val
            },
            handleCurrentChange(val){
                if(this.$dataRole['sku.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true
                        this.messageerror = ''
                        this.messagesuccess = ''
                        let url = this.apiURL + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = 'Edit SKU - ' + this.itemDataDetail.name

                            this.forms.code = this.itemDataDetail.code
                            this.forms.name = this.itemDataDetail.name
                            this.forms.status = this.itemDataDetail.status
                            this.forms.supplier = this.itemDataDetail.supplier

                            this.forms.amount = this.itemDataDetail.amount
                            this.forms.price = (this.itemDataDetail.price).slice(0, -3)
                            this.forms.base_price = (this.itemDataDetail.base_price).slice(0, -3)

                            this.forms.adm_fee = this.itemDataDetail.adm_fee
                            this.forms.commission = this.itemDataDetail.commission
                            this.forms.skubrand = this.itemDataDetail.brand_id
                            this.skuCat = this.itemDataDetail.category_id
                            this.forms.skucategory = this.itemDataDetail.category_id
                            this.forms.deskripsi = this.itemDataDetail.description

                            this.forms.inquiry_code = this.itemDataDetail.inquiry_code
                            this.forms.operator_code = this.itemDataDetail.operator_code
                            this.forms.type = this.itemDataDetail.type
                            this.forms.delay_minute = this.itemDataDetail.delay_minute
                            this.forms.supplier_url = this.itemDataDetail.supplier_url
                            this.forms.supplier_inq_url = this.itemDataDetail.supplier_inquiry_url
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.loadingForm = false
                        })
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
                this.messageerror = ''
                this.messagesuccess = ''

                this.forms.code = ''
                this.forms.name = ''
                this.forms.status = 'active'
                this.forms.supplier = ''
                this.forms.amount = ''
                this.forms.price = ''
                this.forms.base_price = ''
                this.forms.adm_fee = ''
                this.forms.skubrand = ''
                this.forms.skucategory = ''
                this.forms.deskripsi = ''
                this.forms.inquiry_code = ''
                this.forms.operator_code = ''
                this.forms.type = ''
                this.forms.delay_minute = 0
                this.forms.supplier_url = ''
                this.forms.supplier_inq_url = ''
                this.skuCat = ''
                this.forms.commission = ''
            },
            Create(){
                this.titleForms = "SKU Baru"
                this.formsType = 'create'
                this.messageerror = ''
                this.messagesuccess = ''
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },
            pdamStatus(value){
                this.messagesuccessCustom = ''
                this.loading = true
                let url = this.apiURL + this.sectionApi + '/getSepulsaPdamSkus?action=' + value
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.pdamActivated = response.data.data.activated
                        this.pdamInactivated = response.data.data.inactivated
                        this.pdamCreated = response.data.data.created
                        this.messagesuccessCustom = response.data.message
                    }
                })
                .finally(() => {
                    this.loading = false
                })
            }
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy(){
            this.itemsData = []
            this.itemDataDetail = []
            this.itemiDforDelete = []
            this.itemskuBrand = []
            this.itemskuCategory = []
            this.itemiDforDelete = []
            this.changeStatusbyOne = []
            this.statusSKU = []
            this.money = {}
            this.forms = {}
            this.rules2 = {}
            this.searchQuery = ''
            this.totalPage = ''
            this.dataModalName = ''
            this.dataModalSupplier = ''
            this.totalChecked = ''
            this.titleForms = ''
            this.formsType = ''
            this.changeStatus = ''
        }
    }
</script>