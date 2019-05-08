<template>
    <div class="content-wrapper">
        <div id="topup-bonus">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Topup Bonus</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['topup.bonus.create']">
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
                                @selection-change="handleSelectionChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <!-- <el-table-column type="selection" width="55" v-if="$dataRole['topup.bonus.delete']"></el-table-column> -->
                                <el-table-column prop="name" label="Nama"></el-table-column>
                                <el-table-column prop="code" label="Kode"></el-table-column>
                                <el-table-column label="Topup Bonus">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.type == 'percent'">
                                            {{scope.row.value}}%
                                        </div>
                                        <div v-else>
                                            Rp. {{formatPrice(scope.row.value)}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Tanggal Mulai" width="200">
                                    <template slot-scope="scope">
                                        {{scope.row.date_start | moment("DD MMMM YYYY h:mm A")}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Tanggal Berakhir" width="200">
                                    <template slot-scope="scope">
                                        {{scope.row.date_end | moment("DD MMMM YYYY h:mm A")}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Actions">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="Edit Topup Bonus" placement="top-start">
                                            <a href="#" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon style="font-size: 18px;margin-right:5px;" class="fontIcons" :icon="fontsIcons.edit" /></a>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="Detail Penggunaan Topup Bonus" placement="top-start">
                                            <a href="#" @click.prevent="$router.push({ name: 'topupbonususage', params: { id: scope.row.id }})"><font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.detail" /></a>
                                        </el-tooltip>
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
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Topup Bonus" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Minimal Topup Bonus" prop="min_topup">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.min_topup" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Topup Bonus Dimulai" prop="dateStart">
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
                                                            <el-form-item label="Topup Bonus Berakhir" prop="dateEnd">
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
                                                            <el-form-item label="Tipe Topup Bonus">
                                                                <el-radio-group v-model="forms.type" @change="changeRadioType">
                                                                    <el-radio label="percent">PERCENTAGE</el-radio>
                                                                    <el-radio label="static">STATIC</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Value Bonus" prop="value" v-if="forms.type == 'static'">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="valuePriceMoney" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                            <el-form-item label="Value Bonus" prop="value" v-else>
                                                                <el-input-number v-model="forms.value" :min="0" :max="100"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12" v-if="forms.type == 'percent'">
                                                            <el-form-item label="Maximal Bonus" prop="max_bonus">
                                                                <div class="el-form-item__content custom-price-format is-disabled">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.max_bonus" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penggunaan Topup Bonus" prop="max_usage">
                                                                <el-input-number v-model="forms.max_usage" :min="-1"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penggunaan Tiap User" prop="max_usage_user">
                                                                <el-input-number v-model="forms.max_usage_user" :min="-1"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Limit Penggunaan Tiap User perhari" prop="max_usage_user_daily">
                                                                <el-input-number v-model="forms.max_usage_user_daily" :min="-1"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <span style="font-weight: 600;font-size: 12px;color: #800080;">*Note : (-1) adalah unlimited</span>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['topup.bonus.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['topup.bonus.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    
    import { faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'topup-bonus',
        components: {Money},
        data () {
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
            var validateDiscount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (this.forms.type == 'percent') {
                        if(value > 100){
                            callback(new Error('Tidak boleh lebih dari 100'));
                        }
                    }
                    callback();
                }
            };
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'topupBonus',

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
                valuePriceMoney: '',
                forms:{
                    name: '',
                    min_topup: '',
                    dateStart: '',
                    timeStart: '00:00',
                    dateEnd: '',
                    timeEnd: '23:59',
                    type: 'percent',
                    value: '',
                    max_bonus: '',
                    max_usage: -1,
                    max_usage_user: -1,
                    max_usage_user_daily: -1,
                },
                rules2:{
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    min_topup: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    dateStart: [ { required: true, validator: validateDateStart, trigger: 'blur' } ],
                    dateEnd: [ { required: true, validator: validateDateEnd, trigger: 'blur' } ],
                    value: [ { required: true, validator: validateDiscount, trigger: 'blur' } ],
                    max_usage: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    max_usage_user: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    max_usage_user_daily: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                fontsIcons: {
                    detail: faInfoCircle,
                    edit: faEdit
                }
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['topup.bonus.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')
            // JQuery(".el-input-number .el-input__inner").bind({
            //     keydown: function(e) {
            //         if (e.shiftKey === true ) {
            //             if (e.which == 9) {
            //                 return true;
            //             }
            //             return false;
            //         }
            //         if (e.which > 57) {
            //             return false;
            //         }
            //         if (e.which==32) {
            //             return false;
            //         }
            //         return true;
            //     }
            // });
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            valuePriceMoney: function(newValue){
                if(this.forms.type == 'static'){
                    this.forms.max_bonus = newValue
                }
                this.forms.value = newValue
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
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },
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
            getResult: _.debounce(function(){
               this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 300),
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' topup bonus dari daftar?', 'Hapus Topup Bonus', {
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
                    this.$confirm('Apakah anda yakin akan menghapus topup bonus dari daftar?', 'Hapus Topup Bonus', {
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
            handleCurrentChange(val){
                this.messageerror = ''
                this.messagesuccess = ''
                this.forms.sku_category_list = []
                if(this.$dataRole['topup.bonus.show']){
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
                            this.titleForms = 'Ubah Topup Bonus'

                            this.forms.name = this.itemDataDetail.name
                            this.forms.min_topup = this.itemDataDetail.min_topup
                            this.forms.dateStart = FUNCTIONS.formatDate(this.itemDataDetail.date_start)
                            this.forms.timeStart = FUNCTIONS.formatTime(this.itemDataDetail.date_start)
                            this.forms.dateEnd = FUNCTIONS.formatDate(this.itemDataDetail.date_end)
                            this.forms.timeEnd = FUNCTIONS.formatTime(this.itemDataDetail.date_end)
                            this.forms.type = this.itemDataDetail.type
                            this.forms.value = this.itemDataDetail.value
                            this.valuePriceMoney = this.itemDataDetail.value
                            this.forms.max_bonus = this.itemDataDetail.max_bonus
                            this.forms.max_usage = this.itemDataDetail.max_usage
                            this.forms.max_usage_user = this.itemDataDetail.max_usage_user
                            this.forms.max_usage_user_daily = this.itemDataDetail.max_usage_user_daily
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
            Create(){
                this.titleForms = "Topup Bonus Baru"
                this.formsType = 'create'

                this.messageerror = ''
                this.messagesuccess = ''

                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
                this.messageerror = ''
                this.messagesuccess = ''

                this.forms.name = ''
                this.forms.min_topup = ''
                this.forms.dateStart = ''
                this.forms.timeStart = '00:00'
                this.forms.dateEnd = ''
                this.forms.timeEnd = '23:59'
                this.forms.type = 'percent'
                this.forms.value = ''
                this.forms.max_bonus = ''
                this.forms.max_usage = -1
                this.forms.max_usage_user = -1
                this.forms.max_usage_user_daily = -1
                this.valuePriceMoney = ''
            },
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                min_topup: this.forms.min_topup,
                                date_start: this.forms.dateStart + ' ' + this.forms.timeStart,
                                date_end: this.forms.dateEnd + ' ' + this.forms.timeEnd,
                                type: this.forms.type,
                                value: this.forms.value,
                                max_bonus: this.forms.max_bonus,
                                max_usage: this.forms.max_usage,
                                max_usage_user: this.forms.max_usage_user,
                                max_usage_user_daily: this.forms.max_usage_user_daily
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data Berhasil ditambahkan."
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
                                min_topup: this.forms.min_topup,
                                date_start: this.forms.dateStart + ' ' + this.forms.timeStart,
                                date_end: this.forms.dateEnd + ' ' + this.forms.timeEnd,
                                type: this.forms.type,
                                value: this.forms.value,
                                max_bonus: this.forms.max_bonus,
                                max_usage: this.forms.max_usage,
                                max_usage_user: this.forms.max_usage_user,
                                max_usage_user_daily: this.forms.max_usage_user_daily
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
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            changeRadioType(value){
                // if(value == 'percent'){
                    this.forms.max_bonus = ''
                    this.forms.value = ''
                // }
            }
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
        }
    }
</script>
