<template>
    <div class="content-wrapper">
        <div id="master-barang">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Backlink</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['term.condition.create']">
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
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="title" label="Title" width="170"></el-table-column>
                                <el-table-column label="Link" width="500">
                                    <template slot-scope="scope">
                                        <a target="_blank" class="id-green" :href="baseUrl + 'snk/' + scope.row.slug">{{baseUrl + 'snk/' + scope.row.slug}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="updated_at" label="Last Update"></el-table-column>
                                <el-table-column label="Actions" v-if="$dataRole['term.condition.edit'] == true || $dataRole['term.condition.delete'] == true">
                                    <template slot-scope="scope">
                                        <a v-if="$dataRole['term.condition.edit']" style="margin-right: 15px;" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" /></a>
                                        <a v-if="$dataRole['term.condition.delete']" @click.prevent="deletePost('once', scope.row._id)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
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
                                                <el-button class="button-outline-red" round @click.prevent="deletePost('all','')">Hapus</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Detail, Edit, Create Forms -->
                            <div class="base-template-sidebar">
                                <!-- loading bar -->
                                <div class="el-loading-mask" style="z-index:1000!important;" v-show="(loadingForm == true)">
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
                                                            <el-form-item label="Title (Url Name)" prop="urlName">
                                                                <el-input v-model="forms.urlName"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Content"></el-form-item>
                                                            <summernote class="form-control" name="editor" :model="forms.content" v-on:change="value => { forms.content = value }"></summernote>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['term.condition.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail._id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['term.condition.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'Backlink',
        data () {
            return {
                // for get api
                baseUrl: process.env.BASE_URL,
                apiURL: process.env.ROOT_API,
                sectionApi: 'termCondition',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
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
                    urlName: '',
                    content: '',
                },
                rules2:{
                    urlName: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    // name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                fontsIcons:{
                    edit: faEdit,
                    delete: faTrashAlt,
                }
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['term.condition.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
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
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
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
                this.messageerror = ''
                this.messagesuccess = ''
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda yakin akan menghapus '+ id.length +' data dari daftar?', 'Hapus Kios', {
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
                }else if(type == 'once'){
                    this.$confirm('Anda yakin akan menghapus data backlink dari daftar?', 'Hapus Backlink', {
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

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['term.condition.detail']){
                    if(val){
                        $('.testingnotesummer').summernote('code', '')
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.titleForms = "Edit Backlink"
                        this.itemDataDetail = val
                        this.messagesuccess = ''
                        this.messageerror = ''
                        this.loadingForm = true
                        let url = this.apiURL + this.sectionApi + '/' + this.itemDataDetail._id

                        this.axios.get(url)
                        .then(response => {
                            if(response.data.status == 'success'){
                                let dataDetail = response.data.data
                                this.forms.urlName = dataDetail.title
                                this.forms.content = dataDetail.description
                                $('.testingnotesummer').summernote('code', dataDetail.description)
                                this.loadingForm = false
                            }
                        })
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

                this.messagesuccess = ''
                this.messageerror = ''
                
                this.forms.urlName = ''
                this.forms.content = ''

                $('.testingnotesummer').summernote('code', '')
            },

            // Create Forms function
            Create(){
                this.titleForms = "Backlink Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.messagesuccess = ''
                this.messageerror = ''
                
                this.forms.urlName = ''
                this.forms.content = ''

                $('.testingnotesummer').summernote('code', '')
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
                                title : this.forms.urlName,
                                description : this.forms.content,
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Backlink Baru Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail._id
                            this.axios.put(urlv, {
                                title : this.forms.urlName,
                                description : this.forms.content,
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Backlink Berhasil diedit."
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
            }
        },
        components: {
            'summernote' : require('@/functions/Summernote')
        }
    }
</script>

<style lang="scss" scoped>
.fontIcons{
    font-size: 16px;
}
</style>
