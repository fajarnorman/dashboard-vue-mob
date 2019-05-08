<template>
    <div class="content-wrapper">
        <div id="sku">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">SKU Limit</h4>
                        <div class="add-actions float-right" v-if="$dataRole['skulimit.create']">
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
                            <div class="switch-custom">
                                <el-switch
                                    v-model="switchOnOff"
                                    @change="setAvailable">
                                </el-switch>
                                <span v-if="switchOnOff">Enable Function: On</span>
                                <span v-else>Enable Function: Off</span>
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['skulimit.delete']"></el-table-column>
                                <el-table-column type="index" label="No" width="55"></el-table-column>
                                <el-table-column prop="event_name" label="Event Name" width="150"></el-table-column>
                                <el-table-column prop="sku_name" label="SKU" width="250"></el-table-column>
                                <el-table-column prop="limit" label="Limit" width="120" align="center"></el-table-column>
                                <el-table-column prop="datetime_start" label="Start Date"></el-table-column>
                                <el-table-column prop="datetime_end" label="End Date"></el-table-column>
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
                                                <h5>Info SKU Limit</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Agenda" prop="agenda">
                                                                <el-input v-model="forms.agenda"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="SKU" prop="skuData">
                                                                <el-select 
                                                                    filterable
                                                                    remote
                                                                    :remote-method="getPostSku"
                                                                    :loading="loadingSku"
                                                                    v-model="forms.skuData" 
                                                                    @blur="getPostSku('')"
                                                                    placeholder="--Pilih Sku--">
                                                                    <el-option 
                                                                        v-for="(dataSku, indexSku) in itemsDataSku"
                                                                        :key="indexSku"
                                                                        :label="dataSku.name" 
                                                                        :value="dataSku.id">{{dataSku.name}} ({{dataSku.supplier}})</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Berlaku" prop="datetimes">
                                                                <el-date-picker
                                                                    v-model="forms.datetimes"
                                                                    type="datetimerange"
                                                                    range-separator="-"
                                                                    format="yyyy-MM-dd HH:mm:ss"
                                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                                    start-placeholder="Start Date"
                                                                    end-placeholder="End Date">
                                                                </el-date-picker>
                                                            </el-form-item>
                                                            <!-- {{forms.datetimes}} -->
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penjualan" prop="limit">
                                                                <el-input-number v-model="forms.limit" :min="1"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="$dataRole['skulimit.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-if="$dataRole['skulimit.edit']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
        name: 'skuLimit',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'skuLimit',
                sectionApiSku: 'skus',

                // for store data after get api
                itemsData: [],
                itemsDataSku: [],
                itemDataDetail: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingSku: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                switchOnOff: false,

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    agenda: '',
                    limit: '',
                    datetimes: '',
                    skuData: '',
                },
                rules2:{
                    agenda: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    skuData: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    limit: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    datetimes: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                // for error counting
                countErrorPost: 0,
                countErrorGetSKU: 0,
                countErrorGetStatusLimit: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['skulimit.list'])
        },
        mounted () {
            this.getPosts()
            this.getPostSku('')
            this.getStatusSkuLimit()

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
                this.getPosts()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            skuData(newData){
                console.log(newData)
                if(newData == '' || newData == '--Pilih%20Sku--'){
                    this.getPostSku('')
                }
            }
        },
        methods: {
            // build url function
            buildUrl () {
                return this.apiUrl + this.sectionApi + "?limit=" + this.perPage + '&page=' + this.currentPage + '&search=' + this.searchQuery + '&direction=DESC'
            },

            buildUrlSku(search){
                return this.apiUrl + this.sectionApiSku + '?search=' + search
            },

            // Get All Post
            getPosts(){
                let url = this.buildUrl()
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
                        this.getPosts()
                    }
                })
                .finally(() => this.loading = false)
            },

            getStatusSkuLimit(){
                let url = this.apiUrl + this.sectionApi + '/status'
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.switchOnOff = response.data.data
                    }
                })
                .catch(error => { 
                    this.countErrorGetStatusLimit++
                    if(this.countErrorGetStatusLimit >= 3){
                        this.errored = true
                    }else{
                        this.getStatusSkuLimit()
                    }
                })
            },

            getPostSku(search){
                let url = this.buildUrlSku(search)
                this.loadingSku = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        // console.log(response.data.data.length)
                        // if(response.data.data.length > 1){
                            this.itemsDataSku = response.data.data
                        // }else{
                            // this.getPostSku('')
                        // }
                    }
                })
                .catch(error => { 
                    this.countErrorGetSKU++
                    if(this.countErrorGetSKU >= 3){
                        this.errored = true
                    }else{
                        this.getPostSku('')
                    }
                })
                .finally(() => this.loadingSku = false)
            },

            setAvailable(){
                this.$confirm('Saat anda klik OK, maka pengaturan akan berganti', 'Apakah anda yakin?', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let statusSkuLimit
                    if(this.switchOnOff == true){
                        statusSkuLimit = "on"
                    }else{
                        statusSkuLimit = "off"
                    }
                    let url = this.apiUrl + this.sectionApi + '/enableFunction'
                    this.axios.post(url,{
                        status : statusSkuLimit
                    })
                    .then(response => {
                        if(response.data.status == 'success'){
                            this.getStatusSkuLimit()
                            if(this.switchOnOff == true){
                                this.messagesuccess = "SKU Limit Berhasil di Aktifkan"
                            }else{
                                this.messagesuccess = "SKU Limit Berhasil di NonAktifkan"
                            }
                        }else{
                            this.$notify.error({
                                title: 'Error',
                                message: response.data.message
                            });
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    })
                }).catch(() => {
                    this.getStatusSkuLimit()
                })
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts()
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts()
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    if(this.itemiDforDelete.length <= 5){
                        this.$confirm('Anda yakin akan menghapus '+ id.length +' items dari daftar?', 'Hapus SKU Limit', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        }).then(() => {
                            this.loading = true
                            for(let i = 0; i< id.length; i++){
                                let url = this.apiUrl + this.sectionApi + '/' + id[i].id
                                this.axios.delete(url)
                                .then(response => {
                                    this.getPosts()
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
                    this.$confirm('Anda yakin akan menghapus '+ this.itemDataDetail.event_name +' dari daftar?', 'Hapus SKU Limit', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts()
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
                if(this.$dataRole['skulimit.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        let that = this
                        this.itemDataDetail = val
                        this.formsType = 'edit'
                        this.loadingForm = true
                        this.titleForms = 'Edit SKU Limit'
                        this.forms.agenda = val.event_name
                        this.forms.skuData = val.sku_id
                        this.forms.limit = val.limit
                        this.forms.datetimes = [val.datetime_start, val.datetime_end]
                        setTimeout(function(){
                            that.loadingForm = false
                        }, 1000)
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
                this.titleForms = "Tambah SKU Limit"
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
                                agenda: this.forms.agenda,
                                sku_id: this.forms.skuData,
                                limit: this.forms.limit,
                                datetime_start: this.forms.datetimes[0],
                                datetime_end: this.forms.datetimes[1],
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data SkuLimit Berhasil ditambahkan."
                                    this.getPosts()
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
                                agenda: this.forms.agenda,
                                sku_id: this.forms.skuData,
                                limit: this.forms.limit,
                                datetime_start: this.forms.datetimes[0],
                                datetime_end: this.forms.datetimes[1],
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data SkuLimit Berhasil diubah."
                                    this.getPosts()
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

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
            skuData() {
                return this.forms.skuData;
            }
        },
    }
</script>