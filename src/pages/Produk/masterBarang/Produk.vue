<template>
    <div class="content-wrapper">
        <div id="master-barang">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Produk</h4>
                        <div class="add-actions float-right" v-if="$dataRole['product.create']">
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['product.delete']"></el-table-column>
                                <el-table-column type="index" label="No." width="55"></el-table-column>
                                <el-table-column prop="name" label="Nama"></el-table-column>
                                <el-table-column prop="category_product.name" label="Kategori Produk"></el-table-column>
                                <el-table-column prop="status" label="Status"></el-table-column>
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
                                        <div v-show="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Produk</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Produk" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kategori Produk" prop="cat_produk">
                                                                <el-select v-model="forms.cat_produk" placeholder="Select">
                                                                    <el-option v-for="(dataCat, indexCat) in itemcatProduct" :value="dataCat.id" :label="dataCat.name" :key="indexCat">{{dataCat.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">Inactive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Deskripsi" prop="description">
                                                                <el-input
                                                                    type="textarea" 
                                                                    :autosize="{ minRows: 5, maxRows: 10}" 
                                                                    :rows="5"
                                                                    v-model="forms.description" ></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="$dataRole['product.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['product.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    import FUNCTIONS from '@/functions'

    export default {
        name: 'MS_Attribut',
        data () {
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (/^[a-zA-Z0-9- ,_]*$/.test( this.forms.name ) == false) {
                        callback(new Error('Nama Produk tidak boleh ada symbol'));
                    }
                    callback();
                }
            };
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'product',
                sectionApiCatProduk: 'categoryProduct',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemcatProduct: [],
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

                 // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    name: '',
                    status: 'active',
                    cat_produk: '',
                    description: '',
                },
                rules2:{
                    name: [ { required: true, validator: validateCode, trigger: 'blur' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    cat_produk: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    description: [ 
                        { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                        { max: 191, message: 'Deskripsi anda terlalu banyak', trigger: 'blur' }
                    ],
                },

                // for error counting
                countErrorPost: 0,
                countErrorGetCategory: 0,
                // countErrorCreate: 0,
                // countErrorEdit: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['product.list'])
        },
        mounted () {
            this.getCatProduct()
            this.getPosts(this.perPage, this.currentPage, '')
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
            getCatProduct(){
                let url = this.apiURL + this.sectionApiCatProduk
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemcatProduct = response.data.data
                    }
                })
                .catch(error => { 
                    this.countErrorGetCategory++
                    if(this.countErrorGetCategory >= 3){
                        this.errored = true
                    }else{
                        this.getCatProduct()
                    }
                })
                .finally(() => this.loading = false)
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messagesuccess = ''
                this.messageerror = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                description: this.forms.description,
                                category_product_id: this.forms.cat_produk,
                                status: this.forms.status,
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
                                name: this.forms.name,
                                description: this.forms.description,
                                category_product_id: this.forms.cat_produk,
                                status: this.forms.status,
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
                        this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' item dari daftar?', 'Hapus Produk', {
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
                    this.$confirm('Apakah anda yakin akan menghapus item dari daftar?', 'Hapus Produk', {
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
                if(this.$dataRole['product.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.titleForms = "Edit Produk"
                        this.itemDataDetail = val
                        
                        this.forms.name = val.name
                        this.forms.description = val.description
                        this.forms.cat_produk = val.category_product_id
                        this.forms.status = val.status
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
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
                this.titleForms = "Produk Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.messageerror = ''
                this.messagesuccess = ''
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
            this.itemcatProduct = []
            this.itemskuCategory = []
            this.itemiDforDelete = []
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
            this.messageerror = ''
            this.messagesuccess = ''
        }
    }
</script>