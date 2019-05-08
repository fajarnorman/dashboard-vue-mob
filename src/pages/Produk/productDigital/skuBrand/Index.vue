<template>
    <div class="content-wrapper">
        <div id="sku">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">SKU Brand</h4>
                        <div class="add-actions float-right" v-if="$dataRole['skubrand.create']">
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['skubrand.delete']"></el-table-column>
                                <el-table-column type="index" label="No" width="55"></el-table-column>
                                <el-table-column prop="name" label="Nama"></el-table-column>
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
                                        <div v-show="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info SKU Brand</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="Inactive">InActive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="$dataRole['skubrand.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['skubrand.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
        name: 'skubrand',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'skuBrand',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    name: '',
                    status: 'active',
                },
                rules2:{
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                // for error counting
                countErrorPost: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['skubrand.list'])
        },
        mounted () {
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
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, '')
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
                    if(valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                status: this.forms.status
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
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.id
                            this.axios.put(urlv, {
                                name: this.forms.name,
                                status: this.forms.status
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

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    if(this.itemiDforDelete.length <= 5){
                        this.$confirm('Anda yakin akan menghapus '+ id.length +' items dari daftar?', 'Hapus SKU Brand', {
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
                    }else{
                        this.$notify({
                            title: 'Maaf',
                            message: 'Untuk fitur ini sementara kita batasi hanya 5 list',
                            type: 'warning'
                        });
                    }
                }else if(type == 'once'){
                    this.$confirm('Anda yakin akan menghapus '+ this.itemDataDetail.name +' dari daftar?', 'Hapus SKU Brand', {
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
                let vm = this
                let searchUrl = this.buildUrl(this.perPage, '', this.searchQuery)
                this.loading = true
                this.axios.get(searchUrl)
                .then(function (response) {
                    console.log(response)
                    vm.itemsData = response.data.data
                    vm.totalPage = response.data.totalData
                })
                .catch(function (error) {
                    console.log(error);
                    vm.errored = true
                }).finally(() => this.loading = false)
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
                if(this.$dataRole['skubrand.show']){
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
                            this.titleForms = 'Edit SKU Brand - ' + this.itemDataDetail.name

                            this.forms.name = this.itemDataDetail.name
                            this.forms.status = this.itemDataDetail.status
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
                this.titleForms = "SKU Brand Baru"
                this.formsType = 'create'
                this.forms.name = ''
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

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>