<template>
    <div class="content-wrapper">
        <div id="sku">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Daftar Produsen</h4>
                        <div class="add-actions float-right" v-if="$dataRole['producer.create']">
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
                            <div v-if="messagesuccess !== ''">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="index" label="No" width="55"></el-table-column>
                                <el-table-column prop="email" label="Email"></el-table-column>
                                <el-table-column prop="fullname" label="Fullname"></el-table-column>
                                <el-table-column prop="username" label="Username"></el-table-column>
                                <el-table-column prop="phone_number" label="Phone Number"></el-table-column>
                                <!-- <el-table-column label="Status" width="110">
                                    <template slot-scope="scope">
                                        <span class="badge inline success" v-if="scope.row.status == 'active'">{{scope.row.status}}</span>
                                        <span class="badge inline failed" v-else>{{scope.row.status}}</span>
                                    </template>
                                </el-table-column> -->
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
                                                <h5>Info Produsen</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama" prop="fullname">
                                                                <el-input v-model="forms.fullname"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Email" prop="email">
                                                                <el-input v-model="forms.email"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Username" prop="username">
                                                                <el-input v-model="forms.username"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Phone Number" prop="phone_number">
                                                                <el-input type="number" class="customvalinum" v-model="forms.phone_number"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item v-if="(formsType != 'edit')" label="Password" prop="password">
                                                                <el-input type="password" v-model="forms.password"></el-input>
                                                            </el-form-item>
                                                            <el-form-item v-else-if="(formsType == 'edit')" label="Password">
                                                                <el-input type="password" v-model="forms.password"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <!-- <el-col :span="12">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">InActive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col> -->
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="$dataRole['producer.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['producer.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    
    import JQuery from 'jquery'

    export default {
        name: 'skubrand',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'producer',

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

                textMemuatData: 'Masih memuat data',
                textErrorNetwork: 'Jaringan Bermasalah',

                // for create, detail, edit forms and validation
                forms:{
                    fullname: '',
                    email: '',
                    username: '',
                    phone_number: '',
                    password: '',
                    status: 'active',
                },
                rules2:{
                    fullname: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    email: [ 
                        { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                        { type: 'email', message: 'Format email tidak sesuai', trigger: ['blur', 'change'] }
                    ],
                    username: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    phone_number: [ 
                        { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                        { min: 8, message: 'Minimal inputan 8 character', trigger: 'blur' },
                        { max: 15, message: 'Maximal inputan 15 character', trigger: 'blur' } 
                    ],
                    password: [ 
                        { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                        { min: 6, message: 'Password Minimal 6 character', trigger: 'blur' },
                        { max: 10, message: 'Password Maximal 10 character', trigger: 'blur' }
                    ],
                },

                // for error counting
                countErrorPost: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['producer.list'])
        },
        mounted () {
            this.initNumberValidation()
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
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
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: 'Error',
                        message: this.textErrorNetwork
                    }); 
                })
                .finally(() => this.loading = false)
            },
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messagesuccess = ''
                this.messageerror = ''
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi
                            let formData = new FormData()
                            let dataFormsCreate

                            dataFormsCreate = {
                                email: this.forms.email,
                                fullname: this.forms.fullname,
                                username: this.forms.username,
                                phone_number: this.forms.phone_number,
                                password: this.forms.password,
                                status: this.forms.status
                            }

                            // formData.append('email', this.forms.email)
                            // formData.append('fullname', this.forms.fullname)
                            // formData.append('username', this.forms.username)
                            // formData.append('phone_number', this.forms.phone_number)
                            // formData.append('password', this.forms.password)
                            // formData.append('status', this.forms.status)

                            this.axios.post(urlv, dataFormsCreate)
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data Produsen Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                this.$notify.error({
                                    title: 'Error',
                                    message: error.response.data.message
                                }); 
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.id
                            let formDataEdit = new FormData()
                            let dataForms

                            if(this.forms.password !== ''){
                                dataForms = {
                                    email: this.forms.email,
                                    fullname: this.forms.fullname,
                                    username: this.forms.username,
                                    phone_number: this.forms.phone_number,
                                    password: this.forms.password,
                                    status: this.forms.status
                                }
                                // formDataEdit.append('email', this.forms.email)
                                // formDataEdit.append('fullname', this.forms.fullname)
                                // formDataEdit.append('username', this.forms.username)
                                // formDataEdit.append('phone_number', this.forms.phone_number)
                                // formDataEdit.append('password', this.forms.password)
                                // formDataEdit.append('status', this.forms.status)
                            }else{
                                dataForms = {
                                    email: this.forms.email,
                                    fullname: this.forms.fullname,
                                    username: this.forms.username,
                                    phone_number: this.forms.phone_number,
                                    status: this.forms.status
                                }
                                // formDataEdit.append('email', this.forms.email)
                                // formDataEdit.append('fullname', this.forms.fullname)
                                // formDataEdit.append('username', this.forms.username)
                                // formDataEdit.append('phone_number', this.forms.phone_number)
                                // formDataEdit.append('status', this.forms.status)
                            }
                            console.log(dataForms)
                            this.axios.put(urlv, dataForms)
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data Produsen Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                this.$notify.error({
                                    title: 'Error',
                                    message: error.response.data.message
                                }); 
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
                if(type == 'once'){
                    this.$confirm('Anda yakin akan menghapus '+ this.itemDataDetail.fullname +' dari daftar?', 'Hapus Data Produsen', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            if(response.data.status == 'success'){
                                this.getPosts(this.perPage, this.currentPage, '')
                                this.messagesuccess = "1 Items Berhasil dihapus."
                            }
                        })
                        .catch(error => { 
                            this.$notify.error({
                                title: 'Error',
                                message: 'Gagal menghapus data'
                            }); 
                        })
                        .finally(() => {
                            this.closeModal();
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 500),
            handleCurrentChange(val){
                if(this.$dataRole['producer.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true
                        let url = this.apiUrl + this.sectionApi + "/" + val.id
                        this.messageerror = ''
                        this.messagesuccess = ''
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = 'Edit Produsen'
                            this.forms.email = this.itemDataDetail.email
                            this.forms.fullname = this.itemDataDetail.fullname
                            this.forms.username = this.itemDataDetail.username
                            this.forms.phone_number = this.itemDataDetail.phone_number
                            this.forms.status = this.itemDataDetail.status
                        })
                        .catch(error => { 
                            this.$notify.error({
                                title: 'Error',
                                message: 'Gagal mendapatkan data detail'
                            }); 
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
            Create(){
                if(this.loading == false){
                    this.titleForms = "Produsen Baru"
                    this.formsType = 'create'
                    this.forms.name = ''
                    this.messageerror = ''
                    this.messagesuccess = ''
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                }else{
                    this.$notify({
                        type: 'warning',
                        title: 'Maaf',
                        message: this.textMemuatData
                    });
                }
            },
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.forms.email = ''
                this.forms.username = ''
                this.forms.fullname = ''
                this.forms.phone_number = ''
                this.forms.status = 'active'
                this.forms.password = ''
            },
            initNumberValidation(){
                JQuery(".customvalinum .el-input__inner").bind({
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
            }
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>