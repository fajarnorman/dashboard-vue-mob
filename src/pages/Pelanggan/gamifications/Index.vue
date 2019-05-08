<template>
    <div class="content-wrapper">
        <div id="gamifications">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Gamification</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['gamification.create']">
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
                        <div class="" v-if="itemsData">

                            <div class="grand-total">
                                <span>Total point spend by the game </span>
                                {{parseInt(totalPoint)}} point
                            </div>

                            <div class="filterSearching clearfix">
                                <div class="input-with-icons clearfix">
                                    <el-input v-model="searchQuery" class="float-left"></el-input>
                                    <img src='~assets/images/icons/search1.png'>
                                </div>
                                <div class="switch-custom">
                                    <el-switch
                                        v-model="switchOnOff"
                                        @change="setAvailable">
                                    </el-switch>
                                    <span v-if="switchOnOff">Status Aktif</span>
                                    <span v-else>Status Tidak Aktif</span>
                                </div>
                                <!-- <el-time-picker
                                    is-range
                                    v-model="value4"
                                    range-separator="To"
                                    start-placeholder="Start time"
                                    end-placeholder="End time"
                                    format="HH:mm">
                                </el-time-picker> -->
                            </div>

                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>
                            
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                @current-change="handleCurrentChange"
                                @selection-change="handleSelectionChange"
                                ref="singleTable"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55" v-if="$dataRole['gamification.delete']"></el-table-column>
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="name" label="Nama" width="200"></el-table-column>
                                <el-table-column prop="type" label="Type"></el-table-column>
                                <el-table-column prop="amount" label="Jumlah Point"></el-table-column>
                                <el-table-column label="Probability">
                                    <template slot-scope="scope">
                                        {{scope.row.probability}}%
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
                                        <div v-show="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Type" prop="type">
                                                                <el-radio-group v-model="forms.type">
                                                                    <el-radio label="point">POINT</el-radio>
                                                                    <el-radio label="item">ITEM</el-radio>
                                                                    <el-radio label="loss">LOSS</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jumlah Point" prop="point">
                                                                <el-input-number v-model="forms.point" :min="0"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Probability (0-100) %" prop="probability">
                                                                <el-input-number v-model="forms.probability" :min="0" :max="100"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['gamification.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['gamification.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'    

    export default {
        name: 'gamifications',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'gamification',
                sectionsSetAvailabel: '/setAvailable',
                sectionsGetAvailabel: '/getAvailable',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: 'DESC',
                orderBy: '',
                totalPage: '',
                totalPoint: '',
                filterQuery: '',
                supplierQuery: '',
                switchOnOff: false,
                value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',

                // Message
                messageerror: '',
                messagesuccess: '',

                // Forms
                forms:{
                    name: '',
                    type: '',
                    point: '',
                    probability: 100,
                },
                rules2:{
                    name: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    type: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    point: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    probability: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                }
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['gamification.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, this.orderBy, '')
            this.getAvailable()

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
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, order, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&order=' + order + '&search=' + search + '&direction=' + this.direction
            },

            // Get All Post
            getPosts(num, pg, odr, sch){
                let url = this.buildUrl(num, pg, odr, sch)
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
                        this.totalPoint = response.data.totalPoint
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            // Get Available Point Gamifications
            getAvailable(){
                let url = this.apiURL + this.sectionApi + this.sectionsGetAvailabel
                this.axios.get(url)
                .then(response => {
                    if(response.data.data.status == 'off'){
                        this.switchOnOff = false
                    }else{
                        this.switchOnOff = true
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            setAvailable(){
                this.messagesuccess = ''
                let statusGami = ''
                
                if(this.switchOnOff == true){
                    statusGami = 'on'
                }else{
                    statusGami = 'off'
                }

                this.$confirm('Apakah anda yakin?', 'Gamifications', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let url = this.apiURL + this.sectionApi + this.sectionsSetAvailabel
                    this.axios.post(url,{
                        status: statusGami
                    })
                    .then(response => {
                        this.getAvailable()
                    })
                    .catch(error => { 
                        console.log(error);
                    })
                    .finally(() => {
                        if(this.switchOnOff == true){
                            this.messagesuccess = "Gamifications Berhasil di Aktifkan"
                        }else{
                            this.messagesuccess = "Gamifications Berhasil di NonAktifkan"
                        }
                    })
                }).catch(() => {
                    this.getAvailable()
                })
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery)
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.orderBy, this.searchQuery)
            }, 300),

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

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['gamification.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true

                        let url = this.apiURL + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = "Edit Gamification - " + this.itemDataDetail.name

                            this.forms.name = this.itemDataDetail.name
                            this.forms.type = this.itemDataDetail.type
                            this.forms.probability = this.itemDataDetail.probability
                            this.forms.point = this.itemDataDetail.amount
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
                this.titleForms = "Gamification Baru"
                this.formsType = 'create'
                this.messageerror = ''
                this.messagesuccess = ''
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            // Submit Button
            submitSave(formName, formtype){
                this.messagesuccess = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                type: this.forms.type,
                                probability: this.forms.probability,
                                amount: this.forms.point,
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Gamifications Baru Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, this.orderBy, '')
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
                                name: this.forms.name,
                                type: this.forms.type,
                                probability: this.forms.probability,
                                amount: this.forms.point,
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Gamifications Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, this.orderBy, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // console.log(error);
                            })
                        }
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
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
                    this.$confirm('Anda akan menghapus '+ id.length +' dari daftar.', 'Hapus Gamifications', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiURL + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, this.orderBy, '')
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
                    this.$confirm('Anda akan menghapus '+ this.itemDataDetail.name +' dari daftar.', 'Hapus Gamifications', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, this.orderBy, '')
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
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>

<style>

</style>
