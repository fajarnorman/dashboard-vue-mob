<template>
    <div class="content-wrapper">
        <div id="confirmation-topup">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Daftar Konfirmasi Top Up</h4>
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
                                <el-alert title="" type="success" @close="closeMessage" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Konfirmasi" name="confirmed"></el-tab-pane>
                                    <el-tab-pane label="Disetujui" name="approved"></el-tab-pane>
                                    <el-tab-pane label="Ditolak" name="rejected"></el-tab-pane>
                                    <el-tab-pane label="User Belum Konfirmasi" name="waiting"></el-tab-pane>
                                    <el-tab-pane label="Kadaluarsa" name="expired"></el-tab-pane>
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
                                <!-- <el-table-column type="selection" width="45" v-if="(filterQuery == 'confirmed' || filterQuery == 'expired')"></el-table-column> -->
                                <el-table-column prop="trx_id" label="Transaction ID" width="190" class-name="testing123"></el-table-column>
                                <el-table-column prop="fullname" label="Full Name" width="180"></el-table-column>
                                <el-table-column prop="username" label="Username" width="120"></el-table-column>
                                <el-table-column label="Bank" width="80">
                                    <template slot-scope="scope">
                                        <div v-if="(scope.row.payment_method == 'bank_bca_')">BCA</div>
                                        <div v-else-if="(scope.row.payment_method == 'bank_bri_')">BRI</div>
                                        <div v-else-if="(scope.row.payment_method == 'bank_bni_')">BNI</div>
                                        <div v-else>{{scope.row.payment_method}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Amount" width="120">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(parseInt(scope.row.amount_confirm) + parseInt(scope.row.unique_code))}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="Status" width="150"></el-table-column>
                                <el-table-column prop="created_at" label="Created At"></el-table-column>
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
                                            <el-checkbox v-model="afterChecked">{{totalChecked}} items terpilih <span style="font-size: 12px;color:#800080;">(note: Maksimal 5 transaksi top up )</span></el-checkbox>
                                            <div class="float-right">
                                                <el-button class="button-outline-green" round @click.prevent="confirmAll()">Konfirmasi Semua</el-button>
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
                                        <el-button @click="closeModal()" id="cancel"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" @close="closeError" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Transaksi Top up</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID Konfirmasi">
                                                                <div v-if="itemDataDetail.confirmation">
                                                                    {{itemDataDetail.confirmation.id}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="ID Transaksi">
                                                                <div v-if="itemDataDetail.topup">
                                                                    {{itemDataDetail.topup.trx_id}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Transaksi">
                                                                <div v-if="itemDataDetail.topup">
                                                                    {{itemDataDetail.topup.created_at}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Bank">
                                                                <div v-if="itemDataDetail.topup">
                                                                    <div v-if="(itemDataDetail.topup.payment_method == 'bank_bca_')">BCA</div>
                                                                    <div v-else-if="(itemDataDetail.topup.payment_method == 'bank_bri_')">BRI</div>
                                                                    <div v-else-if="(itemDataDetail.topup.payment_method == 'bank_bni_')">BNI</div>
                                                                    <div v-else>{{itemDataDetail.topup.payment_method}}</div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jumlah">
                                                                <div v-if="itemDataDetail.topup">
                                                                    <span v-show="!isInput">IDR {{formatPrice(nominal)}}
                                                                        <el-button 
                                                                            class="button-white-green" 
                                                                            v-show="(filterQuery == 'confirmed' || topupStatus == 'expired' || filterQuery == 'waiting')"
                                                                            style="padding: 6px 10px 5px;margin-left: 10px;"
                                                                            v-on:click='isInput = !isInput'
                                                                            v-if="$dataRole['topup.confirm.edit']">
                                                                            <img src="~assets/images/icons/edit-white.png" alt="edit" style="width: 13px;margin-top: -3px;">
                                                                        </el-button>
                                                                    </span>
                                                                    <div v-show="isInput">
                                                                        <el-input v-model="nominal" class="input-with-select custom-validnum" type="number">
                                                                            <el-button slot="append" @click='calcelNominal()' class="reset">Batal</el-button>
                                                                            <el-button style="vertical-align: bottom;" slot="append" @click='changeNominal()'><img style="position: relative;" src="~assets/images/icons/checkmark-white.png" alt=""></el-button>
                                                                        </el-input>
                                                                        <label v-if="errorlabel" style="color: red; font-size: 12px;">Jumlah Transaksi Topup tidak boleh kosong</label>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                <div v-if="itemDataDetail.confirmation">
                                                                    {{itemDataDetail.confirmation.status}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Info Pelanggan</h5>
                                                <div class="forms-details" v-if="itemDataDetail.customer">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID">
                                                                {{itemDataDetail.customer.id}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Email">
                                                                <div v-if="itemDataDetail.customer.email != null">{{itemDataDetail.customer.email}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Aktivitas Terakhir">
                                                                {{itemDataDetail.customer.last_activity}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama">
                                                                {{itemDataDetail.customer.fullname}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Username">
                                                                {{itemDataDetail.customer.username}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="User Upgrade">
                                                                <span class="badge inline success" v-if="itemDataDetail.customer.status_upgrade == 'verified'">{{itemDataDetail.customer.status_upgrade}}</span>
                                                                <span class="badge inline failed" v-else>Belum melakukan upgrade</span>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Telepon">
                                                                {{itemDataDetail.customer.phone_number}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tempat Lahir">
                                                                <div v-if="(itemDataDetail.customer.birthplace == null || itemDataDetail.customer.birthplace == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.birthplace}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Lahir">
                                                                {{itemDataDetail.customer.birthday}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Poin">
                                                                {{itemDataDetail.customer.points}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Saldo">
                                                                {{itemDataDetail.customer.balance}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jenis Kelamin">
                                                                <div v-if="(itemDataDetail.customer.gender == null || itemDataDetail.customer.gender == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.gender}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Alamat">
                                                                <div v-if="(itemDataDetail.customer.address == null || itemDataDetail.customer.address == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.address}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status">
                                                                {{itemDataDetail.customer.status}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kode Area">
                                                                <div v-if="(itemDataDetail.customer.code_area == null || itemDataDetail.customer.code_area == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.code_area.name}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi">
                                                                <div v-if="(itemDataDetail.customer.province_id == null || itemDataDetail.customer.province_id == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.province_id.name}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kota">
                                                                <div v-if="(itemDataDetail.customer.city_id == null || itemDataDetail.customer.city_id == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.city_id.name}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jenis Pertanian">
                                                                <div v-if="(itemDataDetail.customer.agriculture_category_id == null || itemDataDetail.customer.agriculture_category_id == '')">-</div>
                                                                <div v-else>{{itemDataDetail.customer.agriculture_category_id.name}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-if="(filterQuery != 'confirmed' && topupStatus != 'expired' && filterQuery != 'waiting')" class="button-outline-black" id="cancel" @click="closeModal()">Close</el-button>
                                    <div v-if="$dataRole['topup.confirm.approval']">
                                        <el-button v-if="(filterQuery == 'confirmed' || topupStatus == 'expired' || filterQuery == 'waiting')" class="button-outline-black" id="reject" @click.prevent="submitSave('formsvalid', 'reject')">Tolak</el-button>
                                        <el-button v-if="(filterQuery == 'confirmed' || topupStatus == 'expired' || filterQuery == 'waiting')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Konfirmasi</el-button>
                                    </div>
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
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'confirmation-topup',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'topup',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemDataDetailBulk: [],
                topupStatus: '',

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: 'confirmed',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                isInput: false,
                nominal: '',
                nominalFake: '',
                direction: 'DESC',

                // message variable
                messageerror: '',
                messagesuccess: '',
                errorlabel: false,

                multipleSelection: '',
                totalChecked: '',
                itemiDforDelete: '',
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['topup.confirm.list'])
        },
        mounted () {
            // Get all Post user
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
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
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search, status) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&status=' + status + '&direction=' + this.direction
            },

            // get all post
            getPosts(num, pg, sch, sts){
                let url = this.buildUrl(num, pg, sch, sts)
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

                        // let totalDataforSidebar

                        // if(this.totalPage >= 100){
                        //     totalDataforSidebar = '99+'
                        // }else{
                        //     totalDataforSidebar = this.totalPage
                        // }

                        // document.getElementById('bagde-topup-confirmations').textContent = totalDataforSidebar
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
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
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
                if(this.$dataRole['topup.confirm.show']){
                    if(val){
                        this.messageerror = ''
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true
                        this.titleForms = ' Detail Konfirmasi Top Up'

                        let url = this.apiUrl + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.topupStatus = this.itemDataDetail.topup.status
                            this.nominal = parseInt(this.itemDataDetail.confirmation.amount) + parseInt(this.itemDataDetail.confirmation.unique_code)
                            this.nominalFake = parseInt(this.itemDataDetail.confirmation.amount) + parseInt(this.itemDataDetail.confirmation.unique_code)
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.loadingForm = false
                            document.querySelector(".custom-validnum input").addEventListener("keypress", function (evt) {
                                if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57){
                                    evt.preventDefault();
                                }
                            });
                        })
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
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

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
                this.messageerror = ''
                this.isInput = false
                this.errorlabel = false
            },

            closeError(){
                this.messageerror = ''
            },

            changeNominal(){
                if(this.nominal != '' || this.nominal != 0){
                    let url = this.apiUrl + this.sectionApi + "/changeNominal/" + this.itemDataDetail.confirmation.id
                    this.errorlabel = false
                    this.axios.put(url, {
                        nominalEdit: this.nominal
                    })
                    .then(response => {
                        if(response.data.status == 'success'){
                            this.nominal = parseInt(response.data.data.amount) + parseInt(response.data.data.unique_code)
                            this.loadingForm = false
                            this.isInput = false
                            this.errorlabel = false
                            this.closeModal()
                            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                        }else{
                            this.$notify.error({
                                title: 'Error',
                                message: response.data.message
                            });
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })
                }else{
                    this.errorlabel = true
                }
            },

            calcelNominal(){
                this.nominal = this.nominalFake
                this.isInput = !this.isInput
                this.errorlabel = false
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerror = ''
                if(this.isInput == false){
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + this.sectionApi + '/approve/' + this.itemDataDetail.confirmation.id

                        this.axios.get(urlv)
                        .then(response => {
                            document.getElementById('save').children[0].innerHTML = 'Konfirmasi'
                            if(response.data.status == 'error'){
                                this.messageerror = response.data.message
                            }else{
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                                this.closeModal();
                            }
                        })
                        .catch(error => { 
                            console.log(error)
                        })
                    }else{
                        document.getElementById('reject').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + this.sectionApi + '/cancel/' + this.itemDataDetail.confirmation.id

                        this.axios.get(urlv)
                        .then(response => {
                            document.getElementById('reject').children[0].innerHTML = 'Tolak'
                            if(response.data.status == 'error'){
                                this.messageerror = response.data.message
                            }else{
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                                this.closeModal();
                            }
                        })
                        .catch(error => { 
                            console.log(error)
                        })
                    }
                }else{
                    this.messageerror = 'Mohon simpan perubahan Jumlah Transaksi Topup anda terlebih dahulu'
                    JQuery('.base-template-sidebar .content').scrollTop(0);
                }
            },

            asyncFunction (item, cb) {
                setTimeout(() => {
                    cb();
                }, 100);
            },

            confirmAll(){
                this.messagesuccess = ''
                this.$confirm('Apakah anda yakin untuk mengkonfirmasi transaksi ini', 'Perhatian', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let data = this.multipleSelection
                    if(data.length <= 5){
                        let that = this
                        this.loading = true
                        var itemsProcessed = 0

                        // for detail konfirmation
                        data.forEach((item, index, array) => {
                            let url = this.apiUrl + this.sectionApi + "/" + item.id
                            this.axios.get(url)
                            .then(response => { 
                                if(response.data.status == 'success'){
                                    this.itemDataDetailBulk.push(response.data.data.confirmation.id)
                                }
                            })
                            .catch(error => { 
                                console.log(error);
                                this.errored = true
                            })
                            .finally(() => {
                                if(that.filterQuery == 'confirmed'){
                                    that.itemDataDetailBulk.forEach((item, index, array) => {
                                        let urlApprove = that.apiUrl + that.sectionApi + '/approve/' + item
                                        that.axios.get(urlApprove)
                                        .then(response => {
                                            if(response.data.status == 'error'){
                                                that.messageerror = response.data.message
                                            }
                                        })
                                        .catch(error => { 
                                            console.log(error)
                                        })
                                        .finally(() => {
                                            that.asyncFunction(item, () => {
                                                itemsProcessed++;
                                                if(itemsProcessed === array.length) {
                                                    // console.log(itemsProcessed + ' - ' + array.length)
                                                    that.getPosts(that.perPage, that.currentPage, that.searchQuery, that.filterQuery)
                                                    that.loading = false 
                                                    that.messagesuccess = array.length + " Transaksi telah berhasil di konfirmasi"
                                                }
                                            });
                                        })
                                    })
                                }else{
                                    that.itemDataDetailBulk.forEach((item, index, array) => {
                                        let urlReject = that.apiUrl + that.sectionApi + '/cancel/' + item
                                        that.axios.get(urlReject)
                                        .then(response => {
                                            if(response.data.status == 'error'){
                                                that.messageerror = response.data.message
                                            }else{
                                                that.getPosts(that.perPage, that.currentPage, that.searchQuery, that.filterQuery)
                                                that.loading = false
                                            }
                                        })
                                        .catch(error => { 
                                            console.log(error)
                                        })
                                        .finally(() => {
                                            that.asyncFunction(item, () => {
                                                itemsProcessed++;
                                                if(itemsProcessed === array.length) {
                                                    // console.log(itemsProcessed + ' - ' + array.length)
                                                    that.getPosts(that.perPage, that.currentPage, that.searchQuery, that.filterQuery)
                                                    that.loading = false 
                                                    that.messagesuccess = array.length + " Transaksi telah berhasil di konfirmasi"
                                                }
                                            });
                                        })
                                    })
                                }
                            })
                        }, this)

                        // for(let i = 0; i< data.length; i++){
                        //     let url = this.apiUrl + this.sectionApi + "/" + data[i].id
                        //     this.axios.get(url)
                        //     .then(response => { 
                        //         if(response.data.status == 'success'){
                        //             this.itemDataDetailBulk.push(response.data.data.confirmation.id)
                        //         }
                        //     })
                        //     .catch(error => { 
                        //         console.log(error);
                        //         this.errored = true
                        //     })
                        //     .finally(() => {
                        //         if(that.filterQuery == 'confirmed'){
                        //             that.itemDataDetailBulk.forEach((id, index, array) => {
                        //                 let urlApprove = that.apiUrl + that.sectionApi + '/approve/' + id
                        //                 that.axios.get(urlApprove)
                        //                 .then(response => {
                        //                     if(response.data.status == 'error'){
                        //                         that.messageerror = response.data.message
                        //                     }else{
                        //                         that.getPosts(that.perPage, that.currentPage, that.searchQuery, that.filterQuery)
                        //                         that.loading = false 
                        //                         that.messagesuccess = data.length + " Transaksi telah berhasil di konfirmasi"
                        //                     }
                        //                 })
                        //                 .catch(error => { 
                        //                     console.log(error)
                        //                 })
                        //             })
                        //         }else{
                        //             that.itemDataDetailBulk.forEach(function(id){
                        //                 let urlReject = that.apiUrl + that.sectionApi + '/cancel/' + id
                        //                 that.axios.get(urlReject)
                        //                 .then(response => {
                        //                     if(response.data.status == 'error'){
                        //                         that.messageerror = response.data.message
                        //                     }else{
                        //                         that.getPosts(that.perPage, that.currentPage, that.searchQuery, that.filterQuery)
                        //                         that.loading = false
                        //                     }
                        //                 })
                        //                 .catch(error => { 
                        //                     console.log(error)
                        //                 })
                        //             })
                        //         }
                        //     })
                        // }
                    }else{
                        this.$notify.error({
                            title: 'Maaf',
                            message: 'Maksimal 5 transaksi top up yang dapat di konfirmasi sekaligus'
                        });
                    }
                })
            },

            closeMessage(){
                this.messagesuccess = ''
                this.messageerror = ''
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>
<style lang="scss">
    .input-with-select{
        .el-input-group__append{
            button{
                &.reset{
                    background: #fff;
                    color: #697586;
                    padding: 10px 15px 8px;
                    border-radius: 0;
                    border-top: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    margin-right: -10px;
                }
            }
        }
    }
</style>