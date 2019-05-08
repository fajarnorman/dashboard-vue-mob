<template>
    <div class="content-wrapper">
        <div id="kode-promo">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Kode Promo</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['promotion.create']">
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
                                @current-change="handleCurrentChange"
                                @selection-change="handleSelectionChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55" v-if="$dataRole['promotion.delete']"></el-table-column>
                                <el-table-column prop="name" label="Nama"></el-table-column>
                                <el-table-column prop="promo_code" label="Kode Promo"></el-table-column>
                                <el-table-column prop="start_date" label="Tanggal Mulai">
                                    <template slot-scope="scope">
                                        {{scope.row.start_date | moment("DD MMMM YYYY")}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="end_date" label="Tanggal Berakhir">
                                    <template slot-scope="scope">
                                        {{scope.row.end_date | moment("DD MMMM YYYY")}}
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
                                                <el-button class="button-outline-red" round @click.prevent="deletePost('all', '')">Hapus</el-button>
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
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama Promo" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Deskripsi">
                                                                <el-input type="textarea" :rows="5" v-model="forms.description"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Kode Promo" prop="code_promo">
                                                                <el-input v-model="forms.code_promo"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Promo Dimulai" prop="dateStart">
                                                                <div class="datepicker-content">
                                                                    <el-date-picker 
                                                                        :format="format" 
                                                                        v-model="forms.dateStart" 
                                                                        :value-format="format"
                                                                        type="date"
                                                                        class="datepicker"></el-date-picker>
                                                                    <el-time-picker 
                                                                        v-model="forms.timeStart"
                                                                        :format="formatTime"
                                                                        :value-format="formatTime"
                                                                        class="timepicker">
                                                                    </el-time-picker>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Promo Berakhir" prop="dateEnd">
                                                                <div class="datepicker-content">
                                                                    <el-date-picker 
                                                                        :format="format" 
                                                                        v-model="forms.dateEnd" 
                                                                        :value-format="format"
                                                                        type="date"
                                                                        class="datepicker"></el-date-picker>
                                                                    <el-time-picker 
                                                                        v-model="forms.timeEnd"
                                                                        :format="formatTime"
                                                                        :value-format="formatTime"
                                                                        class="timepicker">
                                                                    </el-time-picker>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Tipe Diskon">
                                                                <el-radio-group v-model="forms.type_discount">
                                                                    <el-radio label="percentage">PERCENTAGE</el-radio>
                                                                    <el-radio label="fixed">FIXED</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Diskon (tanpa %)" prop="discount" v-if="forms.type_discount == 'fixed'">
                                                                <el-input-number v-model="forms.discount" :min="0"></el-input-number>
                                                            </el-form-item>
                                                            <el-form-item label="Diskon (tanpa %)" prop="discount" v-else>
                                                                <el-input-number v-model="forms.discount" :min="0" :max="100"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limitasi Diskon" v-if="forms.type_discount == 'fixed'">
                                                                <el-input-number v-model="forms.limitasi" :min="0"></el-input-number>
                                                            </el-form-item>
                                                            <el-form-item label="Limitasi Diskon" v-else>
                                                                <el-input-number v-model="forms.limitasi" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penggunaan Tiap User">
                                                                <el-input-number v-model="forms.limitasi_user" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penggunaan Promo">
                                                                <el-input-number v-model="forms.limitasi_promo" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Minimum Transaksi" prop="minimum_transaction">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.minimum_transaction" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Minimal User Register" prop="dateMinimalRegister">
                                                                <el-date-picker v-model="forms.dateMinimalRegister" type="date"></el-date-picker>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Jenis Barang Promo" prop="status">
                                                                <el-radio-group v-model="forms.type_product">
                                                                    <el-radio label="digital">DIGITAL</el-radio>
                                                                    <el-radio label="ecommerce">ECOMMERCE</el-radio>
                                                                    <el-radio label="topup">TOPUP</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24" v-if="(forms.type_product == 'digital')">
                                                            <el-form-item label="Pilih Produk Digital">
                                                                <el-checkbox-group v-model="forms.sku_category_list" class="attribute-check">
                                                                    <el-checkbox-button 
                                                                        v-for="(dataCat, IndexCat) in itemSkuCategory" 
                                                                        :key="IndexCat"
                                                                        :label="dataCat.id">{{dataCat.name}}</el-checkbox-button>
                                                                </el-checkbox-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['promotion.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.promotion.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['promotion.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
        name: 'kode-promo',
        components: {Money},
        data () {
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (/^[a-zA-Z0-9- ,_]*$/.test( this.forms.code_promo ) == false) {
                        callback(new Error('Kode tidak boleh ada symbol'));
                    }
                    callback();
                }
            };
            var validateDateStart = (rule, value, callback) => {
                let dateStartValue = new Date(this.forms.dateStart).getTime()
                let dateEndValue = new Date(this.forms.dateEnd).getTime()
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (dateStartValue > dateEndValue) {
                        callback(new Error('Tanggal promo dimulai tidak boleh lebih dari tanggal promo berakhir'));
                    }
                    callback();
                }
            };
            var validateDateEnd = (rule, value, callback) => {
                let dateStartValue = new Date(this.forms.dateStart).getTime()
                let dateEndValue = new Date(this.forms.dateEnd).getTime()
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (dateStartValue > dateEndValue) {
                        callback(new Error('Tanggal promo berakhir tidak boleh kurang dari tanggal promo dimulai'));
                    }
                    callback();
                }
            };
            var validateMinimunTransaction = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    console.log(value)
                    if (value < 0 ) {
                        callback(new Error('Inputan tidak boleh minus'));
                    }
                    callback();
                }
            };
            var validateDiscount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (this.forms.type_discount == 'percentage') {
                        if(value > 100){
                            callback(new Error('Diskon tidak boleh lebih dari 100'));
                        }
                    }
                    callback();
                }
            };
            var validateDiscountLimit = (rule, value, callback) => {
                if (this.forms.type_discount == 'percentage') {
                    if(value > 100){
                        callback(new Error('Limit Diskon tidak boleh lebih dari 100'));
                    }
                }
                callback();
            };
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'promotion',
                sectionapiskuCategory: 'skuCategory',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemSkuCategory: [],

                // another important variable data
                searchQuery: '',
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
                forms:{
                    name: '',
                    description: '',
                    code_promo: '',
                    dateStart: '',
                    timeStart: '',
                    dateEnd: '',
                    timeEnd: '',
                    type_discount: 'percentage',
                    discount: '',
                    limitasi: '',
                    limitasi_user: '',
                    limitasi_promo: '',
                    minimum_transaction: '',
                    dateMinimalRegister: '',
                    type_product: 'digital',
                    sku_category_list: [],
                },
                rules2:{
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    code_promo: [ { required: true, validator: validateCode, trigger: 'blur' } ],
                    dateStart: [ { required: true, validator: validateDateStart, trigger: 'blur' } ],
                    dateEnd: [ { required: true, validator: validateDateEnd, trigger: 'blur' } ],
                    discount: [ { required: true, validator: validateDiscount, trigger: 'blur' } ],
                    limitasi: [ { validator: validateDiscountLimit, trigger: 'blur' } ],
                    dateMinimalRegister: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    minimum_transaction: [ { required: true, validator: validateMinimunTransaction, trigger: 'blur' } ]
                },
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['promotion.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')
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
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
            },

            // Get All Post
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },

            // Get Sku Category
            getPostSkuCategory(){
                let url = this.apiUrl + this.sectionapiskuCategory
                this.axios.get(url)
                .then(response => {
                    this.itemSkuCategory = response.data.data
                })
                .catch(error => { 
                    this.errored = true
                })
            },

            // Limit Change function
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

            // Get Result data from searchbar
            getResult: _.debounce(function(){
               this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 300),

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' kode promo dari daftar?', 'Hapus Kode Promo', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiUrl + this.sectionApi + '/' + id[i].id
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
                }else if(type == 'once'){
                    this.$confirm('Apakah anda yakin akan menghapus kode promo dari daftar?', 'Hapus Kode Promo', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
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

            // function for checkbox multipe select
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

            // function for table click for edit and detail
            handleCurrentChange(val){
                this.messageerror = ''
                this.messagesuccess = ''
                this.forms.sku_category_list = []
                if(this.$dataRole['promotion.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true
                        let url = this.apiUrl + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = 'Ubah Kode Promo'

                            this.forms.name = this.itemDataDetail.promotion.name
                            this.forms.description = this.itemDataDetail.promotion.description
                            this.forms.code_promo = this.itemDataDetail.promotion.promo_code

                            this.forms.dateStart = FUNCTIONS.formatDate(this.itemDataDetail.promotion.start_date)
                            this.forms.timeStart = FUNCTIONS.formatTime(this.itemDataDetail.promotion.start_date)

                            this.forms.dateEnd = FUNCTIONS.formatDate(this.itemDataDetail.promotion.end_date)
                            this.forms.timeEnd = FUNCTIONS.formatTime(this.itemDataDetail.promotion.end_date)

                            this.forms.type_discount = this.itemDataDetail.promotion.discount_type
                            this.forms.discount = this.itemDataDetail.promotion.discount_value
                            this.forms.limitasi = this.itemDataDetail.promotion.discount_limit
                            this.forms.limitasi_user = this.itemDataDetail.promotion.usage_limit_per_user
                            this.forms.limitasi_promo = this.itemDataDetail.promotion.usage_limit
                            this.forms.minimum_transaction = (this.itemDataDetail.promotion.minimum_transaction).slice(0, -3)
                            this.forms.dateMinimalRegister = this.itemDataDetail.promotion.user_join_date
                            this.forms.type_product = this.itemDataDetail.promotion.type
                            
                            this.itemDataDetail.promotionProducts.forEach(function(element){
                                let id = parseInt(element.sku_category_id)
                                this.forms.sku_category_list.push(id)
                            }, this)
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

            // Create Forms function
            Create(){
                this.titleForms = "Kode Promo Baru"
                this.formsType = 'create'
                this.forms.name = ''
                this.forms.description = ''
                this.forms.code_promo = ''
                this.forms.dateStart = ''
                this.forms.timeStart = '00:00'
                this.forms.dateEnd = ''
                this.forms.timeEnd = '23:59'
                // this.forms.type_discount = ''
                this.forms.discount = ''
                this.forms.limitasi = ''
                this.forms.limitasi_user = ''
                this.forms.limitasi_promo = ''
                this.forms.minimum_transaction = ''
                this.forms.dateMinimalRegister = ''
                // this.forms.type_product = ''
                this.forms.sku_category_list = []

                this.messageerror = ''
                this.messagesuccess = ''

                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
                this.messageerror = ''
                this.messagesuccess = ''
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            let startHour = (this.forms.timeStart).substring(0, 2)
                            let startMinute = (this.forms.timeStart).substring(3, 5)
                            let endHour = (this.forms.timeEnd).substring(0, 2)
                            let endMinute = (this.forms.timeEnd).substring(3, 5)
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                promo_code: this.forms.code_promo,
                                start_date: this.forms.dateStart, 
                                end_date: this.forms.dateEnd,
                                discount_type: this.forms.type_discount,
                                discount_value: this.forms.discount,
                                type: this.forms.type_product,
                                description: this.forms.description,
                                start_hour: startHour,
                                start_minute: startMinute,
                                end_hour: endHour,
                                end_minute: endMinute,
                                user_join_date: this.forms.dateMinimalRegister,
                                discount_limit: this.forms.limitasi,
                                usage_limit_per_user: this.forms.limitasi_user,
                                usage_limit: this.forms.limitasi_promo,
                                minimum_transaction: this.forms.minimum_transaction,
                                sku_category: this.forms.sku_category_list
                            })
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
                                console.log(error)
                            })
                        }else{
                            let startHour = (this.forms.timeStart).substring(0, 2)
                            let startMinute = (this.forms.timeStart).substring(3, 5)
                            let endHour = (this.forms.timeEnd).substring(0, 2)
                            let endMinute = (this.forms.timeEnd).substring(3, 5)
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.promotion.id

                            this.axios.put(urlv, {
                                name: this.forms.name,
                                promo_code: this.forms.code_promo,
                                start_date: this.forms.dateStart, 
                                end_date: this.forms.dateEnd,
                                discount_type: this.forms.type_discount,
                                discount_value: this.forms.discount,
                                type: this.forms.type_product,
                                description: this.forms.description,
                                start_hour: startHour,
                                start_minute: startMinute,
                                end_hour: endHour,
                                end_minute: endMinute,
                                user_join_date: this.forms.dateMinimalRegister,
                                discount_limit: this.forms.limitasi,
                                usage_limit_per_user: this.forms.limitasi_user,
                                usage_limit: this.forms.limitasi_promo,
                                minimum_transaction: this.forms.minimum_transaction,
                                sku_category: this.forms.sku_category_list
                            })
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
                                // console.log(error);
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
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
        }
    }
</script>
