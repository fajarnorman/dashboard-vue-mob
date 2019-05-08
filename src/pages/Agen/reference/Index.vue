<template>
    <div class="content-wrapper">
        <div id="master-barang">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Reference</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['reference.create']">
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

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Kategori" name=""></el-tab-pane>
                                    <el-tab-pane label="Area" name="Area"></el-tab-pane>
                                    <el-tab-pane label="Regional Agen" name="RegionalAgen"></el-tab-pane>
                                    <el-tab-pane label="Jenis Barang" name="JenisBarang"></el-tab-pane>
                                    <el-tab-pane label="Jenis Pertanian" name="JenisPertanian"></el-tab-pane>
                                    <el-tab-pane label="Kemasan" name="Kemasan"></el-tab-pane>
                                    <el-tab-pane label="Kota" name="Kota"></el-tab-pane>
                                    <el-tab-pane label="Provinsi" name="Propinsi"></el-tab-pane>
                                </el-tabs>
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['reference.delete']"></el-table-column>
                                <el-table-column prop="id" label="ID" width="70"></el-table-column>
                                <el-table-column prop="category" label="Kategori" width="150"></el-table-column>
                                <el-table-column prop="name" label="Nama" width="600"></el-table-column>
                                <el-table-column prop="status" label="Status"></el-table-column>
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
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kategori">
                                                                <el-select v-model="forms.category">
                                                                    <el-option label="Area" value="Area">Area</el-option>
                                                                    <el-option label="Regional Agen" value="RegionalAgen">Regional Agen</el-option>
                                                                    <el-option label="Jenis Barang" value="JenisBarang">Jenis Barang</el-option>
                                                                    <el-option label="Jenis Pertanian" value="JenisPertanian">Jenis Pertanian</el-option>
                                                                    <el-option label="Kemasan" value="Kemasan">Kemasan</el-option>
                                                                    <el-option label="Kota" value="Kota">Kota</el-option>
                                                                    <el-option label="Propinsi" value="Propinsi">Propinsi</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">Inactive</el-radio>
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
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['reference.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['reference.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reference',

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
                filterQuery: '',

                 // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    name: '',
                    category: '',
                    status: '',
                },
                rules2:{}
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['reference.list'])
        },
        mounted () {
            // this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newFilter){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newFilter)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            // build url function
            buildUrl (limit, page, search, category) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=ASC' + '&category=' + category
            },

            // Get All Post
            getPosts(num, pg, sch, cat){
                let url = this.buildUrl(num, pg, sch, cat)
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
            }, 300),

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda yakin akan menghapus '+ id.length +' reference dari daftar?', 'Hapus Reference', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiURL + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
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
                    this.$confirm('Anda yakin akan menghapus data reference dari daftar?', 'Hapus Reference', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
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
                if(this.$dataRole['reference.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.titleForms = "Detail Reference"

                        this.itemDataDetail = val
                        this.forms.category = this.itemDataDetail.category
                        this.forms.name = this.itemDataDetail.name
                        this.forms.status = this.itemDataDetail.status
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
            },

            // Create Forms function
            Create(){
                this.titleForms = "Reference Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.forms.category = ''
                this.forms.name = ''
                this.forms.status = ''
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv, {
                                category : this.forms.category,
                                name : this.forms.name,
                                status : this.forms.status
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Reference Baru Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id
                            this.axios.put(urlv, {
                                category : this.forms.category,
                                name : this.forms.name,
                                status : this.forms.status
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data Reference Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
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
            }
        }
    }
</script>