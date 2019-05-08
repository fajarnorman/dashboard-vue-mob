<template>
    <div class="content-wrapper">
        <div id="agent-achievement">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Target & Pencapaian</h4>
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
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="name" label="Regional" width="250"></el-table-column>
                                <el-table-column label="Kepala Agen" align="center" width="200">
                                    <template slot-scope="scope">
                                        <div v-for="(dataHeadAgent, indexHead) in scope.row.region_heads" :key="indexHead">
                                            {{dataHeadAgent}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total Agen" align="center">
                                    <template slot-scope="scope">
                                        <span class="badge primary inline">{{scope.row.agent_total}}</span>
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
                                                <h5>Pilih Produk</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Produk">
                                                                <el-select
                                                                    v-model="forms.produk"
                                                                    multiple
                                                                    filterable>
                                                                    <el-option
                                                                        v-for="item in list"
                                                                        :key="item.value"
                                                                        :label="item.label"
                                                                        :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                                <span style="font-size: 12px;line-height: normal;display: block">Dapat memilih lebih dari 1 produk</span>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    import _ from 'lodash'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'agentAchievement',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'agentTarget/regions',
                sectionApiProduct: 'product',
                sectionApiReference: 'reference',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemProduk: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingField: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                direction: 'DESC',
                order: 'agent_total', //

                // message variable
                messageerror: '',
                messagesuccess: '',

                options4: [],
                list: [],

                // for create, detail, edit forms and validation
                forms:{
                    produk: [],
                },
                rules2:{},

                arrayProduk: [],
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['agent.target'])
        },
        mounted () {
            // Get all Post user
            this.getPosts(this.perPage, this.currentPage, '')
            this.getPostProduk()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
            filterQuery: function(newFilter){
                this.getResultFilter()
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=' + this.direction + '&order=' + this.order
            },

            // get all post
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
                .finally(() => {
                    this.loading = false
                })
            },

            // getPost Produk
            getPostProduk(){
                let url = this.apiUrl + this.sectionApiProduct
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemProduk = response.data.data                        

                        this.itemsData.forEach(function(element){
                            let name = element.product_name
                            this.itemProduk.splice(this.itemProduk.findIndex(v => v.name === name), 1);
                        }, this)
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.list = this.itemProduk.map(item => {
                        return { value: item.id, label: item.name };
                    });
                })
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
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
            }, 300),

            // Get Result data from select options
            getResultFilter(){
                var vm = this
                var searchUrl = this.buildUrl(this.perPage, '', this.filterQuery)
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
            },

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda akan menghapus '+ id.length +' dari daftar.', 'Hapus Produk yang di Targetkan', {
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
                                this.getPostProduk()
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
                    this.$confirm('Anda akan menghapus item dari daftar.', 'Hapus Produk yang di Targetkan', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, '')
                            this.getPostProduk()
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
            handleCurrentChange(val) {
                if(this.$dataRole['agent.target.show']){
                    this.$router.push({ name: 'agent__target_detail', params: { id: val.id }})
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
                this.forms.produk = []
            },

            // Create Forms function
            Create(){
                this.titleForms = "Tambah Produk"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerror = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + this.sectionApi
                        this.axios.post(urlv, {
                            products: this.forms.produk
                        })
                        .then(response => {
                            document.getElementById('save').children[0].innerHTML = 'Simpan'
                            if(response.data.status == 'error'){
                                this.messageerror = response.data.message
                            }else{
                                this.messagesuccess = response.data.message
                                this.getPosts(this.perPage, this.currentPage, '')
                                this.getPostProduk()
                                this.closeModal();
                            }
                        })
                        .catch(error => { 
                            console.log(error)
                        })
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
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