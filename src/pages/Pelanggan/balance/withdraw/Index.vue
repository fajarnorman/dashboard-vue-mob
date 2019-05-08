<template>
    <div class="content-wrapper">
        <div id="balance-topup">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Agen Withdraw</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" href="#">
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
                    <div v-if="itemsData">
                        <div class="filterSearching clearfix">
                            <div class="input-with-icons clearfix">
                                <el-input v-model="searchQuery" class="float-left"></el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                            <el-date-picker
                                class="date-range-picker"
                                v-model="startDate"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                                :format="format"
                                :value-format="format"></el-date-picker>
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
                                highlight-current-row
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="fullname" label="Name"></el-table-column>
                                <el-table-column prop="username" label="Username"></el-table-column>
                                <el-table-column label="Amount">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="description" label="Description"></el-table-column>
                                <el-table-column prop="created_at" label="Date"></el-table-column>
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
                                    <section v-show="(formsType == 'edit')">
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>General Info</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID">
                                                                {{itemDataDetail.id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Payment Method">
                                                                {{itemDataDetail.payment_method}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Balance Type">
                                                                {{itemDataDetail.balance_type}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Reference Id">
                                                                <span v-if="(itemDataDetail.reference_id == null)">-</span>
                                                                <span v-else>{{itemDataDetail.reference_id}}</span>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Amount">
                                                                Rp. {{formatPrice(itemDataDetail.amount)}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Description">
                                                                {{itemDataDetail.description}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="User">
                                                                <div v-if="itemDataDetail.user">
                                                                    {{itemDataDetail.user.fullname}} ({{itemDataDetail.user.username}})
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Update by">
                                                                <div v-if="itemDataDetail.user">
                                                                    {{itemDataDetail.user.updated_by}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                    <section v-show="(formsType != 'edit')">
                                        <div v-if="(messageerror != '')">
                                            <el-alert @close="messageerror = ''" title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>General Info</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Cari User">
                                                                <el-input placeholder="Masukkan nama user, username, email atau nomor hp" v-model="forms.inputuser">
                                                                    <el-button slot="append" @click.prevent="searchUser" id="searching">Cari</el-button>
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nominal" prop="nominal">
                                                                <div class="el-form-item__content custom-price-format">
                                                                    <div class="el-input">
                                                                        <money v-model="forms.nominal" v-bind="money" class="el-input__inner"></money>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <div v-if="itemDataSearch.length !== 0">
                                                            <el-col :span="24">
                                                                <el-form-item label="User">
                                                                    <el-select v-model="userValue" placeholder="Select User">
                                                                        <el-option
                                                                            v-for="(dataUser, indexUser) in itemDataSearch"
                                                                            :key="indexUser"
                                                                            :label="dataUser.fullname"
                                                                            :value="dataUser.id">
                                                                            {{dataUser.fullname}} ({{dataUser.username}})
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                            <!-- <el-col :span="24" v-if="(itemDataSearch != 'nodata')">
                                                                <div class="detailSearchbyUsername">
                                                                    <el-row :gutter="20">
                                                                        <el-col :span="12">
                                                                            <el-form-item label="ID">
                                                                                {{itemDataSearch[0].id}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                        <el-col :span="12">
                                                                            <el-form-item label="Username">
                                                                                {{itemDataSearch[0].username}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                        <el-col :span="12">
                                                                            <el-form-item label="Email">
                                                                                {{itemDataSearch[0].email}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                        <el-col :span="12">
                                                                            <el-form-item label="Fullname">
                                                                                {{itemDataSearch[0].fullname}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                        <el-col :span="12">
                                                                            <el-form-item label="Phone Number">
                                                                                {{itemDataSearch[0].phone_number}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                        <el-col :span="12">
                                                                            <el-form-item label="Status">
                                                                                {{itemDataSearch[0].status}}
                                                                            </el-form-item>
                                                                        </el-col>
                                                                    </el-row>
                                                                </div>
                                                            </el-col>
                                                            <el-col :span="24" v-else>
                                                                <div class="detailSearchbyUsername gagal">
                                                                    User Tidak ditemukan
                                                                </div>
                                                            </el-col> -->
                                                        </div>
                                                        <div v-if="searchUserEmpty == 'nodata'">
                                                            <el-col :span="24">
                                                                <div class="detailSearchbyUsername gagal">
                                                                    User Tidak ditemukan
                                                                </div>
                                                            </el-col>
                                                        </div>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
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
    import FUNCTIONS from '@/functions'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'balance__topup',
        components: {Money},
        data () {
            var validatePrice = (rule, value, callback) => {
                var PriceString = this.forms.nominal
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if (PriceString.toString().length > 11) {
                        callback(new Error('Harga yang anda masukkan terlalu besar'));
                    }
                    callback();
                }
            };
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'manageBalance',
                typeSectionApi: 'withdraw',
                sectionUserApi: 'user',

                // for store data
                itemsData: [],
                itemDataDetail: [],
                itemDataSearch: [],
                userValue: '',
                searchUserEmpty: '',

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                titleForms: '',
                formsType: '',
                startDate: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',

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
                    inputuser: '',
                    userid: '',
                    nominal: '',
                },
                rules2:{
                    nominal: [ { required: true, validator: validatePrice, trigger: 'blur' } ],
                }
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['agent.topup'])
        },
        mounted () {
            // get all Data
            this.getPosts('', this.startDate[0], this.startDate[1])
        },
        watch:{
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            startDate: function(newStartDate){
                this.getPosts(this.searchQuery, newStartDate[0], newStartDate[1])
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods:{
            buildUrl (limit, page, search, startDate, EndDate) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&type=' + this.typeSectionApi + '&start_date=' + startDate + '&end_date=' + EndDate + '&direction=DESC'
            },

            buildUrlUser (limit, page, searchbyUsername) {
                return this.apiUrl + this.sectionUserApi + "?limit=100&page=1" + '&search=' + searchbyUsername
            },
            
            // get all post
            getPosts(search, startDate, endDate){
                let url = this.buildUrl(this.perPage, this.currentPage, search, startDate, endDate)
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

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.searchQuery, this.startDate[0], this.startDate[1])
            }, 300),

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.searchQuery, this.startDate[0], this.startDate[1])
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.searchQuery, this.startDate[0], this.startDate[1])
                this.loading = true
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
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
                        this.titleForms = 'Agen Withdraw Detail - ' + this.itemDataDetail.user.fullname
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => {
                        this.loadingForm = false
                    })
                }
            },

            // Create Forms function
            Create(){
                this.titleForms = "Agen Withdrawal Baru"
                this.formsType = 'create'
                this.messageerror = ''
                this.messagesuccess = ''
                this.forms.inputuser = ''
                this.forms.nominal = ''
                this.itemDataSearch = []
                this.searchUserEmpty = ''
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

            // Search User by Username
            searchUser(){
                this.itemDataSearch = []
                this.userValue = ''
                this.searchUserEmpty = ''
                let loadingform = FUNCTIONS.svgSpinner;
                let url = this.buildUrlUser(this.perPage, this.currentPage, this.forms.inputuser)
                document.getElementById('searching').children[0].innerHTML = loadingform
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        document.getElementById('searching').children[0].innerHTML = 'Cari'
                        if((response.data.data).length !== 0){
                            this.itemDataSearch = response.data.data
                            if(this.itemDataSearch.length == 1){
                                this.userValue = this.itemDataSearch[0].id
                            }
                        }else{
                            this.searchUserEmpty = 'nodata'
                        }
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            // Submit Save
            submitSave(formName, formtype){
                this.messageerror = ''
                this.messagesuccess = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            if(this.userValue == ''){
                                this.messageerror = "Anda Belum Memilih User"
                            }else{
                                document.getElementById('save').children[0].innerHTML = loadingform
                                let urlv = this.apiUrl + this.sectionApi
                                this.axios.post(urlv, {
                                    user_id: this.userValue,
                                    nominal: this.forms.nominal,
                                    type: this.typeSectionApi
                                })
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error'){
                                        this.messageerror = (response.data.message).toString()
                                    }else{
                                        this.messagesuccess = "Pengurangan saldo berhasil disimpan"
                                        this.getPosts('', this.startDate[0], this.startDate[1])
                                        this.closeModal();
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }
                        }
                    }else{
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                })
            }
        }
    }
</script>