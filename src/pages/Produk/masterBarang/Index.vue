<template>
    <div class="content-wrapper">
        <div id="master-barang">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Barang</h4>
                        <div class="add-actions float-right" v-if="$dataRole['item.create']">
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['item.delete']"></el-table-column>
                                <el-table-column type="index" label="No." width="55"></el-table-column>
                                <el-table-column prop="display_name" label="Nama"></el-table-column>
                                <el-table-column prop="item_code" label="Kode"></el-table-column>
                                <el-table-column label="Harga">
                                    <template slot-scope="scope">
                                        Rp.{{formatPrice(scope.row.price)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="updated_at" label="Last Update"></el-table-column>
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
                                                <el-button class="button-outline-red" round @click.prevent="deletePost('all','')">Hapus</el-button>
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
                                                <h5>Info Barang</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama Barang" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Produk" prop="produkget">
                                                                <div class="input-with-icons" @click="dialogVisible = true">
                                                                    <el-input v-model="forms.produkget" @focus="dialogVisible = true" @blur="dialogVisible = true"></el-input>
                                                                    <img src="~assets/images/icons/icon-dots.png">
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Harga" prop="price">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.price" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kode" prop="code">
                                                                <el-input v-model="forms.code"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="Active">Active</el-radio>
                                                                    <el-radio label="Inactive">Inactive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Atribut" prop="attribute">
                                                                <el-checkbox-group v-model="forms.attribute" class="attribute-check">
                                                                    <el-checkbox-button 
                                                                        v-for="(dataAttr, Indexattr) in itemAttribute" 
                                                                        :key="Indexattr"
                                                                        :label="dataAttr.id">{{dataAttr.key}} {{dataAttr.value}}</el-checkbox-button>
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
                                    <el-button v-if="$dataRole['item.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['item.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                                </div>
                            </div>
                            <el-dialog 
                                title="Pilih Produk"
                                :visible.sync="dialogVisible" 
                                width="30%"
                                class="mb-dialog nopadding-right">
                                <div class="forms-search-attr">
                                    <div class="input-with-icons clearfix">
                                        <el-input v-model="searchProduk" class="float-left" placeholder="Cari produk..."></el-input>
                                        <img src='~assets/images/icons/search1.png'>
                                    </div>
                                </div>
                                <div class="content-dialog">
                                    <div class="el-loading-mask" v-show="(loadingProduk == true)">
                                        <div class="el-loading-spinner">
                                            <svg viewBox="25 25 50 50" class="circular">
                                                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="item-list" v-for="(dataProduk, indexProduk) in itemProduct" :key="indexProduk">
                                        <el-radio v-model="contentProduk" :label="dataProduk.id">{{dataProduk.name}}</el-radio>
                                    </div>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button round class="cancel button-outline-black" @click="dialogVisible = false">Cancel</el-button>
                                    <el-button round class="choose button-white-green" type="primary" @click="ChooseProduk">Pilih</el-button>
                                </span>
                            </el-dialog>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {Money} from 'v-money'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'MS_Attribut',
        components: {Money},
        data () {
            var validateAttribute = (rule, value, callback) => {
                if (this.forms.attribute.length == 0) {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (this.forms.attribute.length > 1) {
                        callback(new Error('Inputan tidak boleh lebih dari satu'));
                    }
                    callback();
                }
            };
            var validatePrice = (rule, value, callback) => {
                var PriceString = this.forms.price
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else if(value === 0){
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (PriceString.toString().length > 11) {
                        callback(new Error('Harga yang anda masukkan terlalu besar'));
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
                sectionApi: 'item',
                sectionApiProduk: 'product',
                sectionApiAtribut: 'attribute',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemProduct: [],
                itemAttribute: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingProduk: false,
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
                dialogVisible: false,
                searchProduk: '',
                contentProduk: '',

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
                    produkget: '',
                    produkId: '',
                    status: 'Active',
                    price: '',
                    code: '',
                    attribute: [],
                },
                rules2:{
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    produkget: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    price: [ { required: true, validator: validatePrice, trigger: 'blur' } ],
                    code: [ { required: true, validator: validateCode, trigger: 'blur' } ],
                    attribute: [ { required: true, validator: validateAttribute, trigger: 'blur' } ]
                },

                // for error counting
                countErrorPost: 0,
                countErrorGetProduct: 0,
                countErrorGetAttribute: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['item.list'])
        },
        mounted () {
            this.getProduct()
            this.getAttribute()
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            searchProduk: function(){
                this.getResultProduk()
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
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
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, '')
                    }
                })
                .finally(() => this.loading = false)
            },

            // Get All Post Category
            getProduct(){
                let url = this.apiURL + this.sectionApiProduk + '?order=name&direction=ASC'
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemProduct = response.data.data
                    }
                })
                .catch(error => { 
                    this.countErrorGetProduct++
                    if(this.countErrorGetProduct >= 3){
                        this.errored = true
                    }else{
                        this.getProduct()
                    }
                })
                .finally(() => this.loading = false)
            },

            // Get All Post Attribute
            getAttribute(){
                let url = this.apiURL + this.sectionApiAtribut + '?order=key&direction=ASC'
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemAttribute = response.data.data
                    }
                })
                .catch(error => { 
                    this.countErrorGetAttribute++
                    if(this.countErrorGetAttribute >= 3){
                        this.errored = true
                    }else{
                        this.getAttribute()
                    }
                })
                .finally(() => this.loading = false)
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerror = ''
                this.messagesuccess = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv, {
                                display_name : this.forms.name,
                                status : this.forms.status,
                                product_id: this.forms.produkId,
                                price : this.forms.price,
                                item_code : this.forms.code,
                                attribute_id: this.forms.attribute
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Produk Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // this.countErrorCreate++
                                // if(this.countErrorCreate >= 3){
                                //     this.errored = true
                                // }else{
                                //     this.submitSave('formsvalid', 'save')
                                // }
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id
                            this.axios.put(urlv, {
                                display_name : this.forms.name,
                                status : this.forms.status,
                                product_id: this.forms.produkId,
                                price : this.forms.price,
                                item_code : this.forms.code,
                                attribute_id: this.forms.attribute
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Produk Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // this.countErrorEdit++
                                // if(this.countErrorEdit >= 3){
                                //     this.errored = true
                                // }else{
                                //     this.submitSave('formsvalid', 'edit')
                                // }
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

            // delete Item
            deletePost(type, valueid){
                this.messagesuccess = ''
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    if(this.itemiDforDelete.length <= 5){
                        this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' item dari daftar?', 'Hapus Barang', {
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
                    this.$confirm('Apakah anda yakin akan menghapus item dari daftar?', 'Hapus Barang', {
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

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 300),

            // Get Result data from searchbar
            getResultProduk: _.debounce(function(){
                let url = this.apiURL + this.sectionApiProduk + '?search=' + this.searchProduk
                this.loadingProduk = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemProduct = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loadingProduk = false)
            }, 300),

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
                if(this.$dataRole['item.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.titleForms = "Detail Barang"
                        this.itemDataDetail = val
                        this.forms.attribute = []

                        let produkShadows = this.searchArray(val.product_id, this.itemProduct)
                        
                        this.forms.name = val.display_name 
                        this.forms.produkget = produkShadows.name
                        this.forms.produkId = produkShadows.id
                        this.forms.price = (val.price).slice(0, -3)
                        this.forms.code = val.item_code
                        this.forms.status = val.status

                        val.attributes.forEach(function(element){
                            this.forms.attribute.push(element.attribute_id)
                        }, this)

                        this.contentProduk = produkShadows.id

                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            searchArray(nameKey, myArray){
                for (var i=0; i < myArray.length; i++) {
                    if (myArray[i].id === nameKey) {
                        return myArray[i];
                    }
                }
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

            // Create Forms function
            Create(){
                this.titleForms = "Barang Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');

                this.forms.name = ''
                this.forms.produkget = ''
                this.forms.price = ''
                this.forms.code = ''
                
                this.forms.attribute = []

                this.contentProduk = ''

                this.messageerror = ''
                this.messagesuccess = ''
            },

            ChooseProduk(){
                this.forms.produkget = document.querySelector('.mb-dialog .content-dialog .item-list label.is-checked .el-radio__label').textContent
                this.forms.produkId = this.contentProduk
                this.dialogVisible = false
            },
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
            this.itemProduct = []
            this.itemAttribute = []
            this.itemiDforDelete = []
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
            this.searchProduk = ''
            this.contentProduk = ''
            this.messageerror = ''
            this.messagesuccess = ''
        }
    }
</script>